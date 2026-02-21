import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { veryfyOtpApi } from "../service/SignupService";
import Alert from "./alert/Alert";
import { useDispatch, useSelector } from "react-redux";
import { sendMail } from "../feature/SendEmailSlice";
import Loading from "./Loading";
import { motion } from "framer-motion";

const Otp = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState("");
  const [statusType, setStatusType] = useState("");
  const email = location.state || "";
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.SendMailSlice);
  const [count, setCount] = useState(0);

  const handleOtpInput = (value) => {
    setOtpValue(value);
  };

  const handleResendOtp = () => {
    const res = dispatch(sendMail(email));
    res.then((res) => {
      if (res.payload?.data?.message) {
        setError(res.payload.data.message);
        setStatusType(res.payload.data.type);
        setTimeout(() => {
          setError("");
          setStatusType("");
        }, 3000);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpValue.length < 4) return;

    async function verifyotp() {
      try {
        const res = await veryfyOtpApi(otpValue);
        setError(res.data.message);
        setStatusType(res.data.type);
        if (res.data.type === 'success') {
          setTimeout(() => {
            setError("");
            setStatusType("");
            navigator("/new-customer");
          }, 2000);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed");
        setStatusType("error");
        setTimeout(() => {
          setError("");
          setStatusType("");
        }, 3000);
      }
    }
    verifyotp();
  };

  return (
    <div className="flex justify-center items-center py-12 px-6">
      <div className={`fixed top-24 z-50 transform transition-all duration-500 ${error ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <Alert type={statusType} message={error} />
      </div>

      {loading && <Loading />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-brand/5 border border-surface-200 p-10 text-center"
      >
        <div className="mb-8">
          <h1 className="text-4xl text-brand mb-2">TFC<span className="text-surface-950">.</span></h1>
          <h2 className="text-2xl text-surface-950 leading-tight">Check Your Email</h2>
          <p className="text-surface-400 mt-2 text-sm italic">
            Verification code sent to <span className="text-surface-950 font-bold not-italic">{email}</span>
          </p>
          <button
            type="button"
            className="text-brand text-xs font-black uppercase tracking-widest mt-2 hover:underline"
            onClick={() => navigator("/sign-up")}
          >
            Wrong email?
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            <OtpInput
              value={otpValue}
              onChange={handleOtpInput}
              numInputs={4}
              renderSeparator={<span className="mx-2"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="!w-16 h-20 text-3xl font-black text-surface-950 border-b-4 border-surface-200 outline-none transition-all duration-300 focus:border-brand bg-surface-50 rounded-t-xl"
                  style={{ width: '4rem' }}
                />
              )}
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={otpValue.length < 4}
              className="w-full btn-primary py-4 shadow-xl shadow-brand/20 active:shadow-none"
            >
              Verify & Continue
            </button>

            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-surface-400">
                Didn't receive the code? {count > 0 && <span>Wait {count}s</span>}
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm font-bold text-surface-950 hover:text-brand transition-colors"
              >
                Resend Code
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Otp;
