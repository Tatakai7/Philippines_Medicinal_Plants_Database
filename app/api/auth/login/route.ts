import { connectDB } from "@/lib/db"
import { verifyPassword } from "@/lib/utils"
import type { ApiResponse, AuthSession } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ token: string }>>> {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const adminsCollection = db.collection("admins")

    // Find admin by username
    const admin = await adminsCollection.findOne({ username })

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 }
      )
    }

    // Verify password
    if (!verifyPassword(password, admin.password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 }
      )
    }

    // Create session token (simple JWT-like token for demo)
    const sessionData: AuthSession = {
      username: admin.username,
      email: admin.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    }

    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64")

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
        },
        message: "Login successful",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `admin_token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`,
        },
      }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 }
    )
  }
}
