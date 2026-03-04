import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Menu from "./components/Menu";
import Dine from "./components/Dine";
import SignUp from "./components/SignUp";
import Otp from "./components/Otp";
import AddFoodItems from "./components/employee/AddFoodItems";
import NewCustomer from "./components/NewCustomer";
import RemoveFoodItem from "./components/employee/RemoveFoodItem";
import AddToCart from "./components/AddToCart";
import Orders from "./components/Orders";
import AdminLogin from "./components/employee/AdminLogin";
import AdminDashboard from "./components/employee/AdminDashboard";
import AdminCustomers from "./components/employee/AdminCustomers";
import Home from "./components/Home";
import CustomerLogin from "./components/CustomerLogin";
import AdminCategories from "./components/employee/AdminCategories";
import AdminPaymentSettings from "./components/employee/AdminPaymentSettings";
import AdminDine from "./components/employee/AdminDine";
import AdminLayout from "./components/employee/AdminLayout";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "menu",
          element: <Menu />,
        },
        {
          path: "dine",
          element: <Dine />,
        },
        {
          path: "sign-in",
          element: <CustomerLogin />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "sign-up/otp",
          element: <Otp />,
        },
        {
          path: "new-customer",
          element: <NewCustomer />,
        },
        {
          path: "cart",
          element: <AddToCart />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
      ],
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "add-food-item",
          element: <AddFoodItems />,
        },
        {
          path: "remove-food-item",
          element: <RemoveFoodItem />,
        },
        {
          path: "categories",
          element: <AdminCategories />,
        },
        {
          path: "payment-settings",
          element: <AdminPaymentSettings />,
        },
        {
          path: "customers",
          element: <AdminCustomers />,
        },
        {
          path: "dine",
          element: <AdminDine />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
