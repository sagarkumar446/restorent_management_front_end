import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerCustomer } from '../feature/customerAuthSlice';
import Alert from './alert/Alert';

const NewCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-fill email from OTP screen if available
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    email: location.state || "",
    password: "",
    confirmPassword: ""
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

    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    const res = await dispatch(registerCustomer(formData));

    if (res.meta.requestStatus === "fulfilled") {
      showAlert("Registration successful! Please login.", "success");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } else {
      showAlert(res.payload || "Registration failed", "error");
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-6">
      <div className={`fixed top-24 z-50 transform transition-all duration-500 ${alert.message ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <Alert type={alert.type} message={alert.message} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-brand/5 border border-surface-200 p-10 text-center">
        <div className="mb-8">
          <h1 className="text-4xl text-brand mb-2">TFC<span className="text-surface-950">.</span></h1>
          <h2 className="text-2xl text-surface-950 leading-tight">Complete Profile</h2>
          <p className="text-surface-400 mt-2 text-sm">Add your details to complete registration.</p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Email</label>
            <input
              className="input-field mt-1"
              value={formData.email}
              name="email"
              readOnly={!!location.state}
              onChange={handleInputChange}
              required
              type="email"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Full Name</label>
            <input
              className="input-field mt-1"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              required
              type="text"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Contact Number</label>
            <input
              className="input-field mt-1"
              value={formData.contactNumber}
              name="contactNumber"
              onChange={handleInputChange}
              required
              type="tel"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Delivery Address</label>
            <input
              className="input-field mt-1"
              value={formData.address}
              name="address"
              onChange={handleInputChange}
              required
              type="text"
              placeholder="123 Main St, Apt 4B"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Password</label>
            <input
              className="input-field mt-1"
              value={formData.password}
              name="password"
              onChange={handleInputChange}
              required
              type="password"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Confirm Password</label>
            <input
              className="input-field mt-1"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleInputChange}
              required
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 shadow-xl shadow-brand/20 active:shadow-none disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;