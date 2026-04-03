import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Database } from "lucide-react";
import AppShell from "./AppShell";
import { getSavedPlans } from "./api";

// ── display helpers ───────────────────────────────────────────────────────────

function fmtDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);          // Supabase includes offset (+00:00) — parse directly
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleString("en-CA", {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: false,
        });
    } catch {
        return "—";
    }
}

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

function fmtPayload(kg) {
    if (kg == null) return "—";
    return Number(kg).toLocaleString("en-CA", { maximumFractionDigits: 0 }) + " kg";
}

function fmtAuditId(id) {
    if (!id) return "—";
    return id.slice(0, 8) + "…";
}

function capitalize(str) {
    if (!str) return "—";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── filter option lists ───────────────────────────────────────────────────────

const MODE_OPTIONS = [
    { label: "All Modes",        value: ""                  },
    { label: "Dispatch Agent",   value: "dispatch_agent"    },
    { label: "Domestic Airline", value: "domestic_airline"  },
];

const PLAN_TYPE_OPTIONS = [
    { label: "All Plans",   value: ""           },
    { label: "Economical",  value: "economical" },
    { label: "Balanced",    value: "balanced"   },
    { label: "Fastest",     value: "fastest"    },
];

const LIMIT_OPTIONS = [
    { label: "20 records",  value: "20"  },
    { label: "50 records",  value: "50"  },
    { label: "100 records", value: "100" },
];

// ── plan-type badge styles ────────────────────────────────────────────────────

const PLAN_BADGE = {
    economical: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    balanced:   "border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] text-[#a8e7ff]",
    fastest:    "border-amber-500/20 bg-amber-500/10 text-amber-400",
};

// ── page ──────────────────────────────────────────────────────────────────────

export default function SavedPlansPage() {
    const [items, setItems]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    const [modeFilter, setMode]   = useState("");
    const [typeFilter, setType]   = useState("");
    const [limit, setLimit]       = useState("20");
    const [tick, setTick]         = useState(0);   // increment to force a re-fetch

    // Re-fetch whenever any filter or the refresh tick changes
    useEffect(() => {
        setLoading(true);
        setError("");
        getSavedPlans({
            mode:      modeFilter || undefined,
            plan_type: typeFilter  || undefined,
            limit:     Number(limit),
        })
            .then((data) => setItems(data.items ?? []))
            .catch((err) => setError(err.message || "Failed to load saved plans."))
            .finally(() => setLoading(false));
    }, [modeFilter, typeFilter, limit, tick]);

    const hasActiveFilter = modeFilter !== "" || typeFilter !== "";

    return (
        <AppShell
            title="Saved Plans"
            subtitle="History of plans saved from optimization sessions."
            actions={
                <button
                    onClick={() => setTick((t) => t + 1)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            }
        >
            {/* ── filter bar ── */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <FilterSelect
                    label="Mode"
                    options={MODE_OPTIONS}
                    value={modeFilter}
                    onChange={(e) => setMode(e.target.value)}
                />
                <FilterSelect
                    label="Plan"
                    options={PLAN_TYPE_OPTIONS}
                    value={typeFilter}
                    onChange={(e) => setType(e.target.value)}
                />
                <FilterSelect
                    label="Limit"
                    options={LIMIT_OPTIONS}
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                />
                {hasActiveFilter && (
                    <button
                        onClick={() => { setMode(""); setType(""); }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-soft)] transition hover:border-white/20 hover:text-[var(--text)]"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* ── error ── */}
            {error && (
                <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* ── loading ── */}
            {loading && (
                <div className="flex items-center justify-center py-24 text-[var(--text-soft)]">
                    <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                    Loading saved plans…
                </div>
            )}

            {/* ── empty state ── */}
            {!loading && !error && items.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center text-[var(--text-soft)]">
                    <Database className="h-10 w-10 opacity-25" />
                    <p className="text-lg">No saved plans found.</p>
                    {hasActiveFilter && (
                        <p className="text-sm">Try adjusting or clearing the filters above.</p>
                    )}
                    <Link
                        to="/optimize"
                        className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[var(--text)] transition hover:border-white/20"
                    >
                        Run an Optimization
                    </Link>
                </div>
            )}

            {/* ── results table ── */}
            {!loading && items.length > 0 && (
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">

                    {/* table header row */}
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                        <span className="text-sm font-semibold">
                            {items.length} plan{items.length !== 1 ? "s" : ""}
                        </span>
                        {hasActiveFilter && (
                            <span className="text-xs text-[var(--text-soft)]">
                                {[modeFilter && `mode: ${modeFilter}`, typeFilter && `plan: ${typeFilter}`]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.04)] text-xs font-bold uppercase tracking-[0.10em] text-[var(--text-soft)]">
                                    <th className="p-4 text-left">Date</th>
                                    <th className="p-4 text-left">Route</th>
                                    <th className="p-4 text-left">Aircraft</th>
                                    <th className="p-4 text-left">Operation</th>
                                    <th className="p-4 text-left">Payload</th>
                                    <th className="p-4 text-left">Mode</th>
                                    <th className="p-4 text-left">Plan</th>
                                    <th className="p-4 text-left">Cost</th>
                                    <th className="p-4 text-left">ETA</th>
                                    <th className="p-4 text-left">Audit ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <PlanRow key={item.id ?? item.audit_id ?? idx} item={item} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppShell>
    );
}

// ── PlanRow ───────────────────────────────────────────────────────────────────

function PlanRow({ item }) {
    const plan = item.plan_json ?? {};

    const modeBadge = item.mode === "domestic_airline"
        ? { cls: "border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.12)] text-[#a8e7ff]", label: "Airline" }
        : { cls: "border-white/10 bg-white/5 text-[var(--text-soft)]",                       label: "Dispatch" };

    const planBadgeCls = PLAN_BADGE[item.plan_type] ?? "border-white/10 bg-white/5 text-[var(--text-soft)]";

    return (
        <tr className="border-b border-white/10 transition hover:bg-white/5 last:border-b-0">
            <td className="p-4 text-xs text-[var(--text-soft)] whitespace-nowrap">
                {fmtDate(item.created_at)}
            </td>
            <td className="p-4 font-medium whitespace-nowrap">
                {item.origin ?? "—"} → {item.dest ?? "—"}
            </td>
            <td className="p-4 whitespace-nowrap">
                {item.aircraft_icao ?? "—"}
            </td>
            <td className="p-4 text-[var(--text-soft)]">
                {capitalize(item.operation)}
            </td>
            <td className="p-4 text-[var(--text-soft)] whitespace-nowrap">
                {fmtPayload(item.payload_kg)}
            </td>
            <td className="p-4">
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${modeBadge.cls}`}>
                    {modeBadge.label}
                </span>
            </td>
            <td className="p-4">
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${planBadgeCls}`}>
                    {capitalize(item.plan_type)}
                </span>
            </td>
            <td className="p-4 whitespace-nowrap">
                {fmtCost(plan.final_total_cost)}
            </td>
            <td className="p-4 whitespace-nowrap">
                {fmtETA(plan.pred_eta_minutes)}
            </td>
            <td className="p-4 font-mono text-xs text-[var(--text-soft)]" title={item.audit_id}>
                {fmtAuditId(item.audit_id)}
            </td>
        </tr>
    );
}

// ── FilterSelect ──────────────────────────────────────────────────────────────

function FilterSelect({ label, options, value, onChange }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-2">
            <span className="text-xs font-medium text-[var(--text-soft)]">{label}:</span>
            <select
                value={value}
                onChange={onChange}
                className="bg-transparent text-sm text-[var(--text)] outline-none"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[var(--bg)] text-[var(--text)]">
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
