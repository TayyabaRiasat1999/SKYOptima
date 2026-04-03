import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    BadgeDollarSign,
    Clock3,
    Fuel,
    ShieldCheck,
    CheckCircle2,
    Route,
    FileText,
    Save,
} from "lucide-react";
import AppShell from "./AppShell";
import { postSavePlan } from "./api";

// ── display helpers ──────────────────────────────────────────────────────────

function fmtCost(val) {
    if (val == null) return "—";
    return "$" + Number(val).toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

function fmtETA(minutes) {
    if (minutes == null) return "—";
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
}

function fmtFuel(kg) {
    if (kg == null) return "—";
    return Number(kg).toLocaleString("en-CA", { maximumFractionDigits: 0 }) + " kg";
}

function fmtNum(val, decimals = 0) {
    if (val == null) return "—";
    return Number(val).toLocaleString("en-CA", { maximumFractionDigits: decimals });
}

// ── card config (render in this order) — same for both modes ─────────────────

const PLAN_CONFIGS = [
    { key: "economical", title: "Economical", badge: "Lowest Cost",   recommended: false },
    { key: "balanced",   title: "Balanced",   badge: "Best Overall",  recommended: true  },
    { key: "fastest",    title: "Fastest",    badge: "Shortest ETA",  recommended: false },
];

// ── page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
    const { state } = useLocation();

    // Graceful fallback if navigated directly without data
    if (!state?.response) {
        return (
            <AppShell
                title="Optimization Results"
                subtitle="No results loaded yet."
                actions={
                    <Link
                        to="/optimize"
                        className="rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                        Go to Optimize
                    </Link>
                }
            >
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center text-[var(--text-soft)]">
                    <p className="text-lg">No optimization results found.</p>
                    <Link
                        to="/optimize"
                        className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[var(--text)] transition hover:border-white/20"
                    >
                        Run an Optimization
                    </Link>
                </div>
            </AppShell>
        );
    }

    const { mode = "dispatch_agent", request, response } = state;
    const isAirline = mode === "domestic_airline";

    const plans = response.top_3_plans ?? {};

    // resolved_context is present for airline mode; empty object for dispatch
    const rc  = response.resolved_context ?? {};

    // response.input is the resolved inner OptimizeRequest for both modes
    const inp = response.input ?? request;

    // Derive display values — rc fields take precedence for airline mode
    const origin      = rc.origin       ?? inp?.origin       ?? "?";
    const dest        = rc.dest         ?? inp?.dest         ?? "?";
    const aircraftIcao = rc.aircraft_icao ?? inp?.aircraft_icao ?? "—";
    const operation   = rc.operation    ?? inp?.operation    ?? "—";
    const payloadKg   = rc.payload_kg   ?? inp?.payload_kg;

    const routeLabel = `${origin} → ${dest}`;

    const subLabel = isAirline
        ? [rc.airline_name, aircraftIcao, operation,
           payloadKg != null ? `Payload ${fmtNum(payloadKg)} kg` : null]
            .filter(Boolean).join(" • ")
        : [aircraftIcao, operation,
           payloadKg != null ? `Payload ${fmtNum(payloadKg)} kg` : null,
           inp?.headwind_kts != null ? `Headwind ${fmtNum(inp.headwind_kts)} kts` : null]
            .filter(Boolean).join(" • ");

    const balancedPlan = plans.balanced;

    // Mode badge shown in the header
    const modeBadge = isAirline ? "Airline Mode" : "Dispatch Agent";

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

                {/* ── main cards column ── */}
                <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.30)] backdrop-blur-md sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                                {routeLabel}
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                                {subLabel}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="rounded-full border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] px-3 py-1.5 text-xs font-bold text-[#a8e7ff]">
                                {modeBadge}
                            </div>
                            <div className="rounded-full border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] px-4 py-2 text-sm font-bold text-[#a8e7ff]">
                                3 Ranked Plans
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {PLAN_CONFIGS.map(({ key, title, badge, recommended }) => {
                            const plan = plans[key];
                            if (!plan) return null;
                            return (
                                <ResultCard
                                    key={key}
                                    planKey={key}
                                    title={title}
                                    badge={badge}
                                    recommended={recommended}
                                    plan={plan}
                                    auditId={response.audit_id}
                                    mode={mode}
                                    request={request}
                                    response={response}
                                    rc={rc}
                                    inp={inp}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* ── side panel column ── */}
                <div className="space-y-6">
                    <SidePanel
                        icon={<CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />}
                        title="Recommended Decision"
                        content={
                            balancedPlan
                                ? `Balanced is ranked first. Speed mode: ${balancedPlan.speed_mode ?? "—"}, ` +
                                  `reserve: ${balancedPlan.reserve_policy ?? "—"}, ` +
                                  `cost: ${fmtCost(balancedPlan.final_total_cost)}, ` +
                                  `ETA: ${fmtETA(balancedPlan.pred_eta_minutes)}.`
                                : "Balanced plan data unavailable."
                        }
                    />

                    {/* Mode-specific summary panel */}
                    {isAirline ? (
                        <SidePanel
                            icon={<Route className="h-5 w-5 text-[var(--primary)]" />}
                            title="Airline Context"
                            content={
                                [
                                    rc.airline_name && `Airline: ${rc.airline_name} (${rc.airline_id})`,
                                    rc.route_id     && `Route: ${rc.route_id} — ${rc.origin} → ${rc.dest}`,
                                    rc.aircraft_icao && `Aircraft: ${rc.aircraft_icao} (from ${rc.aircraft_icao_source ?? "—"})`,
                                    rc.operation    && `Operation: ${rc.operation} (from ${rc.operation_source ?? "—"})`,
                                    rc.payload_kg != null && `Payload: ${fmtNum(rc.payload_kg)} kg (from ${rc.payload_kg_source ?? "—"})`,
                                ]
                                    .filter(Boolean)
                                    .join(". ") || "No context available."
                            }
                        />
                    ) : (
                        <SidePanel
                            icon={<Route className="h-5 w-5 text-[var(--primary)]" />}
                            title="Input Summary"
                            content={
                                `Origin ${origin}, destination ${dest}, ` +
                                `aircraft ${aircraftIcao}, ${operation} operation, ` +
                                `payload ${fmtNum(payloadKg)} kg, ` +
                                `fuel ${inp?.fuel_price_cad_per_kg ?? "—"} CAD/kg, ` +
                                `visibility ${inp?.visibility_km ?? "—"} km.`
                            }
                        />
                    )}

                    <SidePanel
                        icon={<FileText className="h-5 w-5 text-[var(--primary)]" />}
                        title="Audit ID"
                        content={response.audit_id ?? "Not returned by backend."}
                    />
                </div>

            </section>
        </AppShell>
    );
}

// ── ResultCard ───────────────────────────────────────────────────────────────

function ResultCard({ planKey, title, badge, recommended, plan, auditId, mode, request, response, rc, inp }) {
    const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
    const [saveError, setSaveError] = useState("");

    const handleSave = async () => {
        setSaveState("saving");
        setSaveError("");

        const payload = {
            audit_id:              auditId,
            mode:                  mode,                          // "dispatch_agent" | "domestic_airline"
            plan_type:             planKey,
            origin:                rc.origin       ?? inp?.origin,
            dest:                  rc.dest         ?? inp?.dest,
            aircraft_icao:         rc.aircraft_icao ?? inp?.aircraft_icao,
            operation:             rc.operation    ?? inp?.operation,
            payload_kg:            rc.payload_kg   ?? inp?.payload_kg,
            request_json:          request,                       // original payload sent to backend
            resolved_context_json: response.resolved_context ?? {},
            plan_json:             plan,
            full_response_json:    response,
        };

        try {
            await postSavePlan(payload);
            setSaveState("saved");
        } catch (err) {
            setSaveError(err.message || "Save failed.");
            setSaveState("error");
        }
    };

    const cb = plan.cost_breakdown ?? {};

    const metrics = [
        {
            icon:  <BadgeDollarSign className="h-4 w-4" />,
            label: "Cost",
            value: fmtCost(plan.final_total_cost),
        },
        {
            icon:  <Clock3 className="h-4 w-4" />,
            label: "ETA",
            value: fmtETA(plan.pred_eta_minutes),
        },
        {
            icon:  <Fuel className="h-4 w-4" />,
            label: "Fuel Cost",
            value: cb.fuel != null ? fmtCost(cb.fuel) : "—",
        },
        {
            icon:  <ShieldCheck className="h-4 w-4" />,
            label: "Speed Mode",
            value: plan.speed_mode ?? "—",
        },
    ];

    const details = [
        plan.distance_km        != null && `Distance: ${fmtNum(plan.distance_km, 0)} km`,
        plan.reserve_policy                && `Reserve: ${plan.reserve_policy}`,
        plan.route_factor       != null && `Route factor: ${plan.route_factor}`,
        plan.ml_pred_total_cost != null && `ML estimate: ${fmtCost(plan.ml_pred_total_cost)}`,
    ].filter(Boolean);

    return (
        <div
            className={
                recommended
                    ? "rounded-[28px] border border-[rgba(56,189,248,0.24)] bg-[linear-gradient(180deg,rgba(56,189,248,0.12),rgba(8,18,32,0.82))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
                    : "rounded-[28px] border border-white/10 bg-[rgba(8,18,32,0.76)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
            }
        >
            {/* header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-xl font-bold">{title}</div>
                    <div className="mt-1 text-sm text-[var(--text-soft)]">{badge}</div>
                </div>

                <div className="flex items-center gap-2">
                    {recommended && (
                        <div className="rounded-full border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] px-3 py-1 text-xs font-bold text-[#a8e7ff]">
                            Recommended
                        </div>
                    )}

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={saveState === "saving" || saveState === "saved"}
                        className={
                            saveState === "saved"
                                ? "inline-flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400"
                                : saveState === "error"
                                ? "inline-flex items-center gap-1.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400"
                                : "inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:border-white/20 hover:bg-white/8 disabled:opacity-60"
                        }
                    >
                        <Save className="h-3.5 w-3.5" />
                        {saveState === "saving" ? "Saving…"
                            : saveState === "saved"  ? "Saved"
                            : saveState === "error"  ? "Retry"
                            : "Save Plan"}
                    </button>
                </div>
            </div>

            {saveState === "error" && saveError && (
                <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {saveError}
                </div>
            )}

            {/* metric tiles */}
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

            {/* detail row */}
            {details.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 text-sm font-semibold">Plan details</div>
                    <ul className="space-y-1.5 text-sm text-[var(--text-soft)]">
                        {details.map((d) => (
                            <li key={d}>• {d}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ── SidePanel ────────────────────────────────────────────────────────────────

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
