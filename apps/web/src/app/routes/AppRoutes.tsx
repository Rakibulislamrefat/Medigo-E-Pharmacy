import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "../shell/AppShell";
import { RequireAuth } from "../shell/RequireAuth";
import { RequireRole } from "../shell/RequireRole";
import { AdminInventoryPage } from "../../pages/AdminInventoryPage";
import { AdminOrdersPage } from "../../pages/AdminOrdersPage";
import { AdminBannersPage } from "../../pages/AdminBannersPage";
import { CartPage } from "../../pages/CartPage";
import { CatalogPage } from "../../pages/CatalogPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { DeliveryDetailsPage } from "../../pages/DeliveryDetailsPage";
import { DeliveryListPage } from "../../pages/DeliveryListPage";
import { DoctorConsultationPage } from "../../pages/DoctorConsultationPage";
import { FeedbackPage } from "../../pages/FeedbackPage";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { MedicineDetailsPage } from "../../pages/MedicineDetailsPage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { OrderDetailsPage } from "../../pages/OrderDetailsPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { PrescriptionUploadPage } from "../../pages/PrescriptionUploadPage";
import { RefillRequestPage } from "../../pages/RefillRequestPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { TrackOrderPage } from "../../pages/TrackOrderPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/doctor-consultation" element={<DoctorConsultationPage />} />
        <Route path="/refill-request" element={<RefillRequestPage />} />
        <Route path="/prescription-upload" element={<PrescriptionUploadPage />} />
        <Route path="/medicines" element={<CatalogPage />} />
        <Route path="/medicines/:id" element={<MedicineDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/banners" element={<AdminBannersPage />} />
          </Route>

          <Route element={<RequireRole role="delivery" />}>
            <Route path="/delivery" element={<DeliveryListPage />} />
            <Route path="/delivery/:id" element={<DeliveryDetailsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/logout" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
