const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const flightsData = require('../src/data/flightsData');
const hotelsData = require('../src/data/hotelsData');
const packagesData = require('../src/data/packagesData');

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Seeding initial data into NeonDB...');

  // 1. Seed Admin & Test Customer
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tripmate.com' },
    update: {},
    create: {
      name: 'TripMate Administrator',
      email: 'admin@tripmate.com',
      password: hashedPassword,
      phone: '+880 1800-874762',
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'tanvir@example.com' },
    update: {},
    create: {
      name: 'Tanvir Ahmed',
      email: 'tanvir@example.com',
      password: hashedPassword,
      phone: '+880 1711-234567',
      role: 'CUSTOMER'
    }
  });

  // 2. Seed Flights
  for (const f of flightsData) {
    await prisma.flight.upsert({
      where: { flightNumber: f.flightNumber },
      update: {},
      create: {
        flightNumber: f.flightNumber,
        airlineName: f.airlineName,
        airlineLogo: f.airlineLogo,
        departureAirport: f.departureAirport,
        arrivalAirport: f.arrivalAirport,
        departureTime: f.departureTime,
        arrivalTime: f.arrivalTime,
        duration: f.duration,
        stops: f.stops,
        priceEconomy: f.priceEconomy,
        priceBusiness: f.priceBusiness,
        cabinClass: f.cabinClass,
        isSample: true
      }
    });
  }

  // 3. Seed Hotels
  for (const h of hotelsData) {
    await prisma.hotel.upsert({
      where: { id: h.id },
      update: {},
      create: {
        id: h.id,
        name: h.name,
        location: h.location,
        category: h.category,
        pricePerNight: h.pricePerNight,
        rating: h.rating,
        image: h.image,
        facilities: h.facilities,
        isPartnerHotel: h.isPartnerHotel,
        discountPercent: h.discountPercent,
        description: h.description
      }
    });
  }

  console.log('[Seed] NeonDB seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
