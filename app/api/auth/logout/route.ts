import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

export async function POST(): Promise<NextResponse<ApiResponse<null>>> {
  return NextResponse.json(
    {
      success: true,
      message: "Logout successful",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": "admin_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict",
      },
    }
  )
}
