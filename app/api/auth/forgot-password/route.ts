import { connectDB } from "@/lib/db"
import type { ApiResponse } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

// Simple in-memory OTP store (in production, use Redis or database)
const otpStore: Map<
  string,
  { code: string; expiresAt: number; username: string; email: string }
> = new Map()

function generateOTP(): string {
  return Math.random().toString().slice(2, 8)
}

function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  // In production, integrate with Nodemailer, SendGrid, or similar
  // For now, we'll log it to console
  console.log(`OTP sent to ${email}: ${otp}`)
  return Promise.resolve(true)
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const adminsCollection = db.collection("admins")

    // Find admin by email
    const admin = await adminsCollection.findOne({ email })

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email",
        },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP
    otpStore.set(email, {
      code: otp,
      expiresAt,
      username: admin.username,
      email: admin.email,
    })

    // Send OTP email
    await sendOTPEmail(email, otp)

    return NextResponse.json(
      {
        success: true,
        data: { message: "OTP sent to your email" },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred. Please try again.",
      },
      { status: 500 }
    )
  }
}

// Export for recovery route
export { otpStore }
