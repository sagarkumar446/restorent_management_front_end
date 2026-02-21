import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Menu from "./components/Menu";
import Dine from "./components/Dine";
import SignUp from "./components/SignUp";
import Otp from "./components/Otp";
import AddFoodItems from "./components/employee/AddFoodItems";
import NewCustomer from "./components/NewCustomer";
import RemoveFoodItem from "./components/employee/RemoveFoodItem";
import AddToCart from "./components/AddToCart";
import AdminLogin from "./components/employee/AdminLogin";
import AdminDashboard from "./components/employee/AdminDashboard";
import Home from "./components/Home";
import AdminCategories from "./components/employee/AdminCategories";
import AdminPaymentSettings from "./components/employee/AdminPaymentSettings";

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'menu',
          element: <Menu />
        },
        {
          path: 'dine',
          element: <Dine />

        },
        {
          path: 'sign-up',
          element: <SignUp />
        },
        {
          path: 'sign-up/otp',
          element: <Otp />
        },
        {
          path: 'new-customer',
          element: <NewCustomer />
        },
        {
          path: 'add-food-item',
          element: <AddFoodItems />
        },
        {
          path: 'remove-food-item',
          element: <RemoveFoodItem />
        },
        {
          path: 'cart',
          element: <AddToCart />
        },
        {
          path: 'admin/login',
          element: <AdminLogin />
        },
        {
          path: 'admin/dashboard',
          element: <AdminDashboard />
        },
        {
          path: 'admin/categories',
          element: <AdminCategories />
        },
        {
          path: 'admin/payment-settings',
          element: <AdminPaymentSettings />
        }
      ]
    }
  ]);
  return (
    <RouterProvider router={router}>
    </RouterProvider>)
};
export default App;
