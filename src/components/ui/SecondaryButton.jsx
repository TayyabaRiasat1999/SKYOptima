import React from "react";
import { Link } from "react-router-dom";

export default function SecondaryButton({
    children,
    to,
    href,
    className = "",
    ...props
}) {
    const styles =
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-[var(--text)] transition hover:border-white/20 hover:bg-white/8";

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