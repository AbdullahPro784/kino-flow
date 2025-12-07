"use client";

import { Search, Bell, Grid, ChevronDown, Download, Plus, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const genres = [
    "Action", "Crime & Mystery", "Comedy", "Adventure", "Historical", "Science Fiction", "Romance", "Horror", "Drama", "Documentary"
];

const recentDownloads = [
    { title: "Lost Bullet", year: "2020", progress: "00:00 - 1:35:21", image: "bg-neutral-800" }, // Placeholder for image
];

const bookmarked = [
    { title: "Extraction", rating: "7.9", year: "2021", image: "bg-neutral-800" },
    { title: "Spider-man: Far...", rating: "7.4", year: "2017", image: "bg-neutral-800" },
    { title: "Bright", rating: "7.0", year: "2024", image: "bg-neutral-800" },
];

export function RightSidebar() {
    return (
        <aside className="fixed right-0 top-0 z-50 hidden h-full w-[350px] flex-col gap-8 border-l border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 xl:flex">

            {/* Header: User Profile */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-electric-purple/20 ring-2 ring-electric-purple/50" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Arman Rokni</span>
                        <span className="text-xs text-white/40">armanrokni@gmail.com</span>
                    </div>
                </div>
                <ChevronDown className="h-4 w-4 text-white/40" />
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors group-hover:text-electric-purple" />
                <input
                    type="text"
                    placeholder="Search movies..."
                    className="h-12 w-full rounded-2xl border border-white/5 bg-black/20 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:border-electric-purple/50 focus:outline-none focus:ring-1 focus:ring-electric-purple/50"
                />
                <Grid className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            </div>

            {/* Genres */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Genre</h3>
                <div className="grid grid-cols-2 gap-3">
                    {genres.map((genre, i) => (
                        <button
                            key={genre}
                            className={cn(
                                "flex items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-xs font-medium transition-all hover:border-white/10 hover:bg-white/5",
                                i === 0 ? "bg-electric-purple text-white border-transparent hover:bg-electric-purple/90" : "text-white/60"
                            )}
                        >
                            {genre}
                            {i !== 0 && <Plus className="h-3 w-3 text-white/40" />}
                            {i === 0 && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Download */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Recent Download</h3>
                    <span className="text-xs text-white/40 hover:text-white cursor-pointer">See all &gt;</span>
                </div>

                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 group cursor-pointer">
                    {/* Placeholder Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="font-bold text-white">Lost Bullet</h4>
                        <p className="text-xs text-white/60 mb-2">2020</p>
                        <div className="h-1 w-full rounded-full bg-white/10">
                            <div className="h-full w-1/3 rounded-full bg-electric-purple" />
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-0 w-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-1" />
                    </div>
                </div>
            </div>

        </aside>
    );
}
