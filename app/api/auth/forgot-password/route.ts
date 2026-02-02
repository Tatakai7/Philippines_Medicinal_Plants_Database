import { connectDB } from "@/lib/db"
import type { ApiResponse } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Simple in-memory OTP store (in production, use Redis or database)
const otpStore: Map<
  string,
  { code: string; expiresAt: number; username: string; email: string }
> = new Map()

function generateOTP(): string {
  return Math.random().toString().slice(2, 8)
}

async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Recovery OTP - Philippines Medicinal Plants Database",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 20px; border-radius: 8px; color: white; text-align: center;">
            <h2 style="margin: 0;">Password Recovery</h2>
          </div>
          <div style="padding: 20px; background-color: #f9fafb;">
            <p>Hello,</p>
            <p>You requested to recover your account. Here is your One-Time Password (OTP):</p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #10b981;">
              <h1 style="color: #10b981; margin: 0; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
            </div>
            <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
            <p style="color: #666;">If you did not request a password recovery, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">Philippines Medicinal Plants Database</p>
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)
    console.log(`OTP sent successfully to ${email}`)
    return true
  } catch (error) {
    console.error("Error sending OTP email:", error)
    return false
  }
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
