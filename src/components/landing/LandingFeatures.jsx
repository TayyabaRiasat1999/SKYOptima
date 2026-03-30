import React from "react";
import {
    BarChart3,
    ShieldCheck,
    SlidersHorizontal,
    FileText,
    Route,
    Clock3,
} from "lucide-react";

export default function LandingFeatures() {
    return (
        <section id="features" className="relative">
            <div className="mx-auto w-[min(1200px,calc(100%-32px))] py-16 sm:py-20">
                <div className="mb-10 max-w-3xl">
                    <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#93dcff]">
                        Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                        Built for operational clarity, speed, and trust
                    </h2>
                    <p className="mt-4 text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                        Designed around your actual product logic: smart plan comparison,
                        explainability, adjustable scenarios, risk awareness, and audit-ready outputs.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <FeatureCard
                        icon={<BarChart3 className="h-6 w-6 text-[var(--primary)]" />}
                        title="3 Smart Plans"
                        description="Compare Economical, Balanced, and Fastest plans through a clean decision-support interface."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-6 w-6 text-[var(--primary)]" />}
                        title="Explainable Recommendations"
                        description="Understand why a plan ranks higher using clear factors such as cost, ETA, reserve logic, and operational stability."
                    />
                    <FeatureCard
                        icon={<SlidersHorizontal className="h-6 w-6 text-[var(--primary)]" />}
                        title="Scenario Controls"
                        description="Adjust payload, fuel price, headwind, visibility, and route assumptions for realistic planning flexibility."
                    />
                    <FeatureCard
                        icon={<Clock3 className="h-6 w-6 text-[var(--primary)]" />}
                        title="ETA & Cost Intelligence"
                        description="Surface time and cost trade-offs early, so dispatch choices become faster and easier to justify."
                    />
                    <FeatureCard
                        icon={<Route className="h-6 w-6 text-[var(--primary)]" />}
                        title="Feasibility & Risk Layer"
                        description="Support more confident decisions by combining optimization output with route practicality and risk awareness."
                    />
                    <FeatureCard
                        icon={<FileText className="h-6 w-6 text-[var(--primary)]" />}
                        title="Audit Trail Ready"
                        description="Store decision history and recommendation context so users can present or review the reasoning later."
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="group rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md transition duration-300 hover:border-[rgba(56,189,248,0.22)] hover:translate-y-[-4px]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(96,165,250,0.08))]">
                {icon}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                {description}
            </p>
        </div>
    );
}