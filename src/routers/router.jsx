import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import LoginPage from "../page/LoginPage/LoginPage";
import LandingPage from "../page/LandingPage/LandingPage";
import AboutUsPage from "../page/AboutUsPage/AboutUsPage";
import BlogPage from "../page/BlogPage/BlogPage";
import BlogDetails from "../page/BlogPage/BlogDetails";
import ShopPage from "../page/ShopPage/ShopPage";
import HelpPage from "../page/HelpPage/HelpPage";
import SkinQuiz from "../page/SkinQuiz/SkinQuiz";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";
import MainPage from "../page/Admin/MainPage/MainPage";
import LoginAdmin from "../page/Admin/LoginAdmin/LoginAdmin";
import Dashboard from "../page/Admin/Dashboard/Dashboard";
import CategoryManagement from "../page/Admin/CategoryManagement/CategoryManagement";
import ProductManagement from "../page/Admin/ProducManagement/ProductManagement";
import EditProduct from "../page/Admin/ProducManagement/EditProduct";
import AddNewProduct from "../page/Admin/ProducManagement/AddNewProduct";
import AddNewCategory from "../page/Admin/CategoryManagement/AddNewCategory";
import EditCategory from "../page/Admin/CategoryManagement/EditCategory";
import Cart from "../page/CartPage/Cart";
import NotFound from "../page/NotFoundPage/NotFound";
import BrandManagement from "../page/Admin/Brand/BrandManagement";
import AddNewBrand from "../page/Admin/Brand/AddNewBrand";
import EditBrand from "../page/Admin/Brand/EditBrand";
import BlogManagement from "../page/Admin/Blog/BlogManagement";
import AddNewBlog from "../page/Admin/Blog/AddNewBlog";
import EditBlog from "../page/Admin/Blog/EditBlog";
import QuizManagement from "../page/Admin/Quiz/QuizManagement";
import AddNewVoucher from "../page/Admin/Voucher/AddNewVoucher";
import VoucherManagement from "../page/Admin/Voucher/VoucherManagement";
import EditVoucher from "../page/Admin/Voucher/EditVoucher";
import EditQuiz from "../page/Admin/Quiz/EditQuiz";
import AddNewQuiz from "../page/Admin/Quiz/AddNewquiz";
import Payment from "../page/PaymentPage/Payment";
import { ProtectedUserRoute } from "./ProtectedUserRoute";
import ProductDetail from "../page/ProductPage/ProductDetail";
import ProfilePage from "../page/Profile/ProfilePage";
import Consultant from "../page/ConsultantPage/Consultant";
import OrderManagement from "../page/Admin/OrderManagement/OrderManagement";
import OrderDetail from "../page/Admin/OrderManagement/OrderDetail";
import UserManagement from "../page/Admin/UserManagement/UserManagement";
import ServiceManagement from "../page/Admin/ServiceManagement/ServiceManagement";
import AddNewService from "../page/Admin/ServiceManagement/AddNewService";
import ExpertService from "../page/Admin/ExpertService/ExpertService";
import PaymentSuccess from "../page/PaymentPage/Paid/PaymentSuccess";
import CategoryDetail from "../page/Admin/CategoryManagement/CategoryDetail";
import BrandDetail from "../page/Admin/Brand/BrandDetail";
import ProductDetailAdmin from "../page/Admin/ProducManagement/ProductDetail";
import VNPayReturn from "../page/PaymentPage/Paid/VNPayReturn";
import OrderFailed from "../components/Order/OrderFailed";
import OrderSuccess from "../components/Order/OrderSuccess";
import AddUser from "../page/Admin/UserManagement/AddUser";
import EditUser from "../page/Admin/UserManagement/EditUser";
import RoutineForm from "../page/Admin/ExpertService/RoutineForm";
import ConsultantOrderDetail from "../page/Admin/ExpertService/ConsultantOrderDetail";
import ConsultantBookingAdmin from "../page/Admin/AdminConsultantMng/ConsultantBookingAdmin";
import StaffMngConsultant from "../page/Admin/StaffConsultantMng/StaffMngConsultant";
import MyRoutine from "../page/Profile/ConsultantHistory/MyRoutine";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/about-us",
        element: <AboutUsPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetails />,
      },
      {
        path: "/skinquiz",
        element: (
          <ProtectedUserRoute>
            <SkinQuiz />,
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <ProtectedUserRoute>
            <Payment />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedUserRoute>
            <ProfilePage />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/my-routine",
        element: <MyRoutine />,
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/shop/category/:slug",
        element: <ShopPage />,
      },
      {
        path: "/shop/brand/:slug",
        element: <ShopPage />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/helps",
        element: <HelpPage />,
      },
      {
        path: "/payment/vnpay-return",
        element: <VNPayReturn />,
      },
      {
        path: "/order-success",
        element: <OrderSuccess />,
      },
      {
        path: "/order-failed",
        element: <OrderFailed />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedUserRoute>
            <Cart />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/skin-consultation",
        element: (
          <ProtectedUserRoute>
            <Consultant />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <LoginAdmin />,
      },
      {
        path: "",
        element: (
          <ProtectedAdminRoute>
            <MainPage />
          </ProtectedAdminRoute>
        ),
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "user",
            element: <UserManagement />,
          },
          {
            path: "user/add",
            element: <AddUser />,
          },
          {
            path: "user/edit/:id",
            element: <EditUser />,
          },
          {
            path: "category",
            children: [
              {
                path: "",
                element: <CategoryManagement />,
              },
              {
                path: "add",
                element: <AddNewCategory />,
              },
              {
                path: "edit/:id",
                element: <EditCategory />,
              },
              {
                path: "detail/:id",
                element: <CategoryDetail />,
              },
            ],
          },
          {
            path: "order",
            element: <OrderManagement />,
          },
          {
            path: "orders/:id",
            element: <OrderDetail />,
          },
          {
            path: "product",
            children: [
              {
                path: "",
                element: <ProductManagement />,
              },
              {
                path: "add",
                element: <AddNewProduct />,
              },
              {
                path: "edit/:id",
                element: <EditProduct />,
              },
              {
                path: "detail/:id",
                element: <ProductDetailAdmin />,
              },
            ],
          },
          {
            path: "brand",
            element: <BrandManagement />,
          },
          {
            path: "brand/add",
            element: <AddNewBrand />,
          },
          {
            path: "brand/edit/:id",
            element: <EditBrand />,
          },
          {
            path: "brand/detail/:id",
            element: <BrandDetail />,
          },
          {
            path: "blog",
            element: <BlogManagement />,
          },
          {
            path: "blog/add",
            element: <AddNewBlog />,
          },
          {
            path: "blog/edit/:id",
            element: <EditBlog />,
          },
          {
            path: "quiz",
            element: <QuizManagement />,
          },
          {
            path: "quiz/add",
            element: <AddNewQuiz />,
          },
          {
            path: "quiz/edit/:id",
            element: <EditQuiz />,
          },
          {
            path: "voucher",
            element: <VoucherManagement />,
          },
          {
            path: "voucher/add",
            element: <AddNewVoucher />,
          },
          {
            path: "voucher/edit/:id",
            element: <EditVoucher />,
          },
          {
            path: "service",
            children: [
              {
                path: "",
                element: <ServiceManagement />,
              },
              {
                path: "add",
                element: <AddNewService />,
              },
            ],
          },
          {
            path: "consultant-booking",
            children: [
              {
                path: "",
                element: <ExpertService />,
              },
              {
                path: "order-detail/:id",
                element: <ConsultantOrderDetail />,
              },
              {
                path: "order-detail/:id/new-routine",
                element: <RoutineForm />,
              },
            ],
          },
          {
            path: "consultant-all-booking",
            element: <ConsultantBookingAdmin />,
          },
          {
            path: "staff-manage-consultant-order",
            element: <StaffMngConsultant />,
          },
        ],
      },
    ],
  },
]);
