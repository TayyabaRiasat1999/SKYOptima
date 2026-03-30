import React from "react";
import { ArrowRight } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import GlassCard from "../ui/GlassCard";

export default function LandingCTA() {
    return (
        <section id="contact" className="relative">
            <div className="mx-auto w-[min(1200px,calc(100%-32px))] py-16 sm:py-20">
                <GlassCard className="bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_20%),rgba(255,255,255,0.05)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.34)] sm:p-10 lg:p-12">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
                        <div>
                            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#93dcff]">
                                Ready to build
                            </div>
                            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                                Present your aviation AI platform like a real SaaS product
                            </h2>
                            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                                Turn backend models, optimization logic, and audit-ready outputs
                                into a polished product experience with landing, auth, dashboard,
                                results, and workflow pages.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                            <PrimaryButton to="/signin">
                                Start Building <ArrowRight className="h-4 w-4" />
                            </PrimaryButton>

                            <SecondaryButton href="#workflow" className="text-center">
                                View Dashboard Flow
                            </SecondaryButton>
                        </div>
                    </div>
                </GlassCard>

                <footer className="pt-10 text-sm text-[var(--text-soft)]">
                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>SkyOptima • AI Dispatch Intelligence</div>
                        <div>Designed for optimization, transparency, and real product presentation</div>
                    </div>
                </footer>
            </div>
        </section>
    );
}