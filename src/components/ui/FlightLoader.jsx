import React from "react";

export default function FlightLoader({ open = false, text = "Processing..." }) {
    if (!open) return null;

    return (
        <>
            <style>{`
        @keyframes loaderPlaneFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes loaderGlowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(4,10,20,0.72)] backdrop-blur-md">
                <div className="w-[min(520px,calc(100%-32px))] rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                    <div className="mb-6 text-center">
                        <div className="text-2xl font-bold">{text}</div>
                        <div className="mt-2 text-sm text-[var(--text-soft)]">
                            Please wait while the system prepares your next step.
                        </div>
                    </div>

                    <div className="relative mx-auto h-[220px] w-full max-w-[440px]">
                        <svg
                            viewBox="0 0 1000 320"
                            className="absolute inset-0 h-full w-full overflow-visible"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M 90 250 Q 500 20 910 250"
                                fill="none"
                                stroke="rgba(56,189,248,0.28)"
                                strokeWidth="2.5"
                                strokeDasharray="10 10"
                                filter="url(#loaderArcGlow)"
                            />

                            <circle r="5" fill="#7dd3fc">
                                <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto">
                                    <mpath href="#loaderFlightArc" />
                                </animateMotion>
                            </circle>

                            <path
                                id="loaderFlightArc"
                                d="M 90 250 Q 500 20 910 250"
                                fill="none"
                                stroke="transparent"
                                strokeWidth="0"
                            />

                            <defs>
                                <filter id="loaderArcGlow" x="-100%" y="-100%" width="300%" height="300%">
                                    <feDropShadow
                                        dx="0"
                                        dy="0"
                                        stdDeviation="4"
                                        floodColor="#38BDF8"
                                        floodOpacity="0.28"
                                    />
                                </filter>
                            </defs>
                        </svg>

                        <div
                            className="absolute left-[8%] top-[78%] h-4 w-4 rounded-full bg-[var(--primary)] shadow-[0_0_0_8px_rgba(56,189,248,0.10),0_0_22px_rgba(56,189,248,0.65)]"
                            style={{ animation: "loaderGlowPulse 1.6s ease-in-out infinite" }}
                        />
                        <div
                            className="absolute right-[8%] top-[78%] h-4 w-4 rounded-full bg-[var(--primary)] shadow-[0_0_0_8px_rgba(56,189,248,0.10),0_0_22px_rgba(56,189,248,0.65)]"
                            style={{ animation: "loaderGlowPulse 1.6s ease-in-out infinite 0.3s" }}
                        />

                        <svg
                            viewBox="0 0 1000 320"
                            className="absolute inset-0 h-full w-full overflow-visible"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <g filter="url(#loaderPlaneGlow)" style={{ animation: "loaderPlaneFloat 1.6s ease-in-out infinite" }}>
                                <path
                                    d="M54 32.5 33.5 27 25.2 9.3c-.8-1.7-3.3-1.7-4.1 0l-2.6 5.5 5.8 18.2-14.7-4.1-5.8-6.6c-.9-1-2.5-.8-3.2.3-.4.7-.4 1.5 0 2.2l5.1 7.5a4 4 0 0 0 2.2 1.5l16.5 4.8-5.7 12.1-7.6 1.2c-1.3.2-2.1 1.5-1.7 2.8.3 1 1.2 1.7 2.2 1.7h8.8c1 0 1.9-.6 2.3-1.5l7.5-15.1 21.6 6.1c2.1.6 4.2-.7 4.8-2.8.5-2-.6-4-2.5-4.7Z"
                                    fill="url(#loaderPlaneGradient)"
                                    transform="translate(-32 -32) scale(1.5)"
                                >
                                    <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto">
                                        <mpath href="#loaderFlightArc" />
                                    </animateMotion>
                                </path>
                            </g>

                            <defs>
                                <linearGradient
                                    id="loaderPlaneGradient"
                                    x1="4"
                                    y1="10"
                                    x2="58"
                                    y2="54"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#E0F7FF" />
                                    <stop offset="0.5" stopColor="#38BDF8" />
                                    <stop offset="1" stopColor="#60A5FA" />
                                </linearGradient>

                                <filter id="loaderPlaneGlow" x="-100%" y="-100%" width="300%" height="300%">
                                    <feDropShadow
                                        dx="0"
                                        dy="0"
                                        stdDeviation="5"
                                        floodColor="#38BDF8"
                                        floodOpacity="0.55"
                                    />
                                </filter>
                            </defs>
                        </svg>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-pulse" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:150ms]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        </>
    );
}