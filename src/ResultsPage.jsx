import React from "react";
import { Link } from "react-router-dom";
import {
    BadgeDollarSign,
    Clock3,
    Fuel,
    ShieldCheck,
    CheckCircle2,
    Route,
    FileText,
} from "lucide-react";
import AppShell from "./AppShell";

export default function ResultsPage() {
    return (
        <AppShell
            title="Optimization Results"
            subtitle="Compare ranked plans and review recommendation logic."
            actions={
                <>
                    <Link
                        to="/optimize"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8"
                    >
                        Back to Optimize
                    </Link>
                    <Link
                        to="/dashboard"
                        className="rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                        Dashboard
                    </Link>
                </>
            }
        >
            <section className="grid gap-6 lg:grid-cols-[1fr,360px]">
                <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.30)] backdrop-blur-md sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                                YYZ → YVR
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                                B38M • Passenger • Payload 12,000 kg • Headwind 10 kts
                            </p>
                        </div>

                        <div className="rounded-full border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] px-4 py-2 text-sm font-bold text-[#a8e7ff]">
                            3 Ranked Plans
                        </div>
                    </div>

                    <div className="space-y-4">
                        <ResultCard
                            title="Economical"
                            badge="Lowest Cost"
                            metrics={[
                                { icon: <BadgeDollarSign className="h-4 w-4" />, label: "Cost", value: "$18,420" },
                                { icon: <Clock3 className="h-4 w-4" />, label: "ETA", value: "4h 58m" },
                                { icon: <Fuel className="h-4 w-4" />, label: "Fuel", value: "12,900 kg" },
                                { icon: <ShieldCheck className="h-4 w-4" />, label: "Risk", value: "Low" },
                            ]}
                            reasons={[
                                "Lowest overall projected operating cost",
                                "Suitable when time pressure is moderate",
                                "Conservative fuel and route assumptions",
                            ]}
                        />

                        <ResultCard
                            title="Balanced"
                            badge="Best Overall"
                            recommended
                            metrics={[
                                { icon: <BadgeDollarSign className="h-4 w-4" />, label: "Cost", value: "$19,210" },
                                { icon: <Clock3 className="h-4 w-4" />, label: "ETA", value: "4h 44m" },
                                { icon: <Fuel className="h-4 w-4" />, label: "Fuel", value: "13,250 kg" },
                                { icon: <ShieldCheck className="h-4 w-4" />, label: "Risk", value: "Low" },
                            ]}
                            reasons={[
                                "Best time-cost trade-off across all scenarios",
                                "Improved ETA without major cost escalation",
                                "Most stable recommendation under current assumptions",
                            ]}
                        />

                        <ResultCard
                            title="Fastest"
                            badge="Shortest ETA"
                            metrics={[
                                { icon: <BadgeDollarSign className="h-4 w-4" />, label: "Cost", value: "$20,340" },
                                { icon: <Clock3 className="h-4 w-4" />, label: "ETA", value: "4h 28m" },
                                { icon: <Fuel className="h-4 w-4" />, label: "Fuel", value: "13,980 kg" },
                                { icon: <ShieldCheck className="h-4 w-4" />, label: "Risk", value: "Medium" },
                            ]}
                            reasons={[
                                "Fastest arrival among compared plans",
                                "Higher fuel burn and higher projected cost",
                                "Useful when schedule pressure dominates cost control",
                            ]}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <SidePanel
                        icon={<CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />}
                        title="Recommended Decision"
                        content="Balanced is ranked first because it preserves a low risk profile while reducing ETA compared with Economical, without the higher cost jump seen in Fastest."
                    />

                    <SidePanel
                        icon={<Route className="h-5 w-5 text-[var(--primary)]" />}
                        title="Input Summary"
                        content="Origin YYZ, destination YVR, aircraft B38M, passenger operation, payload 12,000 kg, fuel 1.10 CAD/kg, visibility 12 km."
                    />

                    <SidePanel
                        icon={<FileText className="h-5 w-5 text-[var(--primary)]" />}
                        title="Next Action"
                        content="Later, this page can send the selected plan into the audit trail and save the full justification snapshot for manager review."
                    />

                    <button className="w-full rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-6 py-3 font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px]">
                        Select Balanced Plan
                    </button>

                    <Link
                        to="/audit"
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8"
                    >
                        Save to Audit Trail
                    </Link>
                </div>
            </section>
        </AppShell>
    );
}

function ResultCard({ title, badge, metrics, reasons, recommended = false }) {
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
                    <div className="text-xl font-bold">{title}</div>
                    <div className="mt-1 text-sm text-[var(--text-soft)]">{badge}</div>
                </div>

                {recommended && (
                    <div className="rounded-full border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] px-3 py-1 text-xs font-bold text-[#a8e7ff]">
                        Recommended
                    </div>
                )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                        <div className="mb-2 flex items-center gap-2 text-[var(--text-soft)]">
                            {item.icon}
                            <span className="text-xs uppercase tracking-[0.08em]">{item.label}</span>
                        </div>
                        <div className="text-sm font-semibold">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm font-semibold">Why this plan</div>
                <ul className="space-y-2 text-sm text-[var(--text-soft)]">
                    {reasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function SidePanel({ icon, title, content }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(96,165,250,0.08))]">
                    {icon}
                </div>
                <div className="text-lg font-semibold">{title}</div>
            </div>
            <p className="text-sm leading-7 text-[var(--text-soft)]">{content}</p>
        </div>
    );
}