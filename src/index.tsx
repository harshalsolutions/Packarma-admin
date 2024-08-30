import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import SignInPage from "./pages/Authentication/sign-in";
import { Toaster } from "react-hot-toast";
import StatePage from "./pages/Master/StatePage";
import SubscriptionPage from "./pages/Master/SubscriptionPage";
import BannerPage from "./pages/Master/BannerPage";
import AdsPage from "./pages/Master/AdsPage";
import Category from "./pages/Product Master/Category";
import SubCategory from "./pages/Product Master/SubCategory";
import ProductForm from "./pages/Product Master/ProductForm";
import PackingType from "./pages/Product Master/PackingType";
import PackagingMachine from "./pages/Product Master/PackagingMachine";
import PackagingTreatment from "./pages/Product Master/PackagingTreatment";
import StorageCondition from "./pages/Product Master/StorageCondition";
import MeasurementUnit from "./pages/Product Master/MeasurementUnit";
import Product from "./pages/Product Master/product";
import PackagingMaterial from "./pages/Product Master/PackagingMaterial";
import PackagingSolution from "./pages/Product Master/PackagingSolution";
import NavbarSidebarLayout from "./layouts/navbar-sidebar";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

root.render(
  <StrictMode>
    <Toaster position="bottom-right" />
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <DashboardPage />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          {/* Master routes */}
          <Route
            path="/master/state"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <StatePage />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/master/subscription"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <SubscriptionPage />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/master/banner"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <BannerPage />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/master/ads"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <AdsPage />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          {/* Product Master routes */}
          <Route
            path="/product-master/category"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <Category />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/subcategory"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <SubCategory />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/product-form"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <ProductForm />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/packing-type"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <PackingType />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/packaging-machine"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <PackagingMachine />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/packaging-treatment"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <PackagingTreatment />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/storage-condition"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <StorageCondition />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/measurement-unit"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <MeasurementUnit />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/product"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <Product />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/packaging-material"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <PackagingMaterial />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-master/packaging-solution"
            element={
              <ProtectedRoute>
                <NavbarSidebarLayout>
                  <PackagingSolution />
                </NavbarSidebarLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
);
