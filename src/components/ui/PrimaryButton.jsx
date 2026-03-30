import React from "react";
import { Link } from "react-router-dom";

export default function PrimaryButton({
    children,
    to,
    href,
    className = "",
    ...props
}) {
    const styles =
        "inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-6 py-3 font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:translate-y-[-1px]";

    if (to) {
        return (
            <Link to={to} className={`${styles} ${className}`} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={`${styles} ${className}`} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button className={`${styles} ${className}`} {...props}>
            {children}
        </button>
    );
}