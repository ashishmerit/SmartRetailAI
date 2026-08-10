import { Outlet } from "react-router-dom"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"

export function AppShell() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader />

        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}