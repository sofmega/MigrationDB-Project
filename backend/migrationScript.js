// migrationScript.js

/*
 * =================================================================================
 * ONE-TIME MIGRATION SCRIPT
 * =================================================================================
 *
 * Description:
 * This script migrates user data from a PostgreSQL database (via Prisma) to
 * Firebase Authentication and Firestore.
 *
 * How it works:
 * 1. It connects to your existing PostgreSQL database using the Prisma client.
 * 2. It initializes the Firebase Admin SDK with your service account credentials.
 * 3. It fetches all users from your 'User' table in PostgreSQL.
 * 4. For each user, it performs two actions:
 * a. Creates an account in Firebase Authentication with the user's email.
 * IMPORTANT: Passwords cannot be migrated directly because they are securely
 * hashed and cannot be decrypted. This script will create users without a
 * password. Users will need to use the "Forgot Password" flow to set their
 * password upon their first login to the new system.
 * b. Creates a corresponding document in a 'users' collection in Firestore.
 * This document will store the user's additional data (name, original ID, etc.).
 *
 * Pre-requisites:
 * 1. Install necessary packages:
 * npm install @prisma/client firebase-admin
 * 2. Download your Firebase service account key:
 * - Go to your Firebase project settings > Service accounts.
 * - Click "Generate new private key" and save the downloaded JSON file.
 * - RENAME the file to 'firebase-service-account-key.json' and place it in the
 * same directory as this script.
 * 3. Ensure your .env file with the DATABASE_URL is in the same directory.
 *
 * How to run:
 * - Execute the script from your terminal: node migrationScript.js
 *
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const admin = require("firebase-admin");

// --- CONFIGURATION ---

// Path to your Firebase service account key file
const serviceAccount = require("./firebase-service-account-key.json");

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

/**
 * Main function to migrate user data.
 */
async function migrateData() {
  console.log("Starting migration from Supabase/Prisma to Firebase...");

  try {
    // 1. Fetch all users from the PostgreSQL database via Prisma
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} users to migrate.`);

    let successCount = 0;
    let errorCount = 0;

    // 2. Loop through each user and migrate them to Firebase
    for (const user of allUsers) {
      try {
        console.log(`\nMigrating user: ${user.email} (ID: ${user.id})`);

        // a. Create user in Firebase Authentication
        // Note: We are creating the user without a password. They will need to reset it.
        const userRecord = await auth.createUser({
          uid: `prisma_${user.id}`, // Optional: Use Prisma ID to create a predictable UID
          email: user.email,
          displayName: user.name,
          emailVerified: true, // Assuming emails from the old DB are verified
        });

        console.log(` -> Successfully created Firebase Auth user: ${userRecord.uid}`);

        // b. Create a corresponding document in Firestore
        const userDocRef = db.collection("users").doc(userRecord.uid);
        await userDocRef.set({
          name: user.name,
          email: user.email,
          createdAt: user.createdAt, // Preserve original creation timestamp
          updatedAt: user.updatedAt,
          originalPrismaId: user.id, // Keep a reference to the old ID
        });

        console.log(` -> Successfully created Firestore document for ${user.email}`);
        successCount++;

      } catch (error) {
        console.error(` !! Error migrating user ${user.email}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n========================================");
    console.log("Migration complete!");
    console.log(`  Successfully migrated: ${successCount} users`);
    console.log(`  Failed to migrate:   ${errorCount} users`);
    console.log("========================================");

  } catch (error) {
    console.error("A critical error occurred during the migration process:", error);
  } finally {
    // 3. Disconnect from the Prisma client
    await prisma.$disconnect();
    console.log("Disconnected from Prisma.");
  }
}

// Run the migration
migrateData();
