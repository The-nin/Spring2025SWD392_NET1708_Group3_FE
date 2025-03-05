import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import LoginPage from "../page/LoginPage/LoginPage";
import LandingPage from "../page/LandingPage/LandingPage";
import AboutUsPage from "../page/AboutUsPage/AboutUsPage";
import BlogPage from "../page/BlogPage/BlogPage";
import Blog1 from "../page/BlogPage/Blog1";
import Blog2 from "../page/BlogPage/Blog2";
import Blog3 from "../page/BlogPage/Blog3";
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
import Payment from "../page/PaymentPage/Payment";
import { ProtectedUserRoute } from "./ProtectedUserRoute";
import ProductDetail from "../page/ProductPage/ProductDetail";
import ProfilePage from "../page/Profile/ProfilePage";
import Consultant from "../page/ConsultantPage/Consultant";
import OrderManagement from "../page/Admin/OrderManagement/OrderManagement";
import OrderDetail from "../page/Admin/OrderManagement/OrderDetail";
import UserManagement from "../page/Admin/UserManagement/UserManagement";
import BatchManagement from "../page/Admin/BatchManagement/BatchManagement";
import AddNewBatch from "../page/Admin/BatchManagement/AddNewBatch";

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
        path: "/blog1",
        element: <Blog1 />,
      },
      {
        path: "/blog2",
        element: <Blog2 />,
      },
      {
        path: "/blog3",
        element: <Blog3 />,
      },
      {
        path: "/skinquiz",
        element: <SkinQuiz />,
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
        path: "/cart",
        element: (
          <ProtectedUserRoute>
            <Cart />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/skin-consultation",
        element: <Consultant />,
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
            path: "batch",
            element: <BatchManagement />,
          },
          {
            path: "batch/add",
            element: <AddNewBatch />,
          },
        ],
      },
    ],
  },
]);
