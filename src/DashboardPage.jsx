import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Clock3,
    BarChart3,
    ArrowRight,
} from "lucide-react";
import AppShell from "./AppShell";
import { getAudits, getStats } from "./api";
import PrimaryButton from "./components/ui/PrimaryButton";
import GlassCard from "./components/ui/GlassCard";

export default function DashboardPage() {
    const [stats, setStats]           = useState(null);
    const [recentRuns, setRecentRuns] = useState([]);

    useEffect(() => {
        getStats().then(setStats).catch(() => {});
        getAudits(5).then((d) => setRecentRuns(d.items || [])).catch(() => {});
    }, []);

    return (
        <AppShell
            title="Dashboard"
            subtitle="Overview of planning activity, saved scenarios, and audit-ready actions."
        >
            <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Scenarios Run"
                    value={stats ? (stats.audit_records_total ?? "—") : "—"}
                    subtitle="All optimize runs"
                    icon={<LayoutDashboard className="h-5 w-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Saved Plans"
                    value={stats ? (stats.saved_plans_total ?? "—") : "—"}
                    subtitle="Ready for review"
                    icon={<FileText className="h-5 w-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Dispatch Runs"
                    value={stats ? (stats.dispatch_runs ?? "—") : "—"}
                    subtitle="Dispatch agent mode"
                    icon={<Clock3 className="h-5 w-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Airline Runs"
                    value={stats ? (stats.airline_runs ?? "—") : "—"}
                    subtitle="Domestic airline mode"
                    icon={<BarChart3 className="h-5 w-5 text-[var(--primary)]" />}
                />
            </section>

            <section className="mb-8 grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                    <div className="mb-5">
                        <div className="text-2xl font-bold">Quick Actions</div>
                        <div className="mt-1 text-sm text-[var(--text-soft)]">
                            Jump into the core product workflows
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <ActionCard
                            title="New Optimization"
                            description="Start a new route planning run with operational inputs."
                            button="Start"
                            to="/optimize"
                        />
                        <ActionCard
                            title="View Results"
                            description="Review previous plan outputs and trade-off summaries."
                            button="Open"
                            to="/results"
                        />
                        <ActionCard
                            title="Audit Trail"
                            description="Inspect saved decisions, justifications, and route history."
                            button="View"
                            to="/audit"
                        />
                        <ActionCard
                            title="Scenario Library"
                            description="Access reusable route assumptions and saved scenarios."
                            button="Manage"
                            to="/dashboard"
                        />
                    </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                    <div className="text-2xl font-bold">Recommended Next Step</div>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                        Run a fresh optimization for a medium-haul passenger route and compare the
                        Balanced plan against the Economical option for time-cost trade-offs.
                    </p>

                    <div className="mt-6 rounded-2xl border border-[rgba(56,189,248,0.20)] bg-[rgba(56,189,248,0.08)] p-4">
                        <div className="text-sm font-semibold text-[#a8e7ff]">Suggested route</div>
                        <div className="mt-2 text-lg font-bold">YYZ → YVR</div>
                        <div className="mt-1 text-sm text-[var(--text-soft)]">
                            B38M · Passenger · Compare balanced vs economical
                        </div>
                    </div>

                    <Link
                        to="/optimize"
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-5 py-3 font-semibold text-slate-950"
                    >
                        Run Suggested Scenario <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.3fr,0.7fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                    <div className="mb-5">
                        <div className="text-2xl font-bold">Recent Optimization Runs</div>
                        <div className="mt-1 text-sm text-[var(--text-soft)]">
                            Most recent scenarios and selected outcomes
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[24px] border border-white/10">
                        <div className="grid grid-cols-5 border-b border-white/10 bg-[rgba(255,255,255,0.04)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-soft)]">
                            <div className="p-4">Route</div>
                            <div className="p-4">Aircraft</div>
                            <div className="p-4">Mode</div>
                            <div className="p-4">ETA</div>
                            <div className="p-4">Cost</div>
                        </div>

                        {recentRuns.length === 0 ? (
                            <div className="p-6 text-center text-sm text-[var(--text-soft)]">No runs yet.</div>
                        ) : (
                            recentRuns.map((row) => (
                                <RunRow
                                    key={row.audit_id}
                                    route={`${row.origin ?? "?"} → ${row.dest ?? "?"}`}
                                    aircraft={row.aircraft_icao ?? "—"}
                                    plan={row.mode === "domestic_airline" ? "Airline" : "Dispatch"}
                                    eta={fmtETA(row.response_json?.top_3_plans?.balanced?.pred_eta_minutes)}
                                    cost={fmtCost(row.response_json?.top_3_plans?.balanced?.final_total_cost)}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                    <div className="text-2xl font-bold">Recent Activity</div>
                    <div className="mt-4 space-y-4">
                        {recentRuns.length === 0 ? (
                            <div className="text-sm text-[var(--text-soft)]">No recent activity.</div>
                        ) : (
                            recentRuns.slice(0, 3).map((row) => (
                                <ActivityItem
                                    key={row.audit_id}
                                    title={`${row.origin ?? "?"} → ${row.dest ?? "?"} · ${row.aircraft_icao ?? "—"}`}
                                    subtitle={`${row.mode === "domestic_airline" ? "Airline mode" : "Dispatch agent"} · ${timeAgo(row.created_at)}`}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </AppShell>
    );
}

function fmtETA(minutes) {
    if (minutes == null) return "—";
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
}

function fmtCost(val) {
    if (val == null) return "—";
    return "$" + Number(val).toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

function timeAgo(isoStr) {
    if (!isoStr) return "—";
    const mins = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
    if (mins < 1)  return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({ title, value, subtitle, icon }) {
    return (
        <GlassCard className="p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(96,165,250,0.08))]">
                {icon}
            </div>
            <div className="text-sm text-[var(--text-soft)]">{title}</div>
            <div className="mt-1 text-3xl font-bold">{value}</div>
            <div className="mt-1 text-sm text-[var(--text-soft)]">{subtitle}</div>
        </GlassCard>
    );
}

function ActionCard({ title, description, button, to = "#" }) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-[rgba(8,18,32,0.72)] p-5">
            <div className="text-lg font-semibold">{title}</div>
            <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{description}</p>
            <PrimaryButton to={to} className="mt-4 px-4 py-2 text-sm">
                {button}
            </PrimaryButton>
        </div>
    );
}

function RunRow({ route, aircraft, plan, eta, cost }) {
    return (
        <div className="grid grid-cols-5 border-b border-white/10 bg-white/5 text-sm">
            <div className="p-4 font-medium">{route}</div>
            <div className="p-4">{aircraft}</div>
            <div className="p-4">{plan}</div>
            <div className="p-4">{eta}</div>
            <div className="p-4">{cost}</div>
        </div>
    );
}

function ActivityItem({ title, subtitle }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] p-4">
            <div className="font-medium">{title}</div>
            <div className="mt-1 text-sm text-[var(--text-soft)]">{subtitle}</div>
        </div>
    );
}