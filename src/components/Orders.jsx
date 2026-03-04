import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    HiClipboardList,
    HiRefresh,
    HiCash,
    HiCreditCard,
    HiShoppingBag,
    HiClock,
    HiArrowLeft,
    HiCheckCircle,
    HiXCircle,
} from "react-icons/hi";
import { getCustomerOrderSummariesApi } from "../service/CustomerService";

const Orders = () => {
    const navigate = useNavigate();
    const { customer } = useSelector((state) => state.customerAuth);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        if (!customer?.customerId) return;
        setLoading(true);
        setError("");
        try {
            const res = await getCustomerOrderSummariesApi(customer.customerId);
            setOrders(res?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    }, [customer?.customerId]);

    useEffect(() => {
        if (!customer?.customerId) {
            navigate("/sign-in");
            return;
        }
        fetchOrders();
    }, [customer, navigate, fetchOrders]);

    const summary = useMemo(() => {
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        const totalPaid = orders.reduce((sum, order) => {
            if (order.payment?.amountPaid == null) return sum;
            return sum + Number(order.payment.amountPaid);
        }, 0);
        const paidOrders = orders.filter((order) => order.transactionStatus === "PAID").length;

        return { totalOrders, totalSpent, totalPaid, paidOrders };
    }, [orders]);

    const formatCurrency = (value) => {
        const safe = Number(value || 0);
        return `₹${safe.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    };

    if (!customer?.customerId) return null;

    return (
        <div className="min-h-screen bg-surface-50 p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-surface-400 hover:text-brand font-bold uppercase tracking-widest text-xs mb-4 transition-colors"
                    >
                        <HiArrowLeft /> Back
                    </button>
                    <h1 className="text-5xl tracking-tight">
                        My <span className="text-brand">Orders</span>
                    </h1>
                    <p className="text-surface-400 mt-2">
                        Complete order history, payment details, and transaction status.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    className="px-6 py-3 bg-white border border-surface-200 rounded-2xl font-bold text-surface-950 hover:text-brand hover:border-brand transition-all shadow-sm flex items-center gap-2"
                >
                    <HiRefresh className="text-lg" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Total Orders</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiClipboardList className="text-brand" /> {summary.totalOrders}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Total Spent</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiCash className="text-brand" /> {formatCurrency(summary.totalSpent)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Total Paid</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiCreditCard className="text-brand" /> {formatCurrency(summary.totalPaid)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-surface-200 shadow-sm">
                    <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Paid Orders</p>
                    <p className="text-3xl font-black mt-2 flex items-center gap-2">
                        <HiShoppingBag className="text-brand" /> {summary.paidOrders}
                    </p>
                </div>
            </div>

            {loading && (
                <div className="text-center py-20 text-surface-400 font-bold">Loading order history...</div>
            )}

            {!loading && error && (
                <div className="bg-white rounded-[2rem] border border-brand/20 p-8 text-brand font-bold">{error}</div>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="bg-white rounded-[2rem] border border-surface-200 p-10 text-center">
                    <p className="text-5xl mb-4">🧾</p>
                    <p className="font-black text-xl">No orders yet</p>
                    <p className="text-surface-400 mt-1 mb-6">You have not placed any orders.</p>
                    <NavLink to="/menu" className="btn-primary inline-flex items-center gap-2">
                        Browse Menu
                    </NavLink>
                </div>
            )}

            <div className="space-y-5">
                {!loading &&
                    !error &&
                    orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="bg-white rounded-[2rem] border border-surface-200 p-6 shadow-sm"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xl font-black">Order #{order.orderId}</p>
                                    <p className="text-sm text-surface-400 flex items-center gap-2 mt-1">
                                        <HiClock /> {order.orderDate || "N/A"} {order.orderTime ? `• ${order.orderTime}` : ""}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-surface-100 text-surface-500">
                                        {order.itemCount || 0} items
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-surface-100 text-surface-500">
                                        {formatCurrency(order.totalAmount)}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 ${
                                            order.transactionStatus === "PAID"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {order.transactionStatus === "PAID" ? <HiCheckCircle /> : <HiXCircle />}
                                        {order.transactionStatus || "N/A"}
                                    </span>
                                </div>
                            </div>

                            {order.payment ? (
                                <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl p-4 text-sm">
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
                                <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-700">
                                    Payment details are not recorded for this order.
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
                                        {(order.items || []).map((item, idx) => (
                                            <tr key={`${order.orderId}-${item.orderDetailId || idx}`} className="border-t border-surface-100">
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
        </div>
    );
};

export default Orders;
