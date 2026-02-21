import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCategories, addCategory, deleteCategory } from "../../feature/categorySlice";
import {
    HiArrowLeft, HiPlusCircle, HiTrash, HiTag, HiCheckCircle, HiExclamationCircle
} from "react-icons/hi";

const EMOJI_OPTIONS = ["🍛", "🍟", "🍰", "🥤", "🍖", "🦐", "🥗", "🍕", "🍜", "🧁", "🍣", "☕", "🥩", "🫕", "🍔"];

const AdminCategories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.adminAuth);
    const { data: categories, loading } = useSelector((state) => state.categories);

    const [form, setForm] = useState({ name: "", displayName: "", emoji: "🍽️" });
    const [toast, setToast] = useState({ show: false, type: "", msg: "" });
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (!admin) { navigate("/admin/login"); return; }
        dispatch(fetchCategories());
    }, [dispatch, admin, navigate]);

    const showToast = (type, msg) => {
        setToast({ show: true, type, msg });
        setTimeout(() => setToast({ show: false, type: "", msg: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        const res = await dispatch(addCategory({
            name: form.name.trim().toUpperCase(),
            displayName: form.displayName.trim() || form.name.trim(),
            emoji: form.emoji,
        }));
        if (res.meta.requestStatus === "fulfilled") {
            showToast("success", `Category "${form.displayName || form.name}" created!`);
            setForm({ name: "", displayName: "", emoji: "🍽️" });
        } else {
            showToast("error", res.payload?.message || "Category may already exist.");
        }
    };

    const handleDelete = async (id, name) => {
        setDeleting(id);
        const res = await dispatch(deleteCategory(id));
        if (res.meta.requestStatus === "fulfilled") {
            showToast("success", `Category "${name}" deleted.`);
        }
        setDeleting(null);
    };

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
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm  ${toast.type === "success" ? "bg-green-500" : "bg-brand"}`}
                    >
                        {toast.type === "success" ? <HiCheckCircle className="text-xl" /> : <HiExclamationCircle className="text-xl" />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="flex items-center gap-2 text-surface-400 hover:text-brand font-bold uppercase tracking-widest text-xs mb-4 transition-colors"
                    >
                        <HiArrowLeft /> Back to Dashboard
                    </button>
                    <h1 className="text-5xl tracking-tight">Manage <span className="text-brand">Categories</span></h1>
                    <p className="text-surface-400 mt-2">Add or remove menu categories. These will appear in the "Add Dish" form.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* Add Category Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[2.5rem] border border-surface-200 shadow-sm lg:sticky lg:top-24"
                >
                    <h2 className="text-2xl mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                            <HiPlusCircle className="text-2xl" />
                        </div>
                        Add Category
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Internal Name (key)</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. PASTA, SALADS"
                                className="input-field mt-1 uppercase"
                                required
                            />
                            <p className="text-[10px] text-surface-300 mt-1 ml-1">Auto-uppercased. Used for filtering.</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Display Name</label>
                            <input
                                type="text"
                                value={form.displayName}
                                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                placeholder="e.g. Italian Pasta"
                                className="input-field mt-1"
                            />
                            <p className="text-[10px] text-surface-300 mt-1 ml-1">Shown to customers. Defaults to key if empty.</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Pick an Emoji</label>
                            <div className="grid grid-cols-5 gap-2 mt-3">
                                {EMOJI_OPTIONS.map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => setForm({ ...form, emoji: e })}
                                        className={`text-2xl p-2 rounded-xl border-2 transition-all ${form.emoji === e ? "border-brand bg-brand/10 scale-110" : "border-surface-200 hover:border-surface-400"}`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={form.emoji}
                                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                placeholder="Or type any emoji"
                                className="input-field mt-3 text-center text-xl"
                                maxLength={4}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            <HiPlusCircle className="text-xl" />
                            Create Category
                        </button>
                    </form>
                </motion.div>

                {/* Existing Categories List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-black text-surface-400 uppercase tracking-widest px-2">
                        {categories.length} Categories
                    </h2>

                    {loading && (
                        <div className="text-center py-20 text-surface-300 text-lg">Loading...</div>
                    )}

                    <AnimatePresence>
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white p-6 rounded-[1.8rem] border border-surface-200 shadow-sm hover:shadow-lg transition-all duration-500 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center text-3xl border border-surface-100 shadow-inner">
                                        {cat.emoji || "🍽️"}
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-surface-950 leading-tight">{cat.displayName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <HiTag className="text-xs text-surface-300" />
                                            <code className="text-[10px] font-black text-surface-300 uppercase tracking-widest">{cat.name}</code>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(cat.id, cat.displayName)}
                                    disabled={deleting === cat.id}
                                    className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-5 py-2.5 bg-red-50 text-brand rounded-2xl font-bold text-sm hover:bg-brand hover:text-white transition-all duration-300 disabled:opacity-50"
                                >
                                    {deleting === cat.id
                                        ? <span className="text-xs">Deleting...</span>
                                        : <><HiTrash /> Delete</>
                                    }
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!loading && categories.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-surface-200 text-surface-300">
                            <p className="text-5xl mb-4">🗂️</p>
                            <p className="font-bold text-lg">No categories yet.</p>
                            <p className="text-sm">Use the form on the left to create your first category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
