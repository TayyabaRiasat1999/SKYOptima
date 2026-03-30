import React from "react";
// 1. Import useNavigate
import { Link, useLocation, useNavigate } from "react-router-dom"; 
// 2. Import the LogOut icon from lucide-react to match your current icon set
import { Plane, Bell, Search, LogOut } from "lucide-react"; 
// 3. Import your Auth Context
import { UserAuth } from "./context/AuthContext.jsx"

export default function AppShell({ title, subtitle, children, actions }) {
    const location = useLocation();
    
    // 4. Bring in navigation and auth hooks
    const navigate = useNavigate();
    const { signOut } = UserAuth();

    // 5. Add the sign out function
    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate('/');
        } catch (err) {
            console.error("Sign out error:", err);
        }
    };

    const navItems = [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Optimize", to: "/optimize" },
        { label: "Results", to: "/results" },
        { label: "Audit Trail", to: "/audit" },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <div className="mx-auto w-[min(1280px,calc(100%-32px))] py-6">
                <header className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(96,165,250,0.10))]">
                                <Plane className="h-5 w-5 text-[var(--primary)]" />
                            </div>
                            <div>
                                <div className="text-lg font-bold">SkyOptima Workspace</div>
                                <div className="text-sm text-[var(--text-soft)]">
                                    Internal product flow for planning, results, and review
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-soft)] hover:text-white transition">
                                <Search className="h-4 w-4" />
                                Search
                            </button>
                            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-soft)] hover:text-white transition">
                                <Bell className="h-4 w-4" />
                                Alerts
                            </button>
                            
                            {/* 6. The New Sign Out Button */}
                            <button 
                                onClick={handleSignOut}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                            
                            <Link
                                to="/"
                                className="rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                            >
                                Landing Page
                            </Link>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {navItems.map((item) => {
                            const active = location.pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={
                                        active
                                            ? "rounded-2xl border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] px-4 py-2 text-sm font-semibold text-[#a8e7ff]"
                                            : "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-soft)] transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </header>

                <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                </section>

                {children}
            </div>
        </div>
    );
}