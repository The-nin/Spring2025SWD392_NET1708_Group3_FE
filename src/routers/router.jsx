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

export const router = createBrowserRouter([
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
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/helps",
        element: <HelpPage />,
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
          // <ProtectedAdminRoute>
          //   <MainPage />
          // </ProtectedAdminRoute>
          <MainPage />
        ),
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "category",
            element: <CategoryManagement />,
          },
          // {
          //   path: "order",
          //   element: <OrderManagement />,
          // },
          {
            path: "product",
            element: <ProductManagement />,
          },
        ],
      },
    ],
  },
]);
