import React from "react";

export default function LandingWorkflow() {
    return (
        <section id="workflow" className="relative">
            <div className="mx-auto w-[min(1200px,calc(100%-32px))] py-16 sm:py-20">
                <div className="mb-10 max-w-3xl">
                    <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#93dcff]">
                        How it works
                    </div>
                    <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                        A simple flow with a strong product story
                    </h2>
                    <p className="mt-4 text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                        This flow is ideal for demos because it clearly connects user input,
                        optimization logic, output comparison, and decision traceability.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <StepCard
                        number="1"
                        title="Enter Scenario"
                        description="Choose route, aircraft, payload, and operating conditions."
                    />
                    <StepCard
                        number="2"
                        title="Run Optimization"
                        description="Calculate cost, ETA, fuel implications, and trade-offs."
                    />
                    <StepCard
                        number="3"
                        title="Compare Options"
                        description="Review the top ranked plans with recommendation context."
                    />
                    <StepCard
                        number="4"
                        title="Save Decision"
                        description="Store the selected plan in an audit-ready history."
                    />
                </div>
            </div>
        </section>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-sm font-extrabold text-slate-950 shadow-[0_10px_24px_rgba(56,189,248,0.28)]">
                {number}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                {description}
            </p>
        </div>
    );
}