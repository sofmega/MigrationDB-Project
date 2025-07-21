// migration-script.js
require("dotenv").config({ path: "./.env" });
const { PrismaClient } = require("@prisma/client");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account-key.json");

const prisma = new PrismaClient();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

async function migrateData() {
  console.log("Starting migration from Supabase/Prisma to Firebase...");

  const allUsers = await prisma.user.findMany({
    include: {
      tasks: true,
    },
  });

  if (allUsers.length === 0) {
    console.log("No users found in Prisma database. Exiting.");
    return;
  }

  console.log(`Found ${allUsers.length} users to migrate.`);

  for (const user of allUsers) {
    let firebaseUid;
    try {
      const userRecord = await auth.createUser({
        email: user.email,
        emailVerified: true,
        displayName: user.name,

        password: "default-password-please-reset",
        disabled: false,
      });
      firebaseUid = userRecord.uid;
      console.log(
        `Successfully created Firebase Auth user for ${user.email} with UID: ${firebaseUid}`
      );

      await db.collection("users").doc(firebaseUid).set({
        name: user.name,
        email: user.email,
        migratedFrom: "supabase",
        originalPrismaId: user.id,
      });
      console.log(`-> Created Firestore profile for ${user.name}.`);

      if (user.tasks && user.tasks.length > 0) {
        console.log(
          `-> Migrating ${user.tasks.length} tasks for ${user.name}...`
        );
        const tasksCollection = db.collection("tasks");
        for (const task of user.tasks) {
          await tasksCollection.add({
            text: task.text,
            completed: task.completed,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            userId: firebaseUid,
          });
        }
        console.log(`-> Finished migrating tasks.`);
      }
    } catch (error) {
      console.error(`!! Failed to migrate user ${user.email}:`, error.message);

      continue;
    }
  }

  console.log("\nMigration completed!");
}

migrateData()
  .catch((e) => {
    console.error("An error occurred during migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
