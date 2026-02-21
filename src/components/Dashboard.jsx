import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import images from "../assets/assets";

const Dashboard = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const links = [
    { name: "Menu", path: "menu" },
    { name: "Dine In", path: "dine" }
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-surface-200/60 px-6 py-3 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10 md:gap-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand/20 group-hover:rotate-12 transition-transform duration-500">
                T
              </div>
              <span className="ml-3 text-2xl font-black tracking-tighter text-surface-950">
                The<span className="text-brand">Food</span>Club
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link, index) => (
                <NavLink
                  to={link.path}
                  key={index}
                  className={({ isActive }) =>
                    `relative py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 group/link ${isActive ? "text-brand" : "text-surface-400 hover:text-surface-950"
                    }`
                  }
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover/link:w-full"></span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <NavLink
              to="sign-up"
              className="hidden sm:flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-surface-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all duration-500 hover:shadow-xl hover:shadow-brand/20 group/acc"
            >
              <MdAccountCircle className="text-lg opacity-70 group-hover:scale-110 transition-transform" />
              Account
            </NavLink>

            <div className="w-px h-6 bg-surface-200 mx-1 hidden sm:block"></div>

            <NavLink
              to="cart"
              className="relative p-3 text-surface-950 hover:bg-brand/10 rounded-2xl transition-all duration-500 group/cart"
            >
              <TiShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-brand text-white text-[10px] font-black flex items-center justify-center rounded-lg border-2 border-white shadow-sm transform scale-0 group-hover:scale-100 transition-transform duration-300 motion-safe:animate-bounce">
                {totalQuantity}
              </span>
              {totalQuantity > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-brand text-white text-[10px] font-black flex items-center justify-center rounded-lg border-2 border-white shadow-sm scale-110 group-hover:scale-0 transition-transform duration-300">
                  {totalQuantity}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-8">
        <Outlet />
      </main>

      {/* Footer / Mobile Nav could go here */}
    </div>
  );
};

export default Dashboard;
