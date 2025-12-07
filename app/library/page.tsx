"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlaceholderCard } from "@/components/PlaceholderCard";
import { WatchlistItem, getWatchlist } from "@/lib/storage";
import { Bookmark, Film } from "lucide-react";

export default function LibraryPage() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [mounted, setMounted] = useState(false);

    const refreshWatchlist = () => {
        setWatchlist(getWatchlist());
    };

    useEffect(() => {
        setMounted(true);
        refreshWatchlist();

        // Listen for updates from other components
        window.addEventListener("watchlist-updated", refreshWatchlist);
        return () => window.removeEventListener("watchlist-updated", refreshWatchlist);
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className="flex flex-col gap-8 min-h-[80vh]">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    Your Library
                </h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/60 uppercase">
                        {watchlist.length} Items
                    </span>
                </div>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
                <button className="text-electric-purple font-bold border-b-2 border-electric-purple text-lg px-2 pb-1">Watchlist</button>
                <button className="text-white/40 hover:text-white font-medium text-lg px-2 pb-1 transition-colors">Favorites</button>
                <button className="text-white/40 hover:text-white font-medium text-lg px-2 pb-1 transition-colors">History</button>
            </div>

            {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-[280px] animate-in fade-in zoom-in-95 duration-500">
                    {watchlist.map((item) => {
                        const image = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
                        const year = (item.release_date || "").split("-")[0];

                        return (
                            <Link
                                key={item.id}
                                href={`/${item.media_type}/${item.id}`}
                                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:z-10"
                            >
                                {image ? (
                                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                                ) : (
                                    <PlaceholderCard title={item.title} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <h3 className="line-clamp-1 text-sm font-bold text-white drop-shadow-md">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                                        <span>{year}</span>
                                        <span className="flex items-center gap-1">
                                            <Bookmark className="h-3 w-3 fill-electric-purple text-electric-purple" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                    <Film className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-xl font-medium mb-2">Your watchlist is empty</p>
                    <p className="text-sm opacity-60">Go explore and add some movies!</p>
                    <Link href="/search" className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all">
                        Explore Movies
                    </Link>
                </div>
            )}
        </div>
    );
}
