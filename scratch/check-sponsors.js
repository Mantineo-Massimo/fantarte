const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const sponsors = await prisma.sponsor.findMany();
  console.log("Sponsors in DB:", sponsors);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
