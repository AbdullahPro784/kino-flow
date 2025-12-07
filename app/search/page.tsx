"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { searchMedia, discoverByGenre } from "@/app/actions";
import Link from "next/link";
import { PlaceholderCard } from "@/components/PlaceholderCard";

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const GENRES = [
    { name: "Action", id: "28", color: "from-orange-500", icon: "💥" },
    { name: "Adventure", id: "12", color: "from-green-500", icon: "🗺️" },
    { name: "Animation", id: "16", color: "from-pink-500", icon: "🎨" },
    { name: "Comedy", id: "35", color: "from-yellow-400", icon: "😂" },
    { name: "Crime", id: "80", color: "from-red-700", icon: "🕵️" },
    { name: "Documentary", id: "99", color: "from-blue-400", icon: "📹" },
    { name: "Drama", id: "18", color: "from-purple-500", icon: "🎭" },
    { name: "Family", id: "10751", color: "from-cyan-400", icon: "👨‍👩‍👧‍👦" },
    { name: "Fantasy", id: "14", color: "from-indigo-500", icon: "🦄" },
    { name: "History", id: "36", color: "from-amber-700", icon: "📜" },
    { name: "Horror", id: "27", color: "from-red-900", icon: "👻" },
    { name: "Sci-Fi", id: "878", color: "from-blue-600", icon: "🚀" },
];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [activeGenreId, setActiveGenreId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const debouncedQuery = useDebounce(query, 500);

    // Search Effect
    useEffect(() => {
        const fetchResults = async () => {
            // If manual active genre is set, ignore query based search effect unless query changes
            if (activeGenre && !query) return;

            if (!debouncedQuery.trim()) {
                if (!activeGenre) setResults([]); // clear only if no genre active
                return;
            }

            setActiveGenre(null);
            setActiveGenreId(null);
            setPage(1);
            setLoading(true);
            const data = await searchMedia(debouncedQuery);
            setResults(data || []);
            setLoading(false);
        };
        fetchResults();
    }, [debouncedQuery, query]);

    const handleGenreClick = async (genreId: string, genreName: string) => {
        setQuery("");
        setActiveGenre(genreName);
        setActiveGenreId(genreId);
        setPage(1);
        setLoading(true);
        const data = await discoverByGenre(genreId, 1);
        setResults(data || []);
        setLoading(false);
    };

    const loadMore = async () => {
        if (loading || !activeGenreId) return;
        setLoading(true);
        const nextPage = page + 1;
        const newResults = await discoverByGenre(activeGenreId, nextPage);
        if (newResults && newResults.length > 0) {
            setResults(prev => [...prev, ...newResults]);
            setPage(nextPage);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 min-h-[80vh]">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tighter uppercase italic">
                {activeGenre ? `${activeGenre} Movies` : "Search"}
            </h1>

            <div className="relative w-full max-w-3xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/20 to-cyan-neon/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies, TV shows..."
                    className="relative h-20 w-full rounded-3xl border border-white/10 bg-black/40 pl-16 pr-8 text-xl text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none backdrop-blur-xl shadow-2xl transition-all"
                    autoFocus
                />
                {loading && <Loader2 className="absolute right-6 top-1/2 h-6 w-6 -translate-y-1/2 text-electric-purple animate-spin" />}
            </div>

            {!query && !activeGenre && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/30">Browse Categories</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {GENRES.map((genre) => (
                                <button
                                    key={genre.name}
                                    onClick={() => handleGenreClick(genre.id, genre.name)}
                                    className={`
                                        group relative h-32 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/50 
                                        transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.6)]
                                    `}
                                >
                                    {/* Gradient Background that appears on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                                    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
                                        <span className="text-3xl drop-shadow-md group-hover:scale-125 transition-transform duration-300 filter group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                            {genre.icon}
                                        </span>
                                        <span className="text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                                            {genre.name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-[280px] animate-in fade-in zoom-in-95 duration-500">
                        {results.map((item: any, index: number) => {
                            const title = item.title || item.name;
                            const image = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
                            const year = (item.release_date || item.first_air_date || "").split("-")[0];
                            const mediaType = item.media_type || "movie";

                            if (!title) return null;

                            return (
                                <Link
                                    key={`${item.id}-${index}`}
                                    href={`/${mediaType}/${item.id}`}
                                    className="group relative block h-full w-full overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:z-10"
                                >
                                    {image ? (
                                        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                                    ) : (
                                        <PlaceholderCard title={title} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h3 className="line-clamp-1 text-sm font-bold text-white drop-shadow-md">{title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                                            <span>{year}</span>
                                            <span className="uppercase border border-white/10 px-1 rounded text-[10px]">{mediaType}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {/* Load More Button for Genres */}
                    {activeGenreId && !loading && (
                        <div className="flex justify-center pb-8">
                            <button
                                onClick={loadMore}
                                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            >
                                Load More Movies
                            </button>
                        </div>
                    )}
                    {loading && activeGenreId && (
                        <div className="flex justify-center pb-8">
                            <Loader2 className="h-6 w-6 animate-spin text-electric-purple" />
                        </div>
                    )}
                </div>
            )}

            {!loading && debouncedQuery && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                    <Search className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-xl font-medium">No results found for &quot;{query}&quot;</p>
                </div>
            )}
            {!loading && activeGenre && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                    <Search className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-xl font-medium">No results found for &quot;{activeGenre}&quot;</p>
                </div>
            )}
        </div>
    );
}
