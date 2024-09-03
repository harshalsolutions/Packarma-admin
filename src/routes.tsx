import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import NavbarSidebarLayout from "./layouts/navbar-sidebar";
import DashboardPage from "./pages/Dashboard";
import SignInPage from "./pages/Authentication/sign-in";
import SubscriptionPage from "./pages/Master/SubscriptionPage";
import BannerPage from "./pages/Master/BannerPage";
import AdsPage from "./pages/Master/AdsPage";
import CreditMaster from "./pages/Master/CreditMaster";
import Category from "./pages/Product Master/Category";
import SubCategory from "./pages/Product Master/SubCategory";
import ProductForm from "./pages/Product Master/ProductForm";
import PackingType from "./pages/Product Master/PackingType";
import PackagingMachine from "./pages/Product Master/PackagingMachine";
import PackagingTreatment from "./pages/Product Master/PackagingTreatment";
import StorageCondition from "./pages/Product Master/StorageCondition";
import MeasurementUnit from "./pages/Product Master/MeasurementUnit";
import Product from "./pages/Product Master/Product";
import PackagingMaterial from "./pages/Product Master/PackagingMaterial";
import PackagingSolution from "./pages/Product Master/PackagingSolution";
import CustomerEnquiry from "./pages/Customer Section/CustomerEnquiry";
import CreditPurchase from "./pages/Customer Section/CreditPurchase";
import Refer from "./pages/Customer Section/Refer";
import UserList from "./pages/Customer Section/UserList";
import UserAddresses from "./pages/Customer Section/UserAddresses";
import UserSubscription from "./pages/Customer Section/UserSubscription";
import DownloadSubscription from "./pages/Customer Section/DownloadSubscription";
import ManageRoles from "./pages/Staff/ManageRoles";
import ManageStaff from "./pages/Staff/ManageStaff";

const AppRoutes = () => (
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
    <Route
      path="/master/credit-master"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <CreditMaster />
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
      path="/product-master/packaging-solutions"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <PackagingSolution />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    {/* Customer Section */}
    <Route
      path="/customer-section/customer-enquiry"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <CustomerEnquiry />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer-section/credit-purchase"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <CreditPurchase />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer-section/refer"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <Refer />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer/user-list"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <UserList />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer/user-address-list"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <UserAddresses />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer/referral-info"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <Refer />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer/user-subscription"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <UserSubscription />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer/download-subscription"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <DownloadSubscription />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer/enquiry"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <CustomerEnquiry />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    {/* Staff Section */}
    <Route
      path="/staff/manage-staff"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <ManageStaff />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/staff/manage-roles"
      element={
        <ProtectedRoute>
          <NavbarSidebarLayout>
            <ManageRoles />
          </NavbarSidebarLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
