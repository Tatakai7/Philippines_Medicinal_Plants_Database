import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectDB(): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017"

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    const db = client.db("medicinal_plants_db")

    cachedClient = client
    cachedDb = db

    console.log("Connected to MongoDB")
    return db
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export async function closeDB(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
    console.log("Disconnected from MongoDB")
  }
}

export function getDB(): Db {
  if (!cachedDb) {
    throw new Error("Database not connected. Call connectDB first.")
  }
  return cachedDb
}
