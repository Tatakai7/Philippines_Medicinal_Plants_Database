import { MongoClient } from "mongodb"
import crypto from "crypto"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "medicinal_plants_db"

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex")
  return `${salt}:${hash}`
}

async function seedAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const adminsCollection = db.collection("admins")

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({})
    if (existingAdmin) {
      console.log("Admin user already exists:")
      console.log(`  Username: ${existingAdmin.username}`)
      console.log(`  Email: ${existingAdmin.email}`)
      console.log("\nTo create a new admin, delete the existing one first.")
      return
    }

    // Create default admin user
    const adminData = {
      username: "admin",
      email: "admin@medicinalplants.ph",
      password: hashPassword("admin123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await adminsCollection.insertOne(adminData)
    console.log("✅ Admin user created successfully!")
    console.log(`\nLogin Credentials:`)
    console.log(`  Username: ${adminData.username}`)
    console.log(`  Email: ${adminData.email}`)
    console.log(`  Password: admin123`)
    console.log(`\n⚠️  Please change the password after first login!`)
    console.log(`\nAdmin ID: ${result.insertedId}`)
  } catch (error) {
    console.error("Error seeding admin user:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedAdminUser()
