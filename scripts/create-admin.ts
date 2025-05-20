import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin details - change these as needed
    const adminData = {
      name: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed before storing
      role: Role.ADMIN
    };

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash the password
    const hashedPassword = await hash(adminData.password, 12);

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

createAdminUser(); 