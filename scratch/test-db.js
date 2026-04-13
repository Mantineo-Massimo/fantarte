const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log("Testing Prisma connection with DATABASE_URL from .env...");
        const userCount = await prisma.user.count();
        console.log("Connection successful! User count:", userCount);
    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
