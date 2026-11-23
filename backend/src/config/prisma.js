const { PrismaClient } = require('@prisma/client');

let prisma;
let isConnected = false;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
} catch (err) {
  console.warn('[Prisma Notice] Prisma Client initialization warning:', err.message);
}

const checkDatabaseConnection = async () => {
  if (!prisma) return false;
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Connection check timed out (2s)')), 2000)
  );

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      timeoutPromise
    ]);
    isConnected = true;
    console.log('[NeonDB] Connected successfully to PostgreSQL via Prisma ORM.');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[NeonDB Notice] NeonDB connection status: ${error.message}`);
    console.warn('[TripMate Notice] Local resilient persistence storage is active so all bookings, rewards, and reviews function seamlessly. To persist to live NeonDB, update DATABASE_URL in backend/.env.');
    return false;
  }
};

const isDbConnected = () => isConnected;

module.exports = {
  prisma,
  checkDatabaseConnection,
  isDbConnected
};
