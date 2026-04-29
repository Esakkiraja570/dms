import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Truck, Smartphone, Lock, Eye, EyeOff, LogIn, Circle } from "lucide-react";
import "./MilkLogin.css";

const MilkLogin = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isForgot, setIsForgot] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Prevent multiple API calls
    if (loading) return;

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setError("Enter valid mobile number");
      return;
    }

    if (!password) {
      setError("Password required");
      return;
    }

    setLoading(true);
    setError("");

   try {
  await axios.post("http://localhost:1010/api/milkman/login", {
    mobile,
    password
  });

  localStorage.setItem("milkmanAuthenticated", "true");
  localStorage.setItem("mobile", mobile);
  localStorage.setItem("userRole", "milkman");

  navigate("/Milkmanadmin");

} catch (err) {
  setError(err.response?.data || "Invalid login ❌");
}
  }
  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setError("Enter valid mobile number");
      return;
    }

    try {
      await axios.post("http://localhost:1010/api/milkman/send-otp", {
        mobile: "+91" + mobile
      });

      alert("OTP sent to +91 " + mobile);
    } catch {
      alert("Failed to send OTP ❌");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    if (!otp || otp.trim().length < 4) {
      alert("Enter a valid OTP");
      return;
    }

    try {
      await axios.post("http://localhost:1010/api/milkman/verify-otp", {
        mobile: "+91" + mobile,
        otp: otp.trim()
      });
      setOtpVerified(true);
      alert("OTP Verified ✅");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed ❌");
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      await axios.post("http://localhost:1010/api/milkman/reset-password", {
        mobile: "+91" + mobile,
        otp,
        newPassword
      });

      alert("Password reset successful ✅");

      setIsForgot(false);
      setOtp("");
      setOtpVerified(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      alert("Reset failed ❌");
    }
  };

  return (
    <div className="dairy-login-wrapper">
      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">

        <div className="truck-icon-box mb-4">
          <Truck size={32} fill="#3b82f6" color="#3b82f6" />
        </div>

        <h2 className="login-title">
          {isForgot ? "Reset Password" : "Milkman Login"}
        </h2>

        <p className="login-subtitle mb-5">
          {isForgot
            ? "Secure OTP based password reset"
            : "Manage daily milk entries and billing"}
        </p>

        <div className="card login-card shadow-lg p-4 p-md-5">
          <form onSubmit={handleLogin}>

            {error && (
              <div className="alert alert-danger text-center small">
                {error}
              </div>
            )}

            {/* MOBILE */}
            <div className="mb-4">
              <label className="input-label">MOBILE NUMBER</label>
              <div className="input-group-custom">
                <Smartphone className="input-icon" size={20} />
                <input
                  type="tel"
                  autoComplete="username"
                  className="form-control dairy-input"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                />
              </div>
            </div>

            {/* LOGIN */}
            {!isForgot && (
              <>
                <div className="mb-4">
                  <label className="input-label">PASSWORD</label>
                  <div className="input-group-custom">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="form-control dairy-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3"
                  disabled={loading}
                >
                  {loading ? "Authorizing..." : "Secure Login"}{" "}
                  <LogIn size={18} className="ms-2" />
                </button>
              </>
            )}

            {/* FORGOT PASSWORD */}
            {isForgot && (
              <>
                {!otpVerified && (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning w-100 mb-3"
                      onClick={sendOtp}
                    >
                      Send OTP
                    </button>

                    <input
                      className="form-control mb-3"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={verifyOtp}
                    >
                      Verify OTP
                    </button>
                  </>
                )}

                {otpVerified && (
                  <>
                    <input
                      type="password"
                      autoComplete="new-password"
                      className="form-control mb-3"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                      type="password"
                      autoComplete="new-password"
                      className="form-control mb-3"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={resetPassword}
                    >
                      Reset Password
                    </button>
                  </>
                )}
              </>
            )}

            {/* SWITCH */}
            <div className="text-end mt-3">
              <button
                type="button"
                className="forgot-pw-link"
                onClick={() => {
                  setIsForgot(!isForgot);
                  setOtpVerified(false);
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#0d6efd",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
              >
                {isForgot ? "Back to Login" : "Forgot password?"}
              </button>
            </div>
          </form>

          <div className="status-row mt-5 pt-4 border-top d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <Circle size={8} fill="#0d6efd" className="me-2" />
              <span className="status-text">SYSTEMS ACTIVE</span>
            </div>
            <span className="version-text">V4.2.0-DAIRY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkLogin;