import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    MapPin,
    PlaneTakeoff,
    Briefcase,
    Fuel,
    Wind,
    CloudRain,
    Eye,
    ArrowRight,
} from "lucide-react";
import AppShell from "./AppShell";
import FlightLoader from "./components/ui/FlightLoader";
import {
    postOptimize,
    postOptimizeAirline,
    getAirlineProfiles,
    getAirlineRoutes,
} from "./api";

// ── dispatch-agent suggestion lists ──────────────────────────────────────────

const AIRPORT_LIST  = ["YYZ", "YVR", "YUL", "YYC", "YOW", "YEG", "YHZ"];
const AIRCRAFT_LIST = ["B38M", "A320", "DH8D", "AT72", "B763", "C208"];

// ── select option constants ───────────────────────────────────────────────────

const OPERATION_OPTIONS = [
    { label: "Passenger", value: "Passenger" },
    { label: "Cargo",     value: "Cargo"     },
    { label: "Private",   value: "Private"   },
];

const PRECIP_OPTIONS = [
    { label: "0 - No",  value: "0" },
    { label: "1 - Yes", value: "1" },
];

const PRECIP_OVERRIDE_OPTIONS = [
    { label: "— use default —", value: ""  },
    { label: "0 - No",          value: "0" },
    { label: "1 - Yes",         value: "1" },
];

// ── initial form states ───────────────────────────────────────────────────────

const INITIAL_DISPATCH_FORM = {
    origin:                 "",
    dest:                   "",
    aircraft_icao:          "",
    operation:              "Passenger",
    payload_kg:             "",
    fuel_price_cad_per_kg:  "",
    headwind_kts:           "",
    precip_flag:            "0",
    visibility_km:          "",
};

const INITIAL_AIRLINE_FORM = {
    airline_id:            "",
    route_id:              "",
    // optional overrides — leave blank to use airline defaults
    aircraft_icao:         "",
    payload_kg:            "",
    fuel_price_cad_per_kg: "",
    headwind_kts:          "",
    precip_flag:           "",
    visibility_km:         "",
};

// ── validation helpers ────────────────────────────────────────────────────────

function validateDispatch(form) {
    const errors = [];
    const origin = form.origin.trim().toUpperCase();
    const dest   = form.dest.trim().toUpperCase();

    if (!origin)                          errors.push("Origin is required.");
    if (!dest)                            errors.push("Destination is required.");
    if (origin && dest && origin === dest) errors.push("Origin and destination cannot be the same.");
    if (!form.aircraft_icao.trim())       errors.push("Aircraft ICAO is required.");
    if (!form.operation)                  errors.push("Operation type is required.");

    if (!form.payload_kg || Number(form.payload_kg) <= 0)
        errors.push("Payload must be a number greater than 0.");
    if (!form.fuel_price_cad_per_kg || Number(form.fuel_price_cad_per_kg) <= 0)
        errors.push("Fuel price must be a number greater than 0.");
    if (form.headwind_kts === "" || isNaN(Number(form.headwind_kts)))
        errors.push("Headwind must be a valid number (0 or more).");
    if (!form.visibility_km || Number(form.visibility_km) <= 0)
        errors.push("Visibility must be a number greater than 0.");

    return errors;
}

