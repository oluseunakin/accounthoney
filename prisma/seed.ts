import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const name = "Oluseun Akin";

  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.user.create({
    data: {
      name,
      password: "harkindoyin",
      type: "admin",
    },
  });

  await prisma.user.create({
    data: {},
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
