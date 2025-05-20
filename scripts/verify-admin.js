const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    // Find all admin users
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      }
    });

    console.log('Found admin users:', admins.length);
    
    // Display admin users (without password)
    admins.forEach(admin => {
      console.log({
        id: admin.id,
        name: admin.name,
        surname: admin.surname,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt
      });
    });
    
  } catch (error) {
    console.error('Error checking admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers(); 