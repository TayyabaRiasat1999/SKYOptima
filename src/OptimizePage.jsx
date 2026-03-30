import React, { useState } from "react";
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

export default function OptimizePage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRunOptimization = () => {
        setLoading(true);

        setTimeout(() => {
            navigate("/results");
        }, 1800);
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
                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.30)] backdrop-blur-md sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                                Create a new optimization scenario
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                                Enter operational inputs below to prepare a route optimization
                                run. This shell is ready for backend integration later.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Origin"
                                placeholder="e.g. YYZ"
                                icon={<MapPin className="h-4 w-4 text-[var(--text-soft)]" />}
                            />
                            <Field
                                label="Destination"
                                placeholder="e.g. YVR"
                                icon={<MapPin className="h-4 w-4 text-[var(--text-soft)]" />}
                            />
                            <Field
                                label="Aircraft ICAO"
                                placeholder="e.g. B38M"
                                icon={
                                    <PlaneTakeoff className="h-4 w-4 text-[var(--text-soft)]" />
                                }
                            />
                            <SelectField
                                label="Operation Type"
                                icon={
                                    <Briefcase className="h-4 w-4 text-[var(--text-soft)]" />
                                }
                                options={["Passenger", "Cargo", "Private"]}
                            />
                            <Field
                                label="Payload (kg)"
                                placeholder="e.g. 12000"
                                icon={
                                    <Briefcase className="h-4 w-4 text-[var(--text-soft)]" />
                                }
                                type="number"
                            />
                            <Field
                                label="Fuel Price (CAD/kg)"
                                placeholder="e.g. 1.10"
                                icon={<Fuel className="h-4 w-4 text-[var(--text-soft)]" />}
                                type="number"
                            />
                            <Field
                                label="Headwind (kts)"
                                placeholder="e.g. 10"
                                icon={<Wind className="h-4 w-4 text-[var(--text-soft)]" />}
                                type="number"
                            />
                            <SelectField
                                label="Precipitation"
                                icon={<CloudRain className="h-4 w-4 text-[var(--text-soft)]" />}
                                options={["0 - No", "1 - Yes"]}
                            />
                            <Field
                                label="Visibility (km)"
                                placeholder="e.g. 12"
                                icon={<Eye className="h-4 w-4 text-[var(--text-soft)]" />}
                                type="number"
                            />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={handleRunOptimization}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-6 py-3 font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px]"
                            >
                                Run Optimization <ArrowRight className="h-4 w-4" />
                            </button>

                            <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8">
                                Save Draft
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SideCard
                            title="Scenario Tips"
                            content="Use realistic route, aircraft, and weather inputs so the comparison between Economical, Balanced, and Fastest feels meaningful during demo review."
                        />

                        <SideCard
                            title="Planned Output"
                            content="This form will later connect to your backend endpoint and return the top 3 ranked plans with ETA, cost, fuel, and risk."
                        />

                        <div className="rounded-[28px] border border-[rgba(56,189,248,0.20)] bg-[rgba(56,189,248,0.08)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                            <div className="text-sm font-semibold text-[#a8e7ff]">
                                Suggested demo input
                            </div>
                            <div className="mt-3 text-2xl font-bold">YYZ → YVR</div>
                            <div className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                                B38M • Passenger • Payload 12,000 kg • Fuel 1.10 CAD/kg
                            </div>
                        </div>
                    </div>
                </div>
            </AppShell>
        </>
    );
}

function Field({ label, placeholder, icon, type = "text" }) {
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
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
                />
            </div>
        </div>
    );
}

function SelectField({ label, icon, options }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                {label}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(8,18,32,0.72)] px-4 py-3">
                {icon}
                <select className="w-full bg-transparent text-sm text-[var(--text)] outline-none">
                    {options.map((option) => (
                        <option key={option} className="bg-[var(--bg)] text-[var(--text)]">
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function SideCard({ title, content }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="text-xl font-semibold">{title}</div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                {content}
            </p>
        </div>
    );
}