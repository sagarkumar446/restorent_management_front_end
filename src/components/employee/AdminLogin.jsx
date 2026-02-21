import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { adminAuthActions } from "../../feature/adminAuthSlice";
import { baseURL } from "../../service";
import Alert from "../alert/Alert";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.adminAuth);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(adminAuthActions.loginStart());
        try {
            const response = await axios.post(`${baseURL}/employee/login`, null, {
                params: { email, password },
            });
            if (response.data.statusCode === 200) {
                dispatch(adminAuthActions.loginSuccess(response.data.data));
                navigate("/admin/dashboard");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
            dispatch(adminAuthActions.loginFailure(msg));
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(""), 3000);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-6">
            <div className={`fixed top-24 z-50 transform transition-all duration-500 ${errorMsg ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
                <Alert type="error" message={errorMsg} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-brand/10 border border-surface-200 p-12 text-center"
            >
                <div className="mb-10 text-left">
                    <h1 className="text-4xl text-brand mb-2">Admin <span className="text-surface-950">Login</span></h1>
                    <p className="text-surface-400 text-sm">Access the management dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field mt-1"
                            placeholder="e.g. admin@tfc.com"
                            required
                        />
                    </div>

                    <div className="text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field mt-1"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 shadow-xl shadow-brand/20 active:shadow-none mt-4"
                    >
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                    </button>
                </form>

                <p className="text-[10px] text-surface-400 mt-10 uppercase tracking-[0.2em] font-black">
                    Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
