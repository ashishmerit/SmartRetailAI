import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />

      <Separator
        orientation="vertical"
        className="h-5"
      />

      {/* Search */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search SmartRetailAI..."
            className="h-9 border-muted-foreground/20 bg-muted/30 pl-9"
          />
        </div>
      </div>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
      </Button>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">
            Admin
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Store Manager
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
          A
        </div>
      </div>
    </header>
  )
}