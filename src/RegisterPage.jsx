import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, ArrowLeft, Mail, Lock, User, Building2, Globe, Phone, FileDigit } from "lucide-react";
import FlightLoader from "./components/ui/FlightLoader";

import { UserAuth } from './context/AuthContext.jsx';
import { supabase } from './supabaseClient.js';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { signUpNewUser } = UserAuth();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dltUnid: '',
        companyType: 'Airline', // Default is Airline
        region: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Auto-clear DLT/UNID if they switch away from Airline
            if (name === 'companyType' && value !== 'Airline') {
                newData.dltUnid = '';
                // Also clear any lingering errors for it
                setErrors(errs => ({ ...errs, dltUnid: '' }));
            }
            return newData;
        });

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateField = (name, value) => {
        let errorMsg = '';

        if (name === 'email') {
            const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
            const domain = value.split('@')[1]?.toLowerCase();
            if (personalDomains.includes(domain)) {
                errorMsg = 'Please use a company email (no personal domains).';
            } else if (!value.includes('@')) {
                errorMsg = 'Invalid email format.';
            }
        }

        if (name === 'password') {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(value)) {
                errorMsg = 'Min 8 characters, must include letters and numbers.';
            }
        }

        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                errorMsg = 'Passwords do not match.';
            }
        }

        // ONLY validate DLT/UNID if the company type is Airline
        if (name === 'dltUnid' && formData.companyType === 'Airline') {
            const icaoRegex = /^[A-Z]{3}$/;
            if (!icaoRegex.test(value.toUpperCase())) {
                errorMsg = 'Must be a 3-letter uppercase ICAO code (e.g., DAL).';
            }
        }

        if (name === 'phone') {
            if (value && value.length < 10) {
                errorMsg = 'Please enter a valid phone number.';
            }
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setGlobalError('');

        const hasErrors = Object.values(errors).some(msg => msg !== '');
        if (hasErrors) {
            setGlobalError("Please fix the errors in the form before submitting.");
            return;
        }

        // Check required fields (DLT/UNID is conditionally required)
        if (!formData.username || !formData.email || !formData.password || !formData.companyName) {
            setGlobalError("Please fill in all required fields.");
            return;
        }

        if (formData.companyType === 'Airline' && !formData.dltUnid) {
            setGlobalError("DLT / UNID is required for Airlines.");
            return;
        }

        setLoading(true);

        try {
            // Pass the DLT/UNID (it will be empty if they are a Cargo Agent)
            const result = await signUpNewUser(formData.email, formData.password, formData.username, formData.dltUnid);
            
            if (!result.success) {
                setGlobalError(result.error || "Failed to create account.");
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || result.data?.user?.id;

            if (userId) {
                const { error: dbError } = await supabase.from('users').update({ 
                    company_name: formData.companyName, 
                    company_type: formData.companyType,
                    region: formData.region,
                    phone_number: formData.phone 
                }).eq('id', userId);

                if (dbError) {
                    setGlobalError(`Account created, but profile update failed: ${dbError.message}`);
                } else {
                    navigate("/dashboard");
                }
            } else {
                navigate("/signin"); 
            }

        } catch (err) {
            console.error("Registration error:", err);
            setGlobalError("An unexpected system error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FlightLoader open={loading} text="Creating workspace..." />

            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
                <div className="mx-auto grid min-h-screen w-[min(1200px,calc(100%-32px))] items-center gap-10 py-10 lg:grid-cols-2">
                    
                    <div className="hidden lg:block">
                        <div className="max-w-xl">
                            <div className="mb-6 inline-flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(96,165,250,0.10))]">
                                    <Plane className="h-5 w-5 text-[var(--primary)]" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold tracking-wide">SkyOptima</div>
                                    <div className="text-sm text-[var(--text-soft)]">AI Dispatch Intelligence</div>
                                </div>
                            </div>
                            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#93dcff]">
                                Create workspace
                            </div>
                            <h1 className="text-4xl font-bold tracking-[-0.04em] lg:text-6xl">
                                Build your
                                <span className="bg-[linear-gradient(135deg,#EAF2FF,var(--primary),var(--primary-2))] bg-clip-text text-transparent">
                                    {" "}operations account
                                </span>
                            </h1>
                            <p className="mt-5 max-w-lg text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                                Set up your workspace to run optimizations, review results,
                                save decisions, and manage planning activity.
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto w-full max-w-lg">
                        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-8">
                            <Link to="/signin" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-soft)] transition hover:text-white">
                                <ArrowLeft className="h-4 w-4" /> Back to sign in
                            </Link>

                            <div className="mb-6">
                                <h2 className="text-3xl font-bold tracking-[-0.03em]">Create Account</h2>
                            </div>

                            <form className="space-y-4" onSubmit={handleCreateAccount}>
                                {/* Moved Company Type to the top so it dictates the form flow logically */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        name="username" label="Full Name" type="text"
                                        icon={<User className="h-4 w-4 text-[var(--text-soft)]" />}
                                        placeholder="John Doe"
                                        value={formData.username} onChange={handleChange}
                                        onBlur={(e) => validateField('username', e.target.value)}
                                        error={errors.username} required
                                    />
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                            Company Type <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                                            <Building2 className="h-4 w-4 text-[var(--text-soft)]" />
                                            <select
                                                name="companyType"
                                                value={formData.companyType}
                                                onChange={handleChange}
                                                className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                                            >
                                                <option className="bg-slate-900" value="Airline">Airline</option>
                                                <option className="bg-slate-900" value="Cargo Agent">Cargo Agent</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* CONDITIONAL RENDERING: Only show if Airline */}
                                {formData.companyType === 'Airline' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Field
                                            name="dltUnid" label="DLT / UNID" type="text"
                                            icon={<FileDigit className="h-4 w-4 text-[var(--text-soft)]" />}
                                            placeholder="e.g. DAL"
                                            value={formData.dltUnid} onChange={handleChange}
                                            onBlur={(e) => validateField('dltUnid', e.target.value)}
                                            error={errors.dltUnid} required
                                        />
                                    </div>
                                )}

                                <Field
                                    name="companyName" label="Company Name" type="text"
                                    icon={<Building2 className="h-4 w-4 text-[var(--text-soft)]" />}
                                    placeholder="Your Organization"
                                    value={formData.companyName} onChange={handleChange}
                                    error={errors.companyName} required
                                />

                                <Field
                                    name="email" label="Company Email" type="email"
                                    icon={<Mail className="h-4 w-4 text-[var(--text-soft)]" />}
                                    placeholder="you@airline.com"
                                    value={formData.email} onChange={handleChange}
                                    onBlur={(e) => validateField('email', e.target.value)}
                                    error={errors.email} required
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        name="password" label="Password" type="password"
                                        icon={<Lock className="h-4 w-4 text-[var(--text-soft)]" />}
                                        placeholder="Create password"
                                        value={formData.password} onChange={handleChange}
                                        onBlur={(e) => validateField('password', e.target.value)}
                                        error={errors.password} required
                                    />
                                    <Field
                                        name="confirmPassword" label="Confirm Password" type="password"
                                        icon={<Lock className="h-4 w-4 text-[var(--text-soft)]" />}
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword} onChange={handleChange}
                                        onBlur={(e) => validateField('confirmPassword', e.target.value)}
                                        error={errors.confirmPassword} required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        name="region" label="Region" type="text"
                                        icon={<Globe className="h-4 w-4 text-[var(--text-soft)]" />}
                                        placeholder="North America"
                                        value={formData.region} onChange={handleChange} required
                                    />
                                    <Field
                                        name="phone" label="Phone Number" type="text"
                                        icon={<Phone className="h-4 w-4 text-[var(--text-soft)]" />}
                                        placeholder="Phone number"
                                        value={formData.phone} onChange={handleChange}
                                        onBlur={(e) => validateField('phone', e.target.value)}
                                        error={errors.phone}
                                    />
                                </div>

                                {globalError && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {globalError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="block w-full mt-2 rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-6 py-3 text-center font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px] disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {loading ? 'Processing...' : 'Complete Registration'}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-[var(--text-soft)]">
                                Already have an account?{" "}
                                <Link to="/signin" className="text-[var(--primary)] hover:text-white">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Field({ label, icon, placeholder, type = "text", name, value, onChange, onBlur, error, required }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className={`flex items-center gap-3 rounded-2xl border ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-[rgba(8,18,32,0.72)]'} px-4 py-3 transition-colors`}>
                {icon}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
                />
            </div>
            {error && <p className="mt-1 ml-2 text-xs text-red-400">{error}</p>}
        </div>
    );
}