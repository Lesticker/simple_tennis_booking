const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Create a new PrismaClient instance
const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin details - customize these as needed
    const adminData = {
      name: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      password: 'Admin123!', // Will be hashed before storing
      role: 'ADMIN'
    };

    console.log('Creating admin user with email:', adminData.email);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    console.log('Password hashed successfully');

    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        name: adminData.name,
        surname: adminData.surname,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      },
    });

    console.log('Admin user created successfully:');
    console.log({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
createAdminUser(); 