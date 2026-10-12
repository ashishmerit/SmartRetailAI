import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Dashboard from "@/pages/Dashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import Login from "@/pages/Login";
import AdminCustomers from "@/pages/AdminCustomers";
import Enrollment from "@/pages/Enrollment";
import FaceRecognition from "@/pages/FaceRecognition";
import ProductRecognition from "@/pages/ProductRecognition";

import Visits from "@/pages/Visits";
import Reviews from "@/pages/Reviews";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Dashboard />}
          />
        </Route>

        {/* Customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["CUSTOMER"]}
            >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminCustomers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enrollment"
          element={
            <ProtectedRoute role="ADMIN">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Enrollment />} />
        </Route>

        
        <Route
          path="/recognition"
          element={
            <ProtectedRoute role="ADMIN">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<FaceRecognition />} />
        </Route>

        <Route
          path="/products"
          element={
            <ProtectedRoute role="ADMIN">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProductRecognition />} />
        </Route>

        
<Route
  path="/visits"
  element={
    <ProtectedRoute role="ADMIN">
      <AppShell />
    </ProtectedRoute>
  }
>
  <Route index element={<Visits />} />
</Route>

<Route
  path="/reviews"
  element={
    <ProtectedRoute role="ADMIN">
      <AppShell />
    </ProtectedRoute>
  }
>
  <Route index element={<Reviews />} />
</Route>

{/* <Route
  path="/chat"
  element={
    <ProtectedRoute role="ADMIN">
      <AppShell />
    </ProtectedRoute>
  }
>
  <Route index element={<Chat />} />
</Route> */}

<Route
  path="/settings"
  element={
    <ProtectedRoute role="ADMIN">
      <AppShell />
    </ProtectedRoute>
  }
>
  <Route index element={<Settings />} />
</Route>

<Route
  path="/analytics"
  element={
    <ProtectedRoute role="ADMIN">
      <AppShell />
    </ProtectedRoute>
  }
>
  <Route index element={<Analytics />} />
</Route>



        {/* Root */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;