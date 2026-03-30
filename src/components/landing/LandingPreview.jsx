import React from "react";

export default function LandingPreview() {
    return (
        <section id="preview" className="relative">
            <div className="mx-auto w-[min(1200px,calc(100%-32px))] py-16 sm:py-20">
                <div className="mb-10 max-w-3xl">
                    <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#93dcff]">
                        Preview value
                    </div>
                    <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                        A frontend that makes backend intelligence easy to understand
                    </h2>
                    <p className="mt-4 text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                        This experience turns optimization logic into something clear,
                        visual, and product-ready for demos, professor reviews, and future users.
                    </p>
                </div>

                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_28px_70px_rgba(0,0,0,0.30)] backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <div className="min-w-[760px]">
                            <div className="grid grid-cols-5 border-b border-white/10 bg-[rgba(255,255,255,0.04)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-soft)] sm:text-sm">
                                <div className="p-4">Plan</div>
                                <div className="p-4">Cost</div>
                                <div className="p-4">ETA</div>
                                <div className="p-4">Fuel</div>
                                <div className="p-4">Risk</div>
                            </div>

                            <PreviewRow
                                name="Economical"
                                cost="$18,420"
                                eta="4h 58m"
                                fuel="12,900 kg"
                                risk="Low"
                            />
                            <PreviewRow
                                name="Balanced"
                                cost="$19,210"
                                eta="4h 44m"
                                fuel="13,250 kg"
                                risk="Low"
                                highlighted
                            />
                            <PreviewRow
                                name="Fastest"
                                cost="$20,340"
                                eta="4h 28m"
                                fuel="13,980 kg"
                                risk="Medium"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PreviewRow({ name, cost, eta, fuel, risk, highlighted = false }) {
    return (
        <div
            className={
                highlighted
                    ? "grid grid-cols-5 border-b border-white/10 bg-[rgba(56,189,248,0.10)] text-sm"
                    : "grid grid-cols-5 border-b border-white/10 bg-white/5 text-sm"
            }
        >
            <div className="p-4 font-semibold">{name}</div>
            <div className="p-4">{cost}</div>
            <div className="p-4">{eta}</div>
            <div className="p-4">{fuel}</div>
            <div className="p-4">{risk}</div>
        </div>
    );
}