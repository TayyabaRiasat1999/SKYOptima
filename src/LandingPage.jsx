import React from "react";
import { Link } from "react-router-dom";
import { Plane, Menu } from "lucide-react";
import LandingHero from "./components/landing/LandingHero";
import LandingFeatures from "./components/landing/LandingFeatures";
import LandingWorkflow from "./components/landing/LandingWorkflow";
import LandingPreview from "./components/landing/LandingPreview";
import LandingCTA from "./components/landing/LandingCTA";


export default function LandingPage() {
    return (
        <>
            <style>{`
        @keyframes orbDrift {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(18px) translateX(10px); }
        }
      `}</style>

            <div className="min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
                <div className="pointer-events-none fixed inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)]" />

                <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,17,32,0.75)] backdrop-blur-xl">
                    <div className="mx-auto flex w-[min(1200px,calc(100%-32px))] items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(96,165,250,0.10))] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                                <Plane className="h-5 w-5 text-[var(--primary)]" />
                            </div>

                            <div>
                                <div className="text-base font-bold tracking-wide">SkyOptima</div>
                                <div className="text-xs text-[var(--text-soft)]">
                                    AI Dispatch Intelligence
                                </div>
                            </div>
                        </div>

                        <nav className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm text-[var(--text-soft)] transition hover:text-white">
                                Features
                            </a>
                            <a href="#workflow" className="text-sm text-[var(--text-soft)] transition hover:text-white">
                                How it works
                            </a>
                            <a href="#preview" className="text-sm text-[var(--text-soft)] transition hover:text-white">
                                Preview
                            </a>
                            <a href="#contact" className="text-sm text-[var(--text-soft)] transition hover:text-white">
                                Contact
                            </a>
                        </nav>

                        <div className="hidden items-center gap-3 sm:flex">
                            <Link
                                to="/signin"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signin"
                                className="rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px]"
                            >
                                Launch Demo
                            </Link>
                        </div>

                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[var(--text)] md:hidden">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <main>
                    <LandingHero />
                    <LandingFeatures />
                    <LandingWorkflow />
                    <LandingPreview />
                    <LandingCTA />
                </main>
            </div>
        </>
    );
}