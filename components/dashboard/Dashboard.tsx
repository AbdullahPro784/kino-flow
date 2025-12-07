"use client";

import { useState } from "react";
import { DiscoverGrid } from "./DiscoverGrid";
import { Cast, Wifi } from "lucide-react";
import { clsx } from "clsx";

interface DashboardProps {
    initialItems: any[];
}

export function Dashboard({ initialItems }: DashboardProps) {
    const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                {/* Brand Header */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-cyan-neon italic uppercase drop-shadow-2xl">
                        KINO FLOW
                    </h1>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase pl-1">
                        Stream the Universe
                    </p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6 self-end md:self-auto">
                    <div className="hidden items-center gap-2 xl:flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setFilter("all")}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                                filter === "all" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("movie")}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                                filter === "movie" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            Movies
                        </button>
                        <button
                            onClick={() => setFilter("tv")}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                                filter === "tv" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            TV Shows
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-white/40">
                        <Wifi className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
                        <Cast className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>

            <DiscoverGrid initialMovies={initialItems} filter={filter} />
        </>
    );
}
