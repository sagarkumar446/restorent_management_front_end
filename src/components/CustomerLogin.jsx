import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginCustomer } from '../feature/customerAuthSlice';
import Alert from './alert/Alert';
import { motion } from 'framer-motion';

const CustomerLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [alert, setAlert] = useState({ message: '', type: '' });
    const { loading } = useSelector((state) => state.customerAuth);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await dispatch(loginCustomer(formData));

        if (res.meta.requestStatus === "fulfilled") {
            showAlert("Login successful!", "success");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } else {
            showAlert(res.payload || "Invalid credentials", "error");
        }
    };

    return (
        <div className="flex justify-center items-center py-20 px-6 min-h-full">
            <div className={`fixed top-24 z-50 transform transition-all duration-500 ${alert.message ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
                <Alert type={alert.type} message={alert.message} />
            </div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-brand/5 border border-surface-200 p-10 text-center"
            >
                <div className="mb-8">
                    <h1 className="text-4xl text-brand mb-2">TFC<span className="text-surface-950">.</span></h1>
                    <h2 className="text-2xl text-surface-950 leading-tight">Welcome Back!</h2>
                    <p className="text-surface-400 mt-2 text-sm">Sign in to your account.</p>
                </div>

                <div className="space-y-6 text-left">
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Email</label>
                        <input
                            className="input-field mt-1"
                            value={formData.email}
                            name="email"
                            onChange={handleInputChange}
                            required
                            type="email"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Password</label>
                            <span className="text-xs text-brand hover:underline cursor-pointer font-bold">Forgot?</span>
                        </div>
                        <input
                            className="input-field mt-1"
                            value={formData.password}
                            name="password"
                            onChange={handleInputChange}
                            required
                            type="password"
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !formData.email || !formData.password}
                            className="w-full btn-primary py-4 shadow-xl shadow-brand/20 active:shadow-none disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-surface-400 mt-4">
                        Don't have an account? <span onClick={() => navigate('/sign-up')} className="text-brand font-bold cursor-pointer hover:underline">Sign up</span>
                    </p>
                </div>
            </motion.form>
        </div>
    );
};

export default CustomerLogin;
