import { connectDB } from "@/lib/db"
import { hashPassword } from "@/lib/utils"
import type { ApiResponse, Admin } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Admin>>> {
  try {
    const { username, email, password, confirmPassword } = await request.json()

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Passwords do not match",
        },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters",
        },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const adminsCollection = db.collection("admins")

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      $or: [{ username }, { email }],
    })

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Username or email already exists",
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create admin
    const result = await adminsCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newAdmin: Admin = {
      _id: result.insertedId.toString(),
      username,
      email,
      password: "", // Don't return the actual password
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(
      {
        success: true,
        data: newAdmin,
        message: "Admin account created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during registration",
      },
      { status: 500 }
    )
  }
}
