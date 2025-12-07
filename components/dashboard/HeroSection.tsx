"use client";

import { Play, Plus } from "lucide-react";

export function HeroSection() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Hero Card (Spans 2 cols) */}
            <div className="group relative h-[300px] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl transition-transform lg:col-span-2 hover:scale-[1.01]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />

                {/* Content */}
                <div className="relative z-20 flex h-full flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-500">IMDb 7.9</span>
                        <span className="text-xs font-medium text-white/60">Action • 2h 28m</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-black uppercase italic tracking-tighter text-white">
                        Army of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-cyan-neon">Dead</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 rounded-xl bg-electric-purple px-6 py-3 text-sm font-bold text-white transition-all hover:bg-electric-purple/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                            Watch now
                        </button>
                        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:border-white/20">
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Abstract Background Placeholder */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-all duration-700 group-hover:scale-110" />
            </div>

            {/* Secondary Hero Card */}
            <div className="group relative h-[300px] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />

                <div className="relative z-20 flex h-full flex-col justify-end p-6">
                    <h2 className="mb-2 text-2xl font-bold leading-tight text-white">Gunpowder Milkshake</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-500">IMDb 7.5</span>
                        <span className="text-[10px] text-white/60">2021</span>
                    </div>
                </div>

                {/* Abstract Background Placeholder */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-all duration-700 group-hover:scale-110" />
            </div>
        </div>
    );
}
