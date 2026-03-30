// src/components/FlyingPlane3D.jsx
export default function FlyingPlane3D() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* soft route line */}
            <div className="absolute left-[8%] top-[38%] w-[70%] h-px bg-gradient-to-r from-transparent via-sky-400/25 to-transparent blur-[1px]" />

            {/* faint orbital glow */}
            <div className="absolute left-[14%] top-[26%] h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute right-[18%] top-[20%] h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />

            {/* flying plane */}
            <div className="plane-3d absolute left-[4%] top-[24%]">
                <div className="relative preserve-3d">
                    {/* shadow */}
                    <div className="plane-shadow absolute left-[18%] top-[70%] h-6 w-32 rounded-full bg-slate-950/30 blur-md" />

                    {/* glow behind plane */}
                    <div className="absolute left-[20%] top-[22%] h-16 w-24 rounded-full bg-sky-400/20 blur-2xl" />

                    {/* real plane image */}
                    <img
                        src="/images/plane-real.png"
                        alt=""
                        draggable="false"
                        className="plane-img relative h-auto w-[140px] sm:w-[180px] md:w-[220px] select-none drop-shadow-[0_18px_30px_rgba(15,23,42,0.35)]"
                    />
                </div>
            </div>
        </div>
    );
}