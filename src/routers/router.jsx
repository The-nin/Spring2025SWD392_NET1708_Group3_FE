import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import LoginPage from "../page/LoginPage/LoginPage";
import LandingPage from "../page/LandingPage/LandingPage";
import AboutUsPage from "../page/AboutUsPage/AboutUsPage";
import BlogPage from "../page/BlogPage/BlogPage";
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
        ],
      },
    ],
  },
]);
