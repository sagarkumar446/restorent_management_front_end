import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { baseURL } from "../../service";
import {
    HiArrowLeft, HiSave, HiEye, HiEyeOff, HiCheckCircle,
    HiExclamationCircle, HiShieldCheck, HiRefresh, HiSwitchHorizontal
} from "react-icons/hi";

const AdminPaymentSettings = () => {
    const navigate = useNavigate();
    const { admin } = useSelector((s) => s.adminAuth);

    const [config, setConfig] = useState({ razorpayKeyId: "", razorpayKeySecret: "", enabled: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [isNewSecret, setIsNewSecret] = useState(false); // did admin type a new secret?
    const [toast, setToast] = useState({ show: false, type: "", msg: "" });

    useEffect(() => {
        if (!admin) { navigate("/admin/login"); return; }
        fetchConfig();
    }, [admin]);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/payment/config`);
            setConfig(res.data.data);
        } catch (e) {
            showToast("error", "Could not load config.");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, msg) => {
        setToast({ show: true, type, msg });
        setTimeout(() => setToast({ show: false, type: "", msg: "" }), 4000);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                razorpayKeyId: config.razorpayKeyId,
                razorpayKeySecret: isNewSecret ? config.razorpayKeySecret : undefined,
                enabled: config.enabled,
            };
            // If secret wasn't changed, don't send (backend will keep existing)
            const sendPayload = isNewSecret
                ? payload
                : { razorpayKeyId: config.razorpayKeyId, enabled: config.enabled, razorpayKeySecret: config.razorpayKeySecret };

            const res = await axios.post(`${baseURL}/payment/config`, sendPayload);
            showToast("success", res.data.message || "Settings saved!");
            setIsNewSecret(false);
            fetchConfig();
        } catch (err) {
            showToast("error", err.response?.data?.message || "Failed to save. Check your keys.");
        } finally {
            setSaving(false);
        }
    };

    const isConfigured = config.razorpayKeyId && config.razorpayKeyId.startsWith("rzp_");

    return (
        <div className="min-h-screen bg-surface-50 p-6 md:p-12">

            {/* Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        key="toast"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm ${toast.type === "success" ? "bg-green-500" : "bg-brand"
                            }`}
                    >
                        {toast.type === "success" ? <HiCheckCircle className="text-xl" /> : <HiExclamationCircle className="text-xl" />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="mb-12">
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-2 text-surface-400 hover:text-brand font-bold uppercase tracking-widest text-xs mb-4 transition-colors"
                >
                    <HiArrowLeft /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-5xl tracking-tight">Payment <span className="text-brand">Settings</span></h1>
                        <p className="text-surface-400 mt-2 text-sm">Configure your Razorpay gateway credentials for online payments.</p>
                    </div>
                    {/* Status Badge */}
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 font-black text-sm uppercase tracking-widest self-start md:self-auto ${config.enabled && isConfigured
                            ? "border-green-400 bg-green-50 text-green-600"
                            : "border-surface-200 bg-white text-surface-400"
                        }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${config.enabled && isConfigured ? "bg-green-400 animate-pulse" : "bg-surface-300"}`} />
                        {config.enabled && isConfigured ? "Gateway Live" : "Not Active"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* ── Config Form ─────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-surface-200 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-50 border border-surface-100 flex items-center justify-center">
                            <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-8 h-8 rounded" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Razorpay API Keys</h2>
                            <p className="text-xs text-surface-400 uppercase tracking-widest mt-0.5 font-bold">
                                Get keys at{" "}
                                <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noreferrer" className="text-brand hover:underline">
                                    dashboard.razorpay.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 text-surface-300">Loading current config...</div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-7">
                            {/* Key ID */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1 block mb-1.5">
                                    Key ID <span className="text-brand">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.razorpayKeyId}
                                    onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                                    placeholder="rzp_test_xxxxxxxxxxxx"
                                    className="input-field font-mono tracking-wide"
                                    required
                                />
                                <p className="text-[10px] text-surface-300 mt-1.5 ml-1">
                                    Starts with <code className="bg-surface-100 px-1.5 py-0.5 rounded-md">rzp_test_</code> for test mode or&nbsp;
                                    <code className="bg-surface-100 px-1.5 py-0.5 rounded-md">rzp_live_</code> for production.
                                </p>
                            </div>

                            {/* Key Secret */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1 block mb-1.5">
                                    Key Secret <span className="text-brand">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showSecret ? "text" : "password"}
                                        value={config.razorpayKeySecret}
                                        onChange={(e) => { setConfig({ ...config, razorpayKeySecret: e.target.value }); setIsNewSecret(true); }}
                                        placeholder={isNewSecret ? "Enter new secret key" : "••••••••••••••••••"}
                                        className="input-field font-mono tracking-wide pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-brand transition-colors"
                                    >
                                        {showSecret ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
                                    </button>
                                </div>
                                {!isNewSecret && (
                                    <p className="text-[10px] text-surface-300 mt-1.5 ml-1 flex items-center gap-1">
                                        <HiShieldCheck className="text-green-400" />
                                        Secret is stored securely. A new value will replace the existing one.
                                    </p>
                                )}
                            </div>

                            {/* Mode indicator */}
                            {config.razorpayKeyId && (
                                <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold ${config.razorpayKeyId.startsWith("rzp_live_")
                                        ? "bg-green-50 border border-green-200 text-green-700"
                                        : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                                    }`}>
                                    <HiSwitchHorizontal className="text-lg" />
                                    {config.razorpayKeyId.startsWith("rzp_live_")
                                        ? "🟢 Live Mode — real payments will be processed."
                                        : "🟡 Test Mode — use Razorpay test cards only."}
                                </div>
                            )}

                            {/* Enable Toggle */}
                            <div className="flex items-center justify-between p-5 bg-surface-50 rounded-2xl border border-surface-200">
                                <div>
                                    <p className="font-black text-surface-950 text-sm">Enable Razorpay Gateway</p>
                                    <p className="text-[10px] text-surface-400 uppercase tracking-widest mt-0.5">
                                        Customers will see the Pay button when enabled
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                                    className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${config.enabled ? "bg-brand" : "bg-surface-200"
                                        }`}
                                >
                                    <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${config.enabled ? "translate-x-7" : "translate-x-0"
                                        }`} />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {saving ? (
                                        <span className="animate-pulse">Saving...</span>
                                    ) : (
                                        <><HiSave className="text-lg" /> Save Configuration</>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={fetchConfig}
                                    className="px-6 py-4 rounded-full border-2 border-surface-200 hover:border-surface-400 text-surface-500 hover:text-surface-950 transition-all"
                                    title="Reload from server"
                                >
                                    <HiRefresh className="text-xl" />
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>

                {/* ── Info / Help Panel ────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-6"
                >
                    {/* Steps */}
                    <div className="bg-surface-950 text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand/20 blur-[60px] rounded-full" />
                        <h3 className="text-lg font-black mb-6 relative z-10">How to Get API Keys</h3>
                        <ol className="space-y-5 relative z-10">
                            {[
                                { n: "1", text: <>Sign up at <a href="https://razorpay.com" target="_blank" rel="noreferrer" className="text-brand underline">razorpay.com</a></> },
                                { n: "2", text: "Go to Settings → API Keys" },
                                { n: "3", text: 'Click "Generate Test Key"' },
                                { n: "4", text: "Copy Key ID & Key Secret here" },
                                { n: "5", text: "Toggle Enable & Save" },
                            ].map(({ n, text }) => (
                                <li key={n} className="flex items-start gap-4">
                                    <span className="w-7 h-7 flex-shrink-0 bg-brand/20 border border-brand/30 rounded-full flex items-center justify-center text-brand text-xs font-black">
                                        {n}
                                    </span>
                                    <span className="text-surface-300 text-sm leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Test Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-surface-200 shadow-sm">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                            <span className="text-2xl">💳</span> Test Card Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            {[
                                ["Card No.", "4111 1111 1111 1111"],
                                ["Expiry", "Any future date"],
                                ["CVV", "Any 3 digits"],
                                ["OTP", "Any 6 digits"],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-surface-100 last:border-0">
                                    <span className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">{label}</span>
                                    <code className="text-surface-950 font-black bg-surface-50 px-3 py-1 rounded-xl text-xs">{val}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* UPI Test */}
                    <div className="bg-brand/5 border border-brand/20 p-6 rounded-[2rem]">
                        <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">UPI Test ID</p>
                        <code className="text-sm text-surface-950 font-bold">success@razorpay</code>
                        <p className="text-[10px] text-surface-400 mt-2">Use this UPI ID to simulate a successful UPI payment.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPaymentSettings;
