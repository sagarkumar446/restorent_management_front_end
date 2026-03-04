import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { baseURL } from "../../service";
import {
    HiArrowLeft,
    HiRefresh,
    HiSearch,
    HiUsers,
    HiUserCircle,
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiChevronDown,
    HiChevronUp,
    HiClipboardList,
    HiCreditCard,
    HiCheckCircle,
    HiXCircle,
    HiCash,
    HiClock
} from "react-icons/hi";

const AdminCustomers = () => {
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.adminAuth);

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [expandedCustomerId, setExpandedCustomerId] = useState(null);

    useEffect(() => {
        if (!admin) {
            navigate("/admin/login");
            return;
        }
        fetchCustomers();
    }, [admin, navigate]);

    const fetchCustomers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${baseURL}/admin/customers`);
            setCustomers(res.data?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch customers.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return customers;
        return customers.filter((c) =>
            (c.name || "").toLowerCase().includes(term) ||
            (c.email || "").toLowerCase().includes(term) ||
            (c.contactNumber || "").toLowerCase().includes(term) ||
            String(c.customerId || "").includes(term)
        );
    }, [customers, search]);

    const summary = useMemo(() => {
        return {
            totalCustomers: customers.length,
            totalOrders: customers.reduce((acc, c) => acc + (c.totalOrders || 0), 0),
            totalRevenue: customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0),
            totalTransactions: customers.reduce((acc, c) => acc + (c.totalTransactions || 0), 0),
        };
    }, [customers]);

    const formatCurrency = (value) => {
        const safe = Number(value || 0);
        return `₹${safe.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    };

    const formatDateTime = (date, time) => {
        if (!date && !time) return "N/A";
        return `${date || "N/A"}${time ? ` • ${time}` : ""}`;
    };

    return (
        <div className="min-h-screen bg-surface-50 p-6 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="flex items-center gap-2 text-surface-400 hover:text-brand font-bold uppercase tracking-widest text-xs mb-4 transition-colors"
                    >
                        <HiArrowLeft /> Back to Dashboard
                    </button>
                    <h1 className="text-5xl tracking-tight">
                        Customer <span className="text-brand">Insights</span>
                    </h1>
                    <p className="text-surface-400 mt-2">
                        View every customer profile with complete order, transaction, and payment history.
                    </p>
                </div>

                <button
                    onClick={fetchCustomers}
                    className="px-6 py-3 bg-white border border-surface-200 rounded-2xl font-bold text-surface-950 hover:text-brand hover:border-brand transition-all shadow-sm flex items-center gap-2"
                >
                    <HiRefresh className="text-lg" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Customers</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiUsers className="text-brand" /> {summary.totalCustomers}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Orders</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiClipboardList className="text-brand" /> {summary.totalOrders}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Revenue</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiCash className="text-brand" /> {formatCurrency(summary.totalRevenue)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Transactions</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiCreditCard className="text-brand" /> {summary.totalTransactions}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-surface-200 p-4 md:p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <HiSearch className="text-surface-300 text-xl" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by customer name, email, phone, or ID"
                        className="w-full outline-none text-surface-950 placeholder:text-surface-300"
                    />
                </div>
            </div>

            {loading && (
                <div className="text-center py-20 text-surface-400 font-bold">Loading customer data...</div>
            )}

            {!loading && error && (
                <div className="bg-white rounded-[2rem] border border-brand/20 p-8 text-brand font-bold">{error}</div>
            )}

            {!loading && !error && filteredCustomers.length === 0 && (
                <div className="bg-white rounded-[2rem] border border-surface-200 p-10 text-center">
                    <p className="text-5xl mb-4">🧾</p>
                    <p className="font-black text-xl">No customers found</p>
                    <p className="text-surface-400 mt-1">Try changing the search input or refresh data.</p>
                </div>
            )}

            <div className="space-y-6">
                {filteredCustomers.map((customer, index) => {
                    const isExpanded = expandedCustomerId === customer.customerId;
                    const orderHistory = customer.orderHistory || [];
                    const transactionHistory = customer.transactionHistory || [];

                    return (
                        <motion.div
                            key={customer.customerId}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="bg-white rounded-[2.5rem] border border-surface-200 p-6 md:p-8 shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-2xl font-black flex items-center gap-2">
                                            <HiUserCircle className="text-brand" />
                                            {customer.name || "Unnamed Customer"}
                                        </h2>
                                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-surface-100 text-surface-500">
                                            ID #{customer.customerId}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${
                                                customer.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {customer.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-surface-500">
                                        <p className="flex items-center gap-2"><HiMail /> {customer.email || "N/A"}</p>
                                        <p className="flex items-center gap-2"><HiPhone /> {customer.contactNumber || "N/A"}</p>
                                        <p className="flex items-center gap-2"><HiLocationMarker /> {customer.address || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="px-4 py-2 rounded-2xl bg-surface-50 border border-surface-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Orders</p>
                                        <p className="text-lg font-black">{customer.totalOrders || 0}</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-2xl bg-surface-50 border border-surface-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Spent</p>
                                        <p className="text-lg font-black">{formatCurrency(customer.totalSpent)}</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-2xl bg-surface-50 border border-surface-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Payments</p>
                                        <p className="text-lg font-black">{customer.totalTransactions || 0}</p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setExpandedCustomerId(isExpanded ? null : customer.customerId)
                                        }
                                        className="ml-auto px-5 py-3 rounded-2xl border border-surface-200 font-bold text-sm hover:border-brand hover:text-brand transition-all flex items-center gap-2"
                                    >
                                        {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
                                        {isExpanded ? "Hide Details" : "View Full History"}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-8 pt-8 border-t border-surface-100 space-y-8">
                                            <div>
                                                <h3 className="text-xl font-black mb-4">Profile Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="bg-surface-50 rounded-2xl p-4 border border-surface-100">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Registration</p>
                                                        <p className="font-bold mt-1">{customer.registrationDate || "N/A"}</p>
                                                    </div>
                                                    <div className="bg-surface-50 rounded-2xl p-4 border border-surface-100">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Last Login</p>
                                                        <p className="font-bold mt-1">{customer.lastLoginDate || "N/A"}</p>
                                                    </div>
                                                    <div className="bg-surface-50 rounded-2xl p-4 border border-surface-100">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Loyalty Points</p>
                                                        <p className="font-bold mt-1">{Number(customer.loyaltyPoints || 0).toLocaleString("en-IN")}</p>
                                                    </div>
                                                    <div className="bg-surface-50 rounded-2xl p-4 border border-surface-100">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Total Paid</p>
                                                        <p className="font-bold mt-1">{formatCurrency(customer.totalPaidAmount)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black mb-4">Transaction & Payment History</h3>
                                                {transactionHistory.length === 0 ? (
                                                    <div className="bg-surface-50 rounded-2xl p-6 border border-surface-100 text-surface-400">
                                                        No transactions available for this customer.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {transactionHistory.map((tx, txIndex) => (
                                                            <div
                                                                key={`${customer.customerId}-tx-${tx.orderId}-${txIndex}`}
                                                                className="bg-surface-50 border border-surface-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                                            >
                                                                <div>
                                                                    <p className="font-black text-surface-950">
                                                                        Order #{tx.orderId} • Txn {tx.transactionId || "N/A"}
                                                                    </p>
                                                                    <p className="text-xs text-surface-400 mt-1">
                                                                        Reference: {tx.transactionReference || "N/A"}
                                                                    </p>
                                                                    <p className="text-sm text-surface-400 flex items-center gap-2 mt-1">
                                                                        <HiClock /> {formatDateTime(tx.transactionDate, tx.transactionTime)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-3">
                                                                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white border border-surface-200">
                                                                        {tx.paymentMethod || "N/A"}
                                                                    </span>
                                                                    <span className="font-black">{formatCurrency(tx.amount)}</span>
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 ${
                                                                            tx.status === "PAID"
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-yellow-100 text-yellow-700"
                                                                        }`}
                                                                    >
                                                                        {tx.status === "PAID" ? <HiCheckCircle /> : <HiXCircle />}
                                                                        {tx.status || "N/A"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black mb-4">All Orders</h3>
                                                {orderHistory.length === 0 ? (
                                                    <div className="bg-surface-50 rounded-2xl p-6 border border-surface-100 text-surface-400">
                                                        No orders available for this customer.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {orderHistory.map((order, orderIndex) => (
                                                            <div
                                                                key={`${customer.customerId}-order-${order.orderId}-${orderIndex}`}
                                                                className="bg-white border border-surface-200 rounded-2xl p-5"
                                                            >
                                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                                                    <div>
                                                                        <p className="text-lg font-black">Order #{order.orderId}</p>
                                                                        <p className="text-sm text-surface-400 mt-1">
                                                                            {formatDateTime(order.orderDate, order.orderTime)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-3">
                                                                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-surface-100 text-surface-500">
                                                                            {order.itemCount || 0} items
                                                                        </span>
                                                                        <span className="font-black">{formatCurrency(order.totalAmount)}</span>
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                                                                order.transactionStatus === "PAID"
                                                                                    ? "bg-green-100 text-green-700"
                                                                                    : "bg-yellow-100 text-yellow-700"
                                                                            }`}
                                                                        >
                                                                            {order.transactionStatus || "N/A"}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {order.payment ? (
                                                                    <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-sm">
                                                                        <p className="font-bold text-green-700">
                                                                            Payment #{order.payment.paymentId} • {order.payment.paymentMethod || "N/A"}
                                                                        </p>
                                                                        <p className="text-green-700 mt-1">
                                                                            Date: {order.payment.paymentDate || "N/A"} • Amount: {formatCurrency(order.payment.amountPaid)}
                                                                        </p>
                                                                        <p className="text-green-700 mt-1">
                                                                            Reference: {order.payment.transactionReference || "N/A"}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-700">
                                                                        Payment record not available for this order.
                                                                    </div>
                                                                )}

                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead>
                                                                            <tr className="text-left text-surface-400 uppercase text-[11px] tracking-widest">
                                                                                <th className="py-2 pr-3">Item</th>
                                                                                <th className="py-2 pr-3">Category</th>
                                                                                <th className="py-2 pr-3">Qty</th>
                                                                                <th className="py-2 pr-3">Unit Price</th>
                                                                                <th className="py-2">Line Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(order.items || []).map((item, itemIndex) => (
                                                                                <tr key={`${order.orderId}-${item.orderDetailId || itemIndex}`} className="border-t border-surface-100">
                                                                                    <td className="py-2 pr-3 font-semibold">{item.itemName || "N/A"}</td>
                                                                                    <td className="py-2 pr-3">{item.category || "N/A"}</td>
                                                                                    <td className="py-2 pr-3">{item.quantity || 0}</td>
                                                                                    <td className="py-2 pr-3">{formatCurrency(item.unitPrice)}</td>
                                                                                    <td className="py-2 font-semibold">{formatCurrency(item.lineTotal)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminCustomers;
