import React from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    ShieldCheck,
    Clock3,
    Route,
    Search,
    Download,
} from "lucide-react";
import AppShell from "./AppShell";

export default function AuditTrailPage() {
    return (
        <AppShell
            title="Audit Trail"
            subtitle="Review saved decisions, selected plans, and recommendation context."
            actions={
                <>
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-soft)]">
                        <Search className="h-4 w-4" />
                        Search records
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-soft)]">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <Link
                        to="/dashboard"
                        className="rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                        Dashboard
                    </Link>
                </>
            }
        >
            <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Records Saved"
                    value="52"
                    subtitle="Decision snapshots"
                    icon={<FileText className="h-5 w-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Recommended Chosen"
                    value="41"
                    subtitle="Balanced accepted"
                    icon={<ShieldCheck className="h-5 w-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Avg Review Delay"
                    value="18 min"
                    subtitle="From result to save"
                    icon={<Clock3 className="h-5 w-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Tracked Routes"
                    value="17"
                    subtitle="Unique route pairs"
                    icon={<Route className="h-5 w-5 text-[var(--primary)]" />}
                />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.30)] backdrop-blur-md">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-2xl font-bold">Saved Audit Records</div>
                            <div className="mt-1 text-sm text-[var(--text-soft)]">
                                Decision history for recent optimization runs
                            </div>
                        </div>

                        <Link
                            to="/results"
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8"
                        >
                            Back to Results
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <AuditRecord
                            route="YYZ → YVR"
                            aircraft="B38M"
                            selectedPlan="Balanced"
                            cost="$19,210"
                            eta="4h 44m"
                            reason="Best time-cost trade-off with stable risk profile"
                            time="Saved 12 minutes ago"
                            recommended
                        />

                        <AuditRecord
                            route="YYZ → YYC"
                            aircraft="A320"
                            selectedPlan="Economical"
                            cost="$15,980"
                            eta="3h 51m"
                            reason="Lowest projected cost under moderate schedule pressure"
                            time="Saved 1 hour ago"
                        />

                        <AuditRecord
                            route="YUL → YVR"
                            aircraft="B38M"
                            selectedPlan="Fastest"
                            cost="$21,140"
                            eta="5h 02m"
                            reason="Schedule urgency justified higher fuel and cost profile"
                            time="Saved today at 08:42 AM"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <SidePanel
                        title="Audit Purpose"
                        content="This page is designed to preserve the selected plan, summary metrics, and recommendation reasoning so a dispatcher can later explain the decision to stakeholders."
                    />

                    <SidePanel
                        title="What gets stored later"
                        content="Later, this can contain user ID, timestamp, route, aircraft, selected option, rank explanation, cost summary, ETA summary, and operational assumptions."
                    />

                    <div className="rounded-[28px] border border-[rgba(56,189,248,0.20)] bg-[rgba(56,189,248,0.08)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                        <div className="text-sm font-semibold text-[#a8e7ff]">
                            Suggested next integration
                        </div>
                        <div className="mt-3 text-xl font-bold">
                            Link result selection to audit save
                        </div>
                        <div className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                            When a user selects a plan on the Results page, save the selected
                            plan with a justification summary and input snapshot here.
                        </div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}

function StatCard({ title, value, subtitle, icon }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(96,165,250,0.08))]">
                {icon}
            </div>
            <div className="text-sm text-[var(--text-soft)]">{title}</div>
            <div className="mt-1 text-3xl font-bold">{value}</div>
            <div className="mt-1 text-sm text-[var(--text-soft)]">{subtitle}</div>
        </div>
    );
}

function AuditRecord({
    route,
    aircraft,
    selectedPlan,
    cost,
    eta,
    reason,
    time,
    recommended = false,
}) {
    return (
        <div
            className={
                recommended
                    ? "rounded-[28px] border border-[rgba(56,189,248,0.24)] bg-[linear-gradient(180deg,rgba(56,189,248,0.12),rgba(8,18,32,0.82))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
                    : "rounded-[28px] border border-white/10 bg-[rgba(8,18,32,0.76)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
            }
        >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-xl font-bold">{route}</div>
                    <div className="mt-1 text-sm text-[var(--text-soft)]">{aircraft}</div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-[var(--text)]">
                    {selectedPlan}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric label="Selected Plan" value={selectedPlan} />
                <MiniMetric label="Cost" value={cost} />
                <MiniMetric label="ETA" value={eta} />
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Decision reason</div>
                <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                    {reason}
                </p>
            </div>

            <div className="mt-4 text-xs uppercase tracking-[0.08em] text-[var(--text-soft)]">
                {time}
            </div>
        </div>
    );
}

function MiniMetric({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-soft)]">
                {label}
            </div>
            <div className="mt-1 text-sm font-semibold">{value}</div>
        </div>
    );
}

function SidePanel({ title, content }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="text-xl font-semibold">{title}</div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{content}</p>
        </div>
    );
}