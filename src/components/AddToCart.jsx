import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../feature/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiMinus, HiTrash, HiShieldCheck, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../service";

// ----- Razorpay Script Loader -----
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById("razorpay-script")) return resolve(true);
        const script = document.createElement("script");
        script.id = "razorpay-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// ----- Payment Status Modal -----
const PaymentModal = ({ status, paymentId, onClose }) => (
    <AnimatePresence>
        {status && (
            <motion.div
                key="payment-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-[3rem] p-14 shadow-2xl text-center max-w-md w-full"
                >
                    {status === "success" ? (
                        <>
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <HiCheckCircle className="text-5xl text-green-500" />
                            </div>
                            <h2 className="text-4xl font-black mb-4">Payment Successful!</h2>
                            <p className="text-surface-400 mb-2">Your order has been placed.</p>
                            {paymentId && (
                                <p className="text-xs font-black text-surface-300 uppercase tracking-widest mt-2 break-all">
                                    Payment ID: {paymentId}
                                </p>
                            )}
                            <button
                                onClick={onClose}
                                className="mt-10 w-full btn-primary py-4"
                            >
                                Continue Shopping
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <HiXCircle className="text-5xl text-red-500" />
                            </div>
                            <h2 className="text-4xl font-black mb-4">Payment Failed</h2>
                            <p className="text-surface-400 mb-8">Something went wrong. Please try again.</p>
                            <button onClick={onClose} className="mt-4 w-full btn-primary py-4">
                                Try Again
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// ----- Main Cart Component -----
const AddToCart = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentId, setPaymentId] = useState("");
    const [paying, setPaying] = useState(false);
    const [paymentEnabled, setPaymentEnabled] = useState(false);
    const [configLoading, setConfigLoading] = useState(true);

    // Fetch payment gateway config on mount
    useEffect(() => {
        axios.get(`${baseURL}/payment/config`)
            .then(res => setPaymentEnabled(res.data?.data?.enabled === true))
            .catch(() => setPaymentEnabled(false))
            .finally(() => setConfigLoading(false));
    }, []);

    const handleAdd = (item) => dispatch(cartActions.addToCart(item));
    const handleRemove = (id) => dispatch(cartActions.removeFromCart(id));
    const handleClear = () => dispatch(cartActions.clearCart());

    const handlePayment = async () => {
        setPaying(true);
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            alert("Failed to load Razorpay. Please check your internet connection.");
            setPaying(false);
            return;
        }

        try {
            // Create Razorpay order on the backend
            const res = await axios.post(`${baseURL}/payment/create-order`, {
                amount: totalAmount,
            });

            const { orderId, amount, currency, keyId } = res.data.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: "TheFoodClub",
                description: `Order for ${items.length} item(s)`,
                order_id: orderId,
                handler: async function (response) {
                    // Payment success callback
                    try {
                        await axios.post(`${baseURL}/payment/verify`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setPaymentId(response.razorpay_payment_id);
                        setPaymentStatus("success");
                        dispatch(cartActions.clearCart());
                    } catch {
                        setPaymentStatus("failed");
                    }
                },
                prefill: {
                    name: "Guest Customer",
                    email: "guest@tfc.com",
                },
                notes: {
                    source: "TheFoodClub Web App",
                },
                theme: {
                    color: "#E63946",
                },
                modal: {
                    ondismiss: () => setPaying(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => {
                setPaymentStatus("failed");
                setPaying(false);
            });
            rzp.open();
        } catch (err) {
            console.error("Payment initiation error:", err);
            setPaymentStatus("failed");
        } finally {
            setPaying(false);
        }
    };

    const handleCloseModal = () => {
        setPaymentStatus(null);
        setPaymentId("");
    };

    if (items.length === 0 && !paymentStatus) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] shadow-xl border border-surface-200"
                >
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-3xl mb-4">Your Cart is Empty</h2>
                    <p className="text-surface-400 mb-8 max-w-sm">
                        Looks like you haven't added anything to your cart yet. Explore our delicious menu!
                    </p>
                    <NavLink to="/menu" className="btn-primary inline-block">
                        Browse Menu
                    </NavLink>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <PaymentModal status={paymentStatus} paymentId={paymentId} onClose={handleCloseModal} />

            <div className="max-w-6xl mx-auto py-10 px-6">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-5xl tracking-tight">Your <span className="text-brand">Cart</span></h1>
                    <button
                        onClick={handleClear}
                        className="text-surface-400 hover:text-brand font-bold uppercase tracking-widest text-xs transition-colors py-2 px-4 rounded-full border border-surface-200 hover:border-brand"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.menuItemId}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white p-6 rounded-3xl border border-surface-200 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={`data:image/png;base64,${item?.image?.toString("base64")}`}
                                            alt={item.itemName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1">{item.itemName}</h3>
                                        <p className="text-brand font-black text-lg">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-surface-50 p-2 rounded-2xl border border-surface-200">
                                        <button
                                            onClick={() => handleRemove(item.menuItemId)}
                                            className="p-1.5 rounded-xl hover:bg-white hover:text-brand transition-colors"
                                        >
                                            <HiMinus className="text-xl" />
                                        </button>
                                        <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleAdd(item)}
                                            className="p-1.5 rounded-xl hover:bg-white hover:text-brand transition-colors"
                                        >
                                            <HiPlus className="text-xl" />
                                        </button>
                                    </div>

                                    <div className="text-right min-w-[100px]">
                                        <p className="text-xs uppercase tracking-widest text-surface-400 mb-1 font-black">Subtotal</p>
                                        <p className="text-xl font-black">₹{Number(item.totalPrice).toFixed(2)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-surface-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand opacity-10 blur-[80px] rounded-full -mr-20 -mt-20"></div>

                            <h2 className="text-3xl mb-8 relative z-10">Order Summary</h2>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between text-surface-400">
                                    <span>Subtotal</span>
                                    <span>₹{Number(totalAmount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-surface-400">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-400">FREE</span>
                                </div>
                                <div className="h-px bg-white/10 my-6"></div>
                                <div className="flex justify-between text-2xl font-black">
                                    <span>Total</span>
                                    <span className="text-accent">₹{Number(totalAmount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Pay Button — conditionally shown based on admin config */}
                            {configLoading ? (
                                <div className="w-full py-4 rounded-full bg-white/10 animate-pulse relative z-10" />
                            ) : paymentEnabled ? (
                                <>
                                    <button
                                        onClick={handlePayment}
                                        disabled={paying}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-white text-surface-950 font-black uppercase tracking-widest text-sm hover:bg-brand hover:text-white transition-all duration-500 shadow-2xl relative z-10 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {paying ? (
                                            <span className="animate-pulse">Processing...</span>
                                        ) : (
                                            <>
                                                <img
                                                    src="https://razorpay.com/favicon.png"
                                                    alt="Razorpay"
                                                    className="w-5 h-5 rounded"
                                                />
                                                Pay with Razorpay
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 mt-6 text-surface-500 relative z-10">
                                        <HiShieldCheck className="text-green-400 text-lg" />
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black">
                                            100% Safe & Secure Payments
                                        </p>
                                    </div>

                                    {/* Payment Badges */}
                                    <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                                        <p className="text-[9px] text-surface-500 uppercase tracking-widest text-center mb-4">Accepted Payment Methods</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {["UPI", "Cards", "Net Banking", "Wallets", "EMI"].map((method) => (
                                                <span
                                                    key={method}
                                                    className="text-[9px] font-black text-surface-400 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest"
                                                >
                                                    {method}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="relative z-10 mt-2">
                                    <div className="w-full py-4 px-6 rounded-full bg-white/5 border border-white/10 text-center">
                                        <p className="text-surface-300 text-xs font-black uppercase tracking-widest">💵 Pay at Counter</p>
                                        <p className="text-surface-500 text-[10px] mt-1">Online payments are currently unavailable.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddToCart;
