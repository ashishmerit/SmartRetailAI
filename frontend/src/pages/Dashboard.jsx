import {
  Activity,
  ArrowUpRight,
  Bot,
  ScanFace,
  ShoppingBasket,
  Star,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const stats = [
  {
    title: "Customers",
    value: "128",
    change: "+12.5%",
    description: "vs. last month",
    icon: Users,
  },
  {
    title: "Visits Today",
    value: "42",
    change: "+8.2%",
    description: "vs. yesterday",
    icon: Activity,
  },
  {
    title: "Products Detected",
    value: "1,284",
    change: "+18.4%",
    description: "this month",
    icon: ShoppingBasket,
  },
  {
    title: "Reviews Analyzed",
    value: "356",
    change: "+6.7%",
    description: "this month",
    icon: Star,
  },
]

const intelligenceModules = [
  {
    title: "Face Recognition",
    description:
      "Identify enrolled customers and track store visits.",
    icon: ScanFace,
    status: "Active",
  },
  {
    title: "Product Recognition",
    description:
      "Detect retail products using the trained YOLO model.",
    icon: ShoppingBasket,
    status: "Active",
  },
  {
    title: "AI Shopping Assistant",
    description:
      "Provide contextual shopping assistance using Gemini.",
    icon: Bot,
    status: "Active",
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            Overview
          </h1>

          <Badge variant="secondary">
            Live
          </Badge>
        </div>

        <p className="max-w-2xl text-sm text-muted-foreground">
          A real-time view of customer activity, AI systems,
          and retail intelligence across SmartRetailAI.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>

                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span className="font-medium">
                    {stat.change}
                  </span>

                  <span className="text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Intelligence section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            AI Systems
          </h2>

          <p className="text-sm text-muted-foreground">
            Current status of the intelligence layer.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {intelligenceModules.map((module) => {
            const Icon = module.icon

            return (
              <Card
                key={module.title}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                      <Icon className="size-5" />
                    </div>

                    <Badge variant="outline">
                      {module.status}
                    </Badge>
                  </div>

                  <CardTitle className="pt-2">
                    {module.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {module.description}
                  </p>

                  <button
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Open module
                    <ArrowUpRight className="size-4" />
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}