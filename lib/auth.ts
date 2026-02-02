import type { AuthSession } from "@/lib/types"

/**
 * Get the current auth session from localStorage
 */
export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("admin_token")
  if (!token) {
    return null
  }

  try {
    const session = JSON.parse(Buffer.from(token, "base64").toString("utf-8")) as AuthSession
    
    // Check if token is expired
    if (session.exp && session.exp * 1000 < Date.now()) {
      localStorage.removeItem("admin_token")
      return null
    }

    return session
  } catch (error) {
    console.error("Error parsing auth session:", error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}

/**
 * Clear auth session
 */
export function clearAuthSession(): void {
  localStorage.removeItem("admin_token")
}
