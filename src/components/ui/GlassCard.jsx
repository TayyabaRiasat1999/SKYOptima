import React from "react";

export default function GlassCard({ children, className = "" }) {
    return (
        <div
            className={`rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md ${className}`}
        >
            {children}
        </div>
    );
}