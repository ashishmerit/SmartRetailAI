import {
  Award,
  CircleUserRound,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CustomerProfileSheet({
  open,
  onOpenChange,
  customer,
  onLogout,
}) {
  if (!customer) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <CircleUserRound className="size-7" />
            </div>

            <div>
              <p className="font-semibold">
                {customer.name}
              </p>

              <p className="text-sm text-muted-foreground">
                SmartRetailAI Customer
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <div className="flex gap-3">
              <Mail className="mt-0.5 size-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p className="font-medium">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 size-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Phone
                </p>

                <p className="font-medium">
                  {customer.phone}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Award className="mt-0.5 size-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Loyalty Points
                </p>

                <p className="font-medium">
                  {customer.loyalty_points}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={onLogout}
          >
            <LogOut />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}