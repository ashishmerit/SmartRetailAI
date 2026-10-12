
import { useContext } from "react";
import { LogOut, Settings as SettingsIcon, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const user = auth?.user;

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <SettingsIcon className="size-7" /> Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Account details and session management.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="size-5" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email address</p>
            <p className="font-medium">{user?.email || "Unavailable"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{user?.id ?? "Unavailable"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{user?.role || "Unavailable"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account status</p>
            <p className="font-medium">
              {user?.is_active ? "Active" : "Inactive or unavailable"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Administrative pages require an authenticated admin account.
            Sign out when finished using a shared device.
          </p>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
