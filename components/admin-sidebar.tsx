"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: AdminSidebarProps) {
  const router = useRouter()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "manage-plants", label: "Manage Plants", icon: "🌿" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      localStorage.removeItem("admin_token")
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden bg-primary text-white p-2 rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-16 left-0 h-screen w-64 bg-card border-r border-border transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-2 flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Admin Panel</h3>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent dark:hover:bg-primary dark:hover:text-primary-foreground">
                ← Back to Site
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}