function validateAirline(airlineForm) {
    const errors = [];

    if (!airlineForm.airline_id) errors.push("Please select an airline.");
    if (!airlineForm.route_id)   errors.push("Please select a route.");

    // Optional overrides — only validate when the field is non-empty
    if (airlineForm.payload_kg !== "" && Number(airlineForm.payload_kg) <= 0)
        errors.push("Payload override must be greater than 0.");
    if (airlineForm.fuel_price_cad_per_kg !== "" && Number(airlineForm.fuel_price_cad_per_kg) <= 0)
        errors.push("Fuel price override must be greater than 0.");
    if (airlineForm.visibility_km !== "" && Number(airlineForm.visibility_km) <= 0)
        errors.push("Visibility override must be greater than 0.");
    if (airlineForm.headwind_kts !== "" && isNaN(Number(airlineForm.headwind_kts)))
        errors.push("Headwind override must be a valid number.");

    return errors;
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function OptimizePage() {
    const [mode, setMode]             = useState("dispatch_agent");

    // dispatch-agent form
    const [form, setForm]             = useState(INITIAL_DISPATCH_FORM);

    // airline form + reference data
    const [airlineForm, setAirForm]   = useState(INITIAL_AIRLINE_FORM);
    const [profiles, setProfiles]     = useState([]);
    const [airRoutes, setAirRoutes]   = useState([]);
    const [refLoading, setRefLoading] = useState(false);
    const [refError, setRefError]     = useState("");

    // shared
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState("");         // backend error
    const [validationErrors, setValErrors]  = useState([]);        // pre-submit validation
    const navigate                          = useNavigate();

    // Clear validation errors the moment the user edits any field
    const set    = (key) => (e) => {
        setForm((p) => ({ ...p, [key]: e.target.value }));
        if (validationErrors.length > 0) setValErrors([]);
    };
    const setAir = (key) => (e) => {
        setAirForm((p) => ({ ...p, [key]: e.target.value }));
        if (validationErrors.length > 0) setValErrors([]);
    };

    // Load airline reference data on first switch to airline mode
    useEffect(() => {
        if (mode !== "domestic_airline" || profiles.length > 0) return;
        setRefLoading(true);
        setRefError("");
        Promise.all([getAirlineProfiles(), getAirlineRoutes()])
            .then(([pd, rd]) => {
                setProfiles(pd.items ?? []);
                setAirRoutes(rd.items ?? []);
            })
            .catch((err) => setRefError(err.message || "Failed to load airline data."))
            .finally(() => setRefLoading(false));
    }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

    const switchMode = (next) => {
        setMode(next);
        setError("");
        setValErrors([]);
    };

    const handleRunOptimization = async () => {
        setError("");

        // Run validation before touching loading state
        const errs = mode === "dispatch_agent"
            ? validateDispatch(form)
            : validateAirline(airlineForm);

        if (errs.length > 0) {
            setValErrors(errs);
            return;
        }

        setValErrors([]);
        setLoading(true);

        try {
            if (mode === "dispatch_agent") {
                const payload = {
                    origin:                form.origin.trim().toUpperCase(),
                    dest:                  form.dest.trim().toUpperCase(),
                    aircraft_icao:         form.aircraft_icao.trim().toUpperCase(),
                    operation:             form.operation,
                    payload_kg:            Number(form.payload_kg),
                    fuel_price_cad_per_kg: Number(form.fuel_price_cad_per_kg),
                    headwind_kts:          Number(form.headwind_kts),
                    precip_flag:           Number(form.precip_flag),
                    visibility_km:         Number(form.visibility_km),
                };
                const response = await postOptimize(payload);
                navigate("/results", { state: { mode: "dispatch_agent", request: payload, response } });

            } else {
                // Only include overrides that the user explicitly filled in
                const payload = {
                    airline_id: airlineForm.airline_id,
                    route_id:   airlineForm.route_id,
                    ...(airlineForm.aircraft_icao
                        ? { aircraft_icao: airlineForm.aircraft_icao.trim().toUpperCase() } : {}),
                    ...(airlineForm.payload_kg
                        ? { payload_kg: Number(airlineForm.payload_kg) } : {}),
                    ...(airlineForm.fuel_price_cad_per_kg
                        ? { fuel_price_cad_per_kg: Number(airlineForm.fuel_price_cad_per_kg) } : {}),
                    ...(airlineForm.headwind_kts
                        ? { headwind_kts: Number(airlineForm.headwind_kts) } : {}),
                    ...(airlineForm.precip_flag !== ""
                        ? { precip_flag: Number(airlineForm.precip_flag) } : {}),
                    ...(airlineForm.visibility_km
                        ? { visibility_km: Number(airlineForm.visibility_km) } : {}),
                };
                const response = await postOptimizeAirline(payload);
                navigate("/results", { state: { mode: "domestic_airline", request: payload, response } });
            }

        } catch (err) {
            setError(err.message || "Optimization failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <FlightLoader open={loading} text="Optimizing route plans..." />

            <AppShell
                title="Optimization Workspace"
                subtitle="Configure route inputs and prepare a new planning run."
                actions={
                    <>
                        <Link
                            to="/dashboard"
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8"
                        >
                            Back to Dashboard
                        </Link>
                        <Link
                            to="/"
                            className="rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-4 py-2 text-sm font-semibold text-slate-950"
                        >
                            Landing Page
                        </Link>
                    </>
                }
            >
                <div className="grid gap-6 lg:grid-cols-[1fr,380px]">

                    {/* ── main form card ── */}
                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.30)] backdrop-blur-md sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                                Create a new optimization scenario
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                                Choose a mode, enter inputs, and run a live optimization against
                                the planning backend.
                            </p>
                        </div>

                        {/* Mode tabs */}
                        <div className="mb-6 flex gap-1 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.50)] p-1">
                            {[
                                { value: "dispatch_agent",   label: "Dispatch Agent"   },
                                { value: "domestic_airline", label: "Domestic Airline" },
                            ].map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => switchMode(m.value)}
                                    className={
                                        mode === m.value
                                            ? "flex-1 rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] py-2.5 text-sm font-semibold text-slate-950 transition"
                                            : "flex-1 rounded-xl py-2.5 text-sm font-medium text-[var(--text-soft)] transition hover:text-[var(--text)]"
                                    }
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Dispatch Agent form ── */}
                        {mode === "dispatch_agent" && (
                            <div className="grid gap-5 md:grid-cols-2">
                                <ComboField
                                    label="Origin"
                                    placeholder="e.g. YYZ"
                                    icon={<MapPin className="h-4 w-4 text-[var(--text-soft)]" />}
                                    value={form.origin}
                                    onChange={set("origin")}
                                    suggestions={AIRPORT_LIST}
                                />
                                <ComboField
                                    label="Destination"
                                    placeholder="e.g. YVR"
                                    icon={<MapPin className="h-4 w-4 text-[var(--text-soft)]" />}
                                    value={form.dest}
                                    onChange={set("dest")}
                                    suggestions={AIRPORT_LIST}
                                />
                                <ComboField
                                    label="Aircraft ICAO"
                                    placeholder="e.g. B38M"
                                    icon={<PlaneTakeoff className="h-4 w-4 text-[var(--text-soft)]" />}
                                    value={form.aircraft_icao}
                                    onChange={set("aircraft_icao")}
                                    suggestions={AIRCRAFT_LIST}
                                />
                                <SelectField
                                    label="Operation Type"
                                    icon={<Briefcase className="h-4 w-4 text-[var(--text-soft)]" />}
                                    options={OPERATION_OPTIONS}
                                    value={form.operation}
                                    onChange={set("operation")}
                                />
                                <Field
                                    label="Payload (kg)"
                                    placeholder="e.g. 12000"
                                    icon={<Briefcase className="h-4 w-4 text-[var(--text-soft)]" />}
                                    type="number"
                                    value={form.payload_kg}
                                    onChange={set("payload_kg")}
                                />
                                <Field
                                    label="Fuel Price (CAD/kg)"
                                    placeholder="e.g. 1.10"
                                    icon={<Fuel className="h-4 w-4 text-[var(--text-soft)]" />}
                                    type="number"
                                    value={form.fuel_price_cad_per_kg}
                                    onChange={set("fuel_price_cad_per_kg")}
                                />
                                <Field
                                    label="Headwind (kts)"
                                    placeholder="e.g. 10"
                                    icon={<Wind className="h-4 w-4 text-[var(--text-soft)]" />}
                                    type="number"
                                    value={form.headwind_kts}
                                    onChange={set("headwind_kts")}
                                />
                                <SelectField
                                    label="Precipitation"
                                    icon={<CloudRain className="h-4 w-4 text-[var(--text-soft)]" />}
                                    options={PRECIP_OPTIONS}
                                    value={form.precip_flag}
                                    onChange={set("precip_flag")}
                                />
                                <Field
                                    label="Visibility (km)"
                                    placeholder="e.g. 12"
                                    icon={<Eye className="h-4 w-4 text-[var(--text-soft)]" />}
                                    type="number"
                                    value={form.visibility_km}
                                    onChange={set("visibility_km")}
                                />
                            </div>
                        )}

                        {/* ── Domestic Airline form ── */}
                        {mode === "domestic_airline" && (
                            <div className="space-y-5">
                                {refError && (
                                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {refError}
                                    </div>
                                )}

                                {/* Required: airline + route */}
                                <div className="grid gap-5 md:grid-cols-2">
                                    <SelectField
                                        label="Airline"
                                        icon={<PlaneTakeoff className="h-4 w-4 text-[var(--text-soft)]" />}
                                        options={[
                                            { label: refLoading ? "Loading…" : "— select airline —", value: "" },
                                            ...profiles.map((p) => ({
                                                label: `${p.airline_name} (${p.airline_id})`,
                                                value: p.airline_id,
                                            })),
                                        ]}
                                        value={airlineForm.airline_id}
                                        onChange={setAir("airline_id")}
                                    />
                                    <SelectField
                                        label="Route"
                                        icon={<MapPin className="h-4 w-4 text-[var(--text-soft)]" />}
                                        options={[
                                            { label: refLoading ? "Loading…" : "— select route —", value: "" },
                                            ...airRoutes.map((r) => ({
                                                label: `${r.route_id} — ${r.origin} → ${r.dest}`,
                                                value: r.route_id,
                                            })),
                                        ]}
                                        value={airlineForm.route_id}
                                        onChange={setAir("route_id")}
                                    />
                                </div>

                                {/* Optional overrides */}
                                <div className="rounded-2xl border border-white/8 bg-[rgba(8,18,32,0.40)] p-5">
                                    <div className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">
                                        Optional overrides — leave blank to use airline defaults
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Field
                                            label="Aircraft ICAO override"
                                            placeholder="leave blank for default"
                                            icon={<PlaneTakeoff className="h-4 w-4 text-[var(--text-soft)]" />}
                                            value={airlineForm.aircraft_icao}
                                            onChange={setAir("aircraft_icao")}
                                        />
                                        <Field
                                            label="Payload (kg) override"
                                            placeholder="leave blank for default"
                                            icon={<Briefcase className="h-4 w-4 text-[var(--text-soft)]" />}
                                            type="number"
                                            value={airlineForm.payload_kg}
                                            onChange={setAir("payload_kg")}
                                        />
                                        <Field
                                            label="Fuel Price (CAD/kg)"
                                            placeholder="leave blank for default"
                                            icon={<Fuel className="h-4 w-4 text-[var(--text-soft)]" />}
                                            type="number"
                                            value={airlineForm.fuel_price_cad_per_kg}
                                            onChange={setAir("fuel_price_cad_per_kg")}
                                        />
                                        <Field
                                            label="Headwind (kts)"
                                            placeholder="leave blank for default"
                                            icon={<Wind className="h-4 w-4 text-[var(--text-soft)]" />}
                                            type="number"
                                            value={airlineForm.headwind_kts}
                                            onChange={setAir("headwind_kts")}
                                        />
                                        <SelectField
                                            label="Precipitation"
                                            icon={<CloudRain className="h-4 w-4 text-[var(--text-soft)]" />}
                                            options={PRECIP_OVERRIDE_OPTIONS}
                                            value={airlineForm.precip_flag}
                                            onChange={setAir("precip_flag")}
                                        />
                                        <Field
                                            label="Visibility (km)"
                                            placeholder="leave blank for default"
                                            icon={<Eye className="h-4 w-4 text-[var(--text-soft)]" />}
                                            type="number"
                                            value={airlineForm.visibility_km}
                                            onChange={setAir("visibility_km")}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Validation error summary (amber — user input issues) */}
                        {validationErrors.length > 0 && (
                            <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                                <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-amber-400">
                                    Please fix the following
                                </div>
                                <ul className="space-y-1 text-sm text-amber-400">
                                    {validationErrors.map((msg, i) => (
                                        <li key={i}>• {msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Backend error (red — server-side issues) */}
                        {error && (
                            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={handleRunOptimization}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-6 py-3 font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Run Optimization <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── right side cards ── */}
                    <div className="space-y-6">
                        {mode === "dispatch_agent" ? (
                            <>
                                <SideCard
                                    title="Scenario Tips"
                                    content="Use realistic route, aircraft, and weather inputs so the comparison between Economical, Balanced, and Fastest feels meaningful during review."
                                />
                                <SideCard
                                    title="Live Backend"
                                    content="This form calls POST /optimize and returns the top 3 ranked plans with ETA, cost, fuel breakdown, and risk."
                                />
                                <div className="rounded-[28px] border border-[rgba(56,189,248,0.20)] bg-[rgba(56,189,248,0.08)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                                    <div className="text-sm font-semibold text-[#a8e7ff]">Quick Start</div>
                                    <div className="mt-3 text-2xl font-bold">YYZ → YVR</div>
                                    <div className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                                        B38M • Passenger • Payload 12,000 kg • Fuel 1.10 CAD/kg
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <SideCard
                                    title="Airline Mode"
                                    content="Select an airline and a route. Aircraft type, operation, and payload are resolved automatically from the airline profile and fleet data."
                                />
                                <SideCard
                                    title="Auto-Resolved"
                                    content="The backend calls POST /optimize-airline. Optional overrides let you adjust weather or cost inputs without changing the airline defaults."
                                />
                                <div className="rounded-[28px] border border-[rgba(56,189,248,0.20)] bg-[rgba(56,189,248,0.08)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                                    <div className="text-sm font-semibold text-[#a8e7ff]">Quick Start</div>
                                    <div className="mt-3 text-2xl font-bold">Airline + Route</div>
                                    <div className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                                        All defaults (aircraft, payload, fuel) resolve from the airline profile — no manual entry needed.
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </AppShell>
        </>
    );
}

// ── ComboField — text input with filtered suggestion dropdown ─────────────────

function ComboField({ label, placeholder, icon, value, onChange, suggestions }) {
    const [open, setOpen] = useState(false);

    const filtered = suggestions.filter((s) =>
        s.toUpperCase().includes(value.toUpperCase())
    );

    const pick = (item) => (e) => {
        e.preventDefault();
        onChange({ target: { value: item } });
        setOpen(false);
    };

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                {label}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                {icon}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
                />
            </div>

            {open && filtered.length > 0 && (
                <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.96)] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
                    {filtered.map((item) => (
                        <li
                            key={item}
                            onMouseDown={pick(item)}
                            className="cursor-pointer px-4 py-2.5 text-sm text-[var(--text)] transition hover:bg-white/8"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, placeholder, icon, type = "text", value, onChange }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                {label}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                {icon}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
                />
            </div>
        </div>
    );
}

// ── SelectField ───────────────────────────────────────────────────────────────

function SelectField({ label, icon, options, value, onChange }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                {label}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                {icon}
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--bg)] text-[var(--text)]">
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

// ── SideCard ──────────────────────────────────────────────────────────────────

function SideCard({ title, content }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="text-xl font-semibold">{title}</div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{content}</p>
        </div>
    );
}
