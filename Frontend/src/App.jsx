import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAdmin, RequireFarmer, GuestOnly } from "./app/routeGuards.jsx";
import { LoadingScreen } from "./components/feedback/LoadingScreen.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

// Each page is loaded on demand, so the first screen stays small.
const page = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const LandingPage = page(() => import("./features/landing/LandingPage.jsx"), "LandingPage");
const LoginPage = page(() => import("./features/auth/LoginPage.jsx"), "LoginPage");
const RegisterPage = page(() => import("./features/auth/RegisterPage.jsx"), "RegisterPage");
const NotFoundPage = page(() => import("./features/common/NotFoundPage.jsx"), "NotFoundPage");

const FarmerDashboardPage = page(() => import("./features/dashboard/FarmerDashboardPage.jsx"), "FarmerDashboardPage");
const FarmsPage = page(() => import("./features/farms/FarmsPage.jsx"), "FarmsPage");
const FarmDetailPage = page(() => import("./features/farms/FarmDetailPage.jsx"), "FarmDetailPage");
const FieldDetailPage = page(() => import("./features/fields/FieldDetailPage.jsx"), "FieldDetailPage");
const CropDetailPage = page(() => import("./features/crops/CropDetailPage.jsx"), "CropDetailPage");
const WeatherPage = page(() => import("./features/weather/WeatherPage.jsx"), "WeatherPage");
const FarmerAnalyticsPage = page(() => import("./features/analytics/FarmerAnalyticsPage.jsx"), "FarmerAnalyticsPage");
const MarketPricesPage = page(() => import("./features/market/MarketPricesPage.jsx"), "MarketPricesPage");
const ResourcesPage = page(() => import("./features/resources/ResourcesPage.jsx"), "ResourcesPage");
const ResourceDetailPage = page(() => import("./features/resources/ResourceDetailPage.jsx"), "ResourceDetailPage");
const AiAssistantPage = page(() => import("./features/ai/AiAssistantPage.jsx"), "AiAssistantPage");

const AdminDashboardPage = page(() => import("./features/admin/AdminDashboardPage.jsx"), "AdminDashboardPage");
const AdminResourcesPage = page(() => import("./features/admin/AdminResourcesPage.jsx"), "AdminResourcesPage");
const AdminMarketPage = page(() => import("./features/admin/AdminMarketPage.jsx"), "AdminMarketPage");

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
              <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

              <Route path="/app" element={<RequireFarmer><AppShell /></RequireFarmer>}>
                <Route index element={<FarmerDashboardPage />} />
                <Route path="farms" element={<FarmsPage />} />
                <Route path="farms/:farmId" element={<FarmDetailPage />} />
                <Route path="farms/:farmId/fields/:fieldId" element={<FieldDetailPage />} />
                <Route path="crops/:cropId" element={<CropDetailPage />} />
                <Route path="weather" element={<WeatherPage />} />
                <Route path="analytics" element={<FarmerAnalyticsPage />} />
                <Route path="market" element={<MarketPricesPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="resources/:resourceId" element={<ResourceDetailPage />} />
                <Route path="ai" element={<AiAssistantPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="/admin" element={<RequireAdmin><AppShell /></RequireAdmin>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="resources" element={<AdminResourcesPage />} />
                <Route path="resources/:resourceId" element={<ResourceDetailPage />} />
                <Route path="market" element={<AdminMarketPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
