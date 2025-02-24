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
import Payment from "../page/PaymentPage/Payment";
import { ProtectedUserRoute } from "./ProtectedUserRoute";

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
        path: "/payment",
        element: (
          <ProtectedUserRoute>
            <Payment />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/shop/:slug",
        element: <ShopPage />,
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
          // {
          //   path: "order",
          //   element: <OrderManagement />,
          // },
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
        ],
      },
    ],
  },
]);
