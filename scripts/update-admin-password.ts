import { db } from "@/lib/db"
import { hash } from "bcryptjs"

async function updateAdminPassword() {
  try {
    // Replace 'admin@example.com' with your admin's email
    const adminEmail = 'ja1234567899@gmail.com'
    // Replace 'your-new-password' with the desired password
    const newPassword = 'Twojastara123.'

    const hashedPassword = await hash(newPassword, 12)

    const updatedUser = await db.user.update({
      where: {
        email: adminEmail
      },
      data: {
        password: hashedPassword
      }
    })

    console.log('Successfully updated password for user:', updatedUser.email)
  } catch (error) {
    console.error('Error updating password:', error)
  } finally {
    await db.$disconnect()
  }
}

updateAdminPassword() 