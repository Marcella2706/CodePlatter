import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { AuthCard } from "../components/auth/AuthCard";
import { AuthInput } from "../components/auth/AuthInput";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/auth/ThemeToggle";
import axios from 'axios'

const BASE_URL = "http://localhost:5703/api/v1/auth";

type AuthMode = "signup" | "signin" | "forgot" | "verify" | "reset";

interface FormData {
  name?: string;
  email?: string;
  password?: string;
}

export default function AuthPage() {
    const [mode, setMode] = useState<AuthMode>("signin");
    const [form, setForm] = useState<FormData>({});
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const handleChange = (e:any) => {
        setForm({ ...form, [e.target.name]: [e.target.value] });
    };

    const handleSignUp = async () => {
        try {
            await axios.post(`${BASE_URL}/register`, form);
            alert("Sign up successful!");
            setMode("signin");
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Sign up failed");
        }
    };

    const handleSignIn = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/login`, form);
            alert("Sign in successful!");
            console.log(res.data);
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Sign in failed");
        }
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post(`${BASE_URL}/forgot-password`, { email });
            alert("OTP sent to email");
            setMode("verify");
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Error sending OTP");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
            alert("OTP verified");
            setMode("reset");
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResetPassword = async () => {
        try {
            await axios.post(`${BASE_URL}/reset-password`, {
                email,
                password: form.password,
            });
            alert("Password reset successful!");
            setMode("signin");
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Password reset failed");
        }
    };

    const getTitle = () => {
        switch (mode) {
          case "signup": return "Create Account";
          case "signin": return "Welcome Back";
          case "forgot": return "Forgot Password";
          case "verify": return "Verify OTP";
          case "reset": return "Reset Password";
          default: return "Welcome";
        }
    };

    return (
        <>
          <ThemeToggle />
          <AuthCard>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-auth-gradient-start to-auth-gradient-middle bg-clip-text text-transparent mb-2 animate-slide-up">
                {getTitle()}
              </h1>
              <p className="text-auth-text-muted animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {mode === "signup" 
                  ? "Join our community today" 
                  : mode === "signin" 
                  ? "Sign in to your account"
                  : mode === "forgot"
                  ? "We'll send you a recovery code"
                  : mode === "verify"
                  ? "Enter the code we sent to your email"
                  : "Create your new password"
                }
              </p>
            </div>
    
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {mode === "signup" && (
                <>
                  <AuthInput
                    icon={<FaUser className="w-5 h-5" />}
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                  />
                  <AuthInput
                    icon={<FaEnvelope className="w-5 h-5" />}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <AuthInput
                    icon={<FaLock className="w-5 h-5" />}
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <Button
                    onClick={handleSignUp}
                    variant="auth"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    Create Account
                  </Button>
                  <p className="text-center text-sm text-auth-text-muted">
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("signin")}
                      className="text-primary hover:underline transition-colors duration-300 font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </>
              )}
    
              {mode === "signin" && (
                <>
                  <AuthInput
                    icon={<FaEnvelope className="w-5 h-5" />}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <AuthInput
                    icon={<FaLock className="w-5 h-5" />}
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <Button
                    onClick={handleSignIn}
                    variant="auth"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    Sign In
                  </Button>
                  <div className="flex justify-between text-sm">
                    <button
                      onClick={() => setMode("signup")}
                      className="text-auth-text-muted hover:text-primary transition-colors duration-300"
                    >
                      Create an account
                    </button>
                    <button
                      onClick={() => setMode("forgot")}
                      className="text-primary hover:underline transition-colors duration-300"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </>
              )}

              {mode === "forgot" && (
                <>
                  <AuthInput
                    icon={<FaEnvelope className="w-5 h-5" />}
                    placeholder="Email Address"
                    value={email}
                    onChange={(e:any) => setEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleForgotPassword}
                    variant="auth"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    Send Recovery Code
                  </Button>
                  <button
                    onClick={() => setMode("signin")}
                    className="w-full text-center text-sm text-auth-text-muted hover:text-primary transition-colors duration-300"
                  >
                    Back to Sign In
                  </button>
                </>
              )}
    
              {mode === "verify" && (
                <>
                  <AuthInput
                    icon={<FaKey className="w-5 h-5" />}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    variant="auth"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    Verify Code
                  </Button>
                  <button
                    onClick={() => setMode("forgot")}
                    className="w-full text-center text-sm text-auth-text-muted hover:text-primary transition-colors duration-300"
                  >
                    Didn't receive code? Resend
                  </button>
                </>
              )}

              {mode === "reset" && (
                <>
                  <AuthInput
                    icon={<FaLock className="w-5 h-5" />}
                    name="password"
                    type="password"
                    placeholder="New Password"
                    onChange={handleChange}
                  />
                  <AuthInput
                    icon={<FaLock className="w-5 h-5" />}
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                  />
                  <Button
                    onClick={handleResetPassword}
                    variant="auth"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    Reset Password
                  </Button>
                </>
              )}
            </div>
          </AuthCard>
        </>
      );
};

