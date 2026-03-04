import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { adminAuthActions } from "../../feature/adminAuthSlice";
import { baseURL } from "../../service";
import { HiViewGrid, HiUsers, HiPlusCircle, HiLogout, HiArchive, HiCollection, HiCreditCard } from "react-icons/hi";

const AdminDashboard = () => {
    const { admin } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${baseURL}/admin/dashboard-stats`);
                const data = res.data?.data;
                if (data) {
                    setStats(data);
                    setRecentOrders(data.recentOrders || []);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        dispatch(adminAuthActions.logout());
        navigate("/admin/login");
    };

    if (!admin) {
        navigate("/admin/login");
        return null;
    }

    const formatCurrency = (val) => {
        if (val == null) return "₹0";
        return "₹" + Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 });
    };

    const statCards = [
        { name: "Total Revenue", value: loading ? "..." : formatCurrency(stats?.totalRevenue), icon: "💰", color: "bg-green-100 text-green-600" },
        { name: "Total Orders", value: loading ? "..." : (stats?.totalOrders ?? 0), icon: "🔥", color: "bg-orange-100 text-orange-600" },
        { name: "Total Customers", value: loading ? "..." : (stats?.totalCustomers ?? 0), icon: "👤", color: "bg-blue-100 text-blue-600" },
        { name: "Menu Items", value: loading ? "..." : (stats?.totalMenuItems ?? 0), icon: "🍱", color: "bg-purple-100 text-purple-600" },
    ];

    const actions = [
        { name: "Add Food Item", path: "/admin/add-food-item", icon: <HiPlusCircle />, description: "Add new dishes to the menu" },
        { name: "Manage Menu", path: "/admin/remove-food-item", icon: <HiArchive />, description: "Update or remove existing items" },
        { name: "Manage Categories", path: "/admin/categories", icon: <HiCollection />, description: "Add or remove menu categories" },
        { name: "Payment Settings", path: "/admin/payment-settings", icon: <HiCreditCard />, description: "Configure Razorpay gateway keys" },
        { name: "View Customers", path: "/admin/customers", icon: <HiUsers />, description: "Check registered customer base" },
        { name: "Dine-in Setup", path: "/admin/dine", icon: <HiViewGrid />, description: "Manage table arrangements" },
    ];

    return (
        <div className="min-h-screen bg-surface-50 p-6 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-5xl tracking-tight mb-2">Admin <span className="text-brand">Dashboard</span></h1>
                    <p className="text-surface-400">Welcome back, <span className="text-surface-950 font-bold">{admin.name}</span>! Here's what's happening today.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-surface-200 rounded-2xl font-bold text-surface-950 hover:text-brand hover:border-brand transition-all shadow-sm"
                >
                    <HiLogout className="text-xl" />
                    Logout
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 rounded-[2rem] border border-surface-200 shadow-sm"
                    >
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner`}>
                            {stat.icon}
                        </div>
                        <p className="text-surface-400 text-xs font-black uppercase tracking-widest mb-1">{stat.name}</p>
                        <p className="text-3xl font-black text-surface-950">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <h2 className="text-2xl mb-8 text-surface-950 font-outfit">Quick <span className="text-brand">Actions</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {actions.map((action, index) => (
                    <NavLink
                        key={index}
                        to={action.path}
                        className="group bg-white p-8 rounded-[2.5rem] border border-surface-200 shadow-sm hover:shadow-xl hover:border-brand/20 transition-all duration-500"
                    >
                        <div className="text-3xl text-surface-950 group-hover:text-brand transition-colors mb-6 drop-shadow-sm">
                            {action.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{action.name}</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">{action.description}</p>
                    </NavLink>
                ))}
            </div>

            {/* Recent Activity — Real Data */}
            <div className="mt-12 bg-white rounded-[3rem] border border-surface-200 p-10 shadow-sm">
                <h2 className="text-2xl mb-6">Recent <span className="text-brand">Activity</span></h2>
                <div className="space-y-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-6 pb-6 border-b border-surface-100 last:border-0 last:pb-0 animate-pulse">
                                <div className="w-12 h-12 bg-surface-100 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-surface-100 rounded w-3/4" />
                                    <div className="h-3 bg-surface-100 rounded w-1/2" />
                                </div>
                                <div className="h-3 bg-surface-100 rounded w-20" />
                            </div>
                        ))
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-4">📭</p>
                            <p className="text-surface-400 font-bold">No orders yet</p>
                            <p className="text-surface-300 text-sm mt-1">Orders will appear here as customers place them.</p>
                        </div>
                    ) : (
                        recentOrders.map((order, idx) => (
                            <div key={order.orderId || idx} className="flex items-center gap-6 pb-6 border-b border-surface-100 last:border-0 last:pb-0">
                                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand text-lg font-black">
                                    🧾
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-surface-950">
                                        Order #{order.orderId} — {order.customerName || "Guest"}
                                    </p>
                                    <p className="text-sm text-surface-400">
                                        {order.itemCount} item{order.itemCount !== 1 ? "s" : ""} • {formatCurrency(order.totalAmount)}
                                    </p>
                                </div>
                                <span className="text-xs font-black text-surface-300 uppercase whitespace-nowrap">
                                    {order.orderDate || "N/A"} {order.orderTime ? `• ${order.orderTime}` : ""}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
