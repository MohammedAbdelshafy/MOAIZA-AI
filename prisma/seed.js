const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample company
  const company = await prisma.company.create({
    data: {
      name: 'Al-Noor Construction',
      email: 'info@alnoor.eg',
      country: 'Egypt',
      city: 'Cairo',
      phone: '+201001234567',
    },
  });

  console.log('✅ Company created:', company.name);

  // Create sample users
  const owner = await prisma.user.create({
    data: {
      email: 'owner@alnoor.eg',
      password: 'hashed_password_here', // In production, use bcrypt
      firstName: 'Ahmed',
      lastName: 'Hassan',
      role: 'OWNER',
      companyId: company.id,
    },
  });

  const estimator = await prisma.user.create({
    data: {
      email: 'estimator@alnoor.eg',
      password: 'hashed_password_here',
      firstName: 'Fatima',
      lastName: 'Mohamed',
      role: 'ESTIMATOR',
      companyId: company.id,
    },
  });

  console.log('✅ Users created');

  // Create sample materials
  const cement = await prisma.material.create({
    data: {
      name: 'Portland Cement',
      category: 'Cement',
      unit: 'ton',
      companyId: company.id,
    },
  });

  const steel = await prisma.material.create({
    data: {
      name: 'Steel Reinforcement',
      category: 'Steel',
      unit: 'ton',
      companyId: company.id,
    },
  });

  const sand = await prisma.material.create({
    data: {
      name: 'Concrete Sand',
      category: 'Sand',
      unit: 'm3',
      companyId: company.id,
    },
  });

  console.log('✅ Materials created');

  // Create sample suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Cairo Cement Co.',
      email: 'sales@caircement.eg',
      phone: '+201001234567',
      location: 'Cairo',
      companyId: company.id,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Steel Egypt',
      email: 'sales@steelegypt.eg',
      phone: '+201001234568',
      location: 'Alexandria',
      companyId: company.id,
    },
  });

  console.log('✅ Suppliers created');

  // Create material prices
  await prisma.materialPrice.create({
    data: {
      price: 1200,
      currency: 'EGP',
      materialId: cement.id,
      supplierId: supplier1.id,
      region: 'Cairo',
    },
  });

  await prisma.materialPrice.create({
    data: {
      price: 15000,
      currency: 'EGP',
      materialId: steel.id,
      supplierId: supplier2.id,
      region: 'Cairo',
    },
  });

  await prisma.materialPrice.create({
    data: {
      price: 150,
      currency: 'EGP',
      materialId: sand.id,
      supplierId: supplier1.id,
      region: 'Cairo',
    },
  });

  console.log('✅ Material prices created');

  // Create sample tender
  const tender = await prisma.tender.create({
    data: {
      title: 'Metro Line Extension Project',
      description: 'Construction of 5km metro line extension',
      clientName: 'Cairo Metro Authority',
      projectLocation: 'Cairo, Egypt',
      status: 'ANALYZED',
      companyId: company.id,
      bidStrategy: 'BALANCED',
      estimatedCost: 50000000,
      recommendedBid: 55000000,
      expectedMargin: 10,
      riskScore: 35,
    },
  });

  console.log('✅ Tender created:', tender.title);

  // Create sample BOQ items
  await prisma.bOQItem.create({
    data: {
      tenderId: tender.id,
      description: 'Reinforced Concrete - Beams',
      quantity: 500,
      unit: 'ton',
      specifications: 'C30, Fe500',
      unitRate: 3500,
      totalCost: 1750000,
      confidence: 0.95,
      tradeCategory: 'Concrete',
    },
  });

  await prisma.bOQItem.create({
    data: {
      tenderId: tender.id,
      description: 'Steel Reinforcement',
      quantity: 800,
      unit: 'ton',
      specifications: 'Fe500, Grade 8.8',
      unitRate: 15000,
      totalCost: 12000000,
      confidence: 0.92,
      tradeCategory: 'Steel',
    },
  });

  await prisma.bOQItem.create({
    data: {
      tenderId: tender.id,
      description: 'Concrete Sand',
      quantity: 2000,
      unit: 'm3',
      specifications: 'Fine sand, FM 2.8',
      unitRate: 150,
      totalCost: 300000,
      confidence: 0.88,
      tradeCategory: 'Sand',
    },
  });

  console.log('✅ BOQ items created');

  // Create historical bid
  await prisma.historicalBid.create({
    data: {
      companyId: company.id,
      clientName: 'Cairo Municipality',
      projectName: 'Road Rehabilitation Project',
      estimatedCost: 2500000,
      bidAmount: 2750000,
      margin: 10,
      status: 'WON',
      winningBid: 2750000,
    },
  });

  console.log('✅ Historical bid created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
