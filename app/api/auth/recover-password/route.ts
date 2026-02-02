import { connectDB } from "@/lib/db"
import { hashPassword } from "@/lib/utils"
import type { ApiResponse } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"
import { otpStore } from "../forgot-password/route"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    const { email, newPassword, confirmPassword } = await request.json()

    // Validate input
    if (!email || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and new password are required",
        },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Passwords do not match",
        },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      )
    }

    // Check if OTP was verified (email must be in otpStore)
    const otpData = otpStore.get(email)
    if (!otpData) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request. Please verify OTP first.",
        },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const adminsCollection = db.collection("admins")

    // Update password
    const hashedPassword = hashPassword(newPassword)
    const result = await adminsCollection.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update password",
        },
        { status: 500 }
      )
    }

    // Clear OTP from store
    otpStore.delete(email)

    return NextResponse.json(
      {
        success: true,
        data: { message: "Password updated successfully" },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password recovery error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred. Please try again.",
      },
      { status: 500 }
    )
  }
}
