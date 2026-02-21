import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendMail } from "../feature/SendEmailSlice";
import Loading from "./Loading";
import { Validations } from "../validations/Validations";
import Alert from "./alert/Alert";
import { motion } from "framer-motion";

const SignUp = () => {
  const navigator = useNavigate("/sign-up/otp");
  const dispatch = useDispatch();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailId, setEmailId] = useState("");
  const [message, setMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const { loading } = useSelector((state) => state.SendMailSlice);

  const handleinput = (e) => {
    const value = e.target.value?.toLowerCase();
    setIsEmailValid(Validations.validateEmail(value));
    setEmailId(value);
  };

  const handleClick = async () => {
    try {
      const res = await dispatch(sendMail(emailId));
      setMessage(res.payload.data.message);
      setStatusType(res.payload.data.type);
      setTimeout(() => {
        setMessage("");
        navigator("/sign-up/otp", { state: emailId });
      }, 2000);
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-6">
      <div className={`fixed top-24 z-50 transform transition-all duration-500 ${message ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <Alert message={message} type={statusType} />
      </div>

      {loading && <Loading />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-brand/5 border border-surface-200 p-10 text-center"
      >
        <div className="mb-8">
          <h1 className="text-4xl text-brand mb-2">TFC<span className="text-surface-950">.</span></h1>
          <h2 className="text-2xl text-surface-950 leading-tight">Welcome Back!</h2>
          <p className="text-surface-400 mt-2 text-sm">Sign in or create an account to start ordering.</p>
        </div>

        <div className="space-y-6">
          <div className="text-left">
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Email Address</label>
            <input
              value={emailId}
              className="input-field mt-1 text-lg font-medium"
              onChange={handleinput}
              placeholder="e.g. delicious@tfc.com"
              type="email"
            />
            {!isEmailValid && emailId && (
              <p className="text-brand text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">
                Please enter a valid Gmail address
              </p>
            )}
          </div>

          <p className="text-xs text-surface-400 leading-relaxed">
            By continuing, you agree to our <span className="text-surface-950 font-bold underline cursor-pointer">Privacy Policy</span> and <span className="text-surface-950 font-bold underline cursor-pointer">Terms & Conditions</span>.
          </p>

          <button
            type="button"
            disabled={!isEmailValid || !emailId}
            onClick={handleClick}
            className="w-full btn-primary py-4 shadow-xl shadow-brand/20 active:shadow-none"
          >
            Send Verification Code
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
