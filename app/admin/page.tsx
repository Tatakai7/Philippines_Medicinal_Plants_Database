"use client"

import { useState, lazy, Suspense } from "react"
import Navigation from "@/components/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import AdminStatsSkeleton from "@/components/skeletons/admin-stats-skeleton"
import PlantManagementSkeleton from "@/components/skeletons/plant-management-skeleton"

const AdminStats = lazy(() => import("@/components/admin/admin-stats"))
const PlantManagement = lazy(() => import("@/components/admin/plant-management"))

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Navigation />
      <main className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "dashboard" && (
              <Suspense fallback={<AdminStatsSkeleton />}>
                <AdminStats />
              </Suspense>
            )}
            {activeTab === "manage-plants" && (
              <Suspense fallback={<PlantManagementSkeleton />}>
                <PlantManagement />
              </Suspense>
            )}
            {activeTab === "settings" && (
              <div className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>
                <p className="text-muted-foreground">Database settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
