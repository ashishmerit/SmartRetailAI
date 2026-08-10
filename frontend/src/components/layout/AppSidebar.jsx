import {
  BarChart3,
  Bot,
  ClipboardList,
  LayoutDashboard,
  ScanFace,
  Settings,
  ShoppingBasket,
  Star,
  UserPlus,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Customer",
    items: [
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
      },
      {
        title: "Enrollment",
        url: "/enrollment",
        icon: UserPlus,
      },
      {
        title: "Face Recognition",
        url: "/recognition",
        icon: ScanFace,
      },
      {
        title: "Visits",
        url: "/visits",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "AI & Intelligence",
    items: [
      {
        title: "Product Recognition",
        url: "/products",
        icon: ShoppingBasket,
      },
      {
        title: "Reviews & Sentiment",
        url: "/reviews",
        icon: Star,
      },
      {
        title: "AI Assistant",
        url: "/chat",
        icon: Bot,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Brand */}
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="flex items-center gap-3 hover:bg-transparent"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-semibold">S</span>
              </div>

              <div className="min-w-0 flex-1 text-left leading-tight">
                <span className="block truncate text-sm font-semibold">
                  SmartRetailAI
                </span>

                <span className="block truncate text-xs text-muted-foreground">
                  Retail Intelligence
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-3">
        {navigation.map((group) => (
          <SidebarGroup key={group.label} className="px-2 py-2">
            <SidebarGroupLabel className="px-2 text-xs font-medium">
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="flex h-9 w-full items-center gap-3 px-3"
                      >
                        <a href={item.url}>
                          <Icon className="size-4 shrink-0" />
                          <span className="truncate">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="flex h-9 items-center gap-3 px-3"
            >
              <a href="/settings">
                <Settings className="size-4 shrink-0" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}