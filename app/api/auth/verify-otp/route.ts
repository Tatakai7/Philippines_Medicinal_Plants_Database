import type { ApiResponse } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"
import { otpStore } from "../forgot-password/route"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ username: string; email: string }>>> {
  try {
    const { email, otp } = await request.json()

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and OTP are required",
        },
        { status: 400 }
      )
    }

    // Check if OTP exists
    const storedOTP = otpStore.get(email)

    if (!storedOTP) {
      return NextResponse.json(
        {
          success: false,
          error: "OTP not found or expired. Please request a new one.",
        },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email)
      return NextResponse.json(
        {
          success: false,
          error: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      )
    }

    // Check if OTP is correct
    if (storedOTP.code !== otp) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid OTP. Please try again.",
        },
        { status: 400 }
      )
    }

    // OTP is valid, return username and email
    return NextResponse.json(
      {
        success: true,
        data: {
          username: storedOTP.username,
          email: storedOTP.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred. Please try again.",
      },
      { status: 500 }
    )
  }
}
