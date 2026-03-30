import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, ArrowLeft, Mail, Lock, Key } from "lucide-react";
import FlightLoader from "./components/ui/FlightLoader";

// Import Auth Context and Supabase client
import { UserAuth } from "./context/AuthContext.jsx";
import { supabase } from "./supabaseClient.js";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState(""); // State for success messages
    
    const [rememberMe, setRememberMe] = useState(false);
    // 1. State to toggle the Forgot Password view
    const [isForgotPassword, setIsForgotPassword] = useState(false); 

    const { session, signInUser } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("skyoptima_remembered_email");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); 
        setSuccessMsg("");

        try {
            const result = await signInUser(email, password);
            
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem("skyoptima_remembered_email", email);
                } else {
                    localStorage.removeItem("skyoptima_remembered_email");
                }

                const loggedInUser = result.data?.user;
                if (loggedInUser) {
                    const { data: profile, error: profileError } = await supabase
                        .from("users")
                        .select("company_name")
                        .eq("id", loggedInUser.id)
                        .single();

                    if (profile?.company_name) {
                        navigate("/dashboard");
                    } else {
                        navigate("/register");
                    }
                }
            } else {
                setError(result.error || "Invalid login credentials");
            }
        } catch (err) {
            console.error("Sign-in error:", err);
            setError("A system error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Function to handle the password reset request
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            // Send the reset email via Supabase
            // Note: redirectTo tells Supabase where to send the user after they click the link in their email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`, 
            });

            if (resetError) {
                setError(resetError.message);
            } else {
                setSuccessMsg("Check your email for the password reset link!");
            }
        } catch (err) {
            console.error("Reset error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Helper to toggle views and clear errors
    const toggleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
        setError("");
        setSuccessMsg("");
        setPassword(""); // Clear password for security
    };

    return (
        <>
            <FlightLoader open={loading} text={isForgotPassword ? "Sending link..." : "Signing you in..."} />

            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
                <div className="mx-auto grid min-h-screen w-[min(1200px,calc(100%-32px))] items-center gap-10 py-10 lg:grid-cols-2">
                    
                    {/* --- LEFT COLUMN (Visuals) --- */}
                    <div className="hidden lg:block">
                        <div className="max-w-xl">
                            <div className="mb-6 inline-flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(96,165,250,0.10))]">
                                    <Plane className="h-5 w-5 text-[var(--primary)]" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold tracking-wide">SkyOptima</div>
                                    <div className="text-sm text-[var(--text-soft)]">
                                        AI Dispatch Intelligence
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#93dcff]">
                                Welcome back
                            </div>

                            <h1 className="text-4xl font-bold tracking-[-0.04em] lg:text-6xl">
                                Sign in to continue your
                                <span className="bg-[linear-gradient(135deg,#EAF2FF,var(--primary),var(--primary-2))] bg-clip-text text-transparent">
                                    {" "}dispatch workflow
                                </span>
                            </h1>

                            <p className="mt-5 max-w-lg text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                                Access optimization runs, saved scenarios, and audit-ready planning
                                history through a secure product experience designed for aviation operations.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <InfoCard title="3 Plans" subtitle="Compare smart options" />
                                <InfoCard title="Audit" subtitle="Trace decisions later" />
                                <InfoCard title="Fast" subtitle="Clean workflow access" />
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (Form) --- */}
                    <div className="mx-auto w-full max-w-md">
                        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-8 relative overflow-hidden">
                            
                            <Link
                                to="/"
                                className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-soft)] transition hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to landing page
                            </Link>

                            <div className="mb-6">
                                <h2 className="text-3xl font-bold tracking-[-0.03em]">
                                    {isForgotPassword ? "Reset Password" : "Sign In"}
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                                    {isForgotPassword 
                                        ? "Enter your email address and we'll send you a link to reset your password."
                                        : "Enter your credentials to access your workspace."}
                                </p>
                            </div>

                            {/* 4. Conditional Form Rendering */}
                            <form className="space-y-5" onSubmit={isForgotPassword ? handleResetPassword : handleSignIn}>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                                        <Mail className="h-4 w-4 text-[var(--text-soft)]" />
                                        <input
                                            type="email" 
                                            placeholder="you@example.com"
                                            required
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
                                        />
                                    </div>
                                </div>

                                {/* Only show Password field if we are NOT in forgot password mode */}
                                {!isForgotPassword && (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                                Password
                                            </label>
                                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                                                <Lock className="h-4 w-4 text-[var(--text-soft)]" />
                                                <input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    required
                                                    value={password} 
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 text-sm">
                                            <label className="flex items-center gap-2 text-[var(--text-soft)] cursor-pointer hover:text-white transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="h-4 w-4 rounded border-white/20 bg-transparent cursor-pointer"
                                                />
                                                Remember me
                                            </label>

                                            <button
                                                type="button"
                                                onClick={toggleForgotPassword}
                                                className="text-[var(--primary)] transition hover:text-white"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Error / Success Messages */}
                                {error && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {error}
                                    </div>
                                )}
                                {successMsg && (
                                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                                        {successMsg}
                                    </div>
                                )}

                                {/* Dynamic Action Buttons */}
                                <button
                                    type="submit"
                                    disabled={loading || !!successMsg}
                                    className="block w-full rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-6 py-3 text-center font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px] disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {isForgotPassword ? "Send Reset Link" : "Sign In"}
                                </button>

                                {/* If in Forgot Password mode, show a Back to Sign In button instead */}
                                {isForgotPassword && (
                                    <button
                                        type="button"
                                        onClick={toggleForgotPassword}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8"
                                    >
                                        Back to Sign In
                                    </button>
                                )}
                            </form>

                            {/* Hide Create Account link if they are trying to reset password */}
                            {!isForgotPassword && (
                                <div className="mt-6 text-center text-sm text-[var(--text-soft)]">
                                    Don’t have an account?{" "}
                                    <Link to="/register" className="text-[var(--primary)] hover:text-white">
                                        Create account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function InfoCard({ title, subtitle }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <div className="text-2xl font-bold">{title}</div>
            <div className="mt-1 text-sm text-[var(--text-soft)]">{subtitle}</div>
        </div>
    );
}