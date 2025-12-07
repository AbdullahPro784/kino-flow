"use client";

import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PlaceholderCard } from "../PlaceholderCard";
import { fetchTrendingPage } from "@/app/actions";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// TMDB Result Type
interface Movie {
    id: number;
    title?: string;
    name?: string; // TV shows use 'name'
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string; // TV shows
    genre_ids: number[];
    overview?: string;
    media_type?: string;
}

interface DiscoverGridProps {
    initialMovies: Movie[];
    filter?: "all" | "movie" | "tv";
}

export function DiscoverGrid({ initialMovies, filter = "all" }: DiscoverGridProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef(null);

    // Reset when filter changes
    useEffect(() => {
        // If it's the default 'all', we might want to keep using initialMovies until we scroll
        // But to be consistent, if filter changes, we simply reset.
        // However, we need to handle the initial load case properly to avoid immediate refetch if not needed.
        if (filter === "all" && page === 1 && movies === initialMovies) return;

        // Fetch first page of new filter immediately
        const resetAndFetch = async () => {
            setLoading(true);
            setMovies([]);
            setPage(1);
            const newMovies = await fetchTrendingPage(1, filter);
            setMovies(newMovies);
            setLoading(false);
        };
        resetAndFetch();
    }, [filter]);

    // Load More Function
    const loadMore = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        const nextPage = page + 1;
        const newMovies = await fetchTrendingPage(nextPage, filter);

        if (newMovies && newMovies.length > 0) {
            setMovies((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const uniqueNewMovies = newMovies.filter((m: Movie) => !existingIds.has(m.id));
                return [...prev, ...uniqueNewMovies];
            });
            setPage(nextPage);
        }
        setLoading(false);
    }, [page, loading, filter]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loadMore, loading]);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[300px]">
                {movies.map((movie, index) => {
                    const isHero = index === 0; // First item is Hero
                    const title = movie.title || movie.name || "Unknown Title";
                    const year = (movie.release_date || movie.first_air_date || "").split("-")[0];
                    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
                    const imageUrl = movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null;
                    const heroImage = movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : imageUrl;

                    const bgImage = isHero ? heroImage : imageUrl;
                    const mediaType = movie.media_type || "movie";

                    return (
                        <Link
                            key={`${movie.id}-${index}`}
                            href={`/${mediaType}/${movie.id}`}
                            className={cn(
                                "block group relative",
                                isHero ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2" : "col-span-1 row-span-1"
                            )}
                        >
                            <motion.div
                                className="h-full w-full overflow-hidden rounded-3xl border border-white/5 bg-neutral-900 relative"
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                            >
                                {/* Background Image or Placeholder */}
                                {bgImage ? (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${bgImage})` }}
                                    />
                                ) : (
                                    <div className="absolute inset-0">
                                        <PlaceholderCard title={title} />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />

                                {/* Cyan Glow Border Effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-3xl border-2 border-cyan-neon opacity-0"
                                    variants={{
                                        rest: { opacity: 0 },
                                        hover: { opacity: 1, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Content Container */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6">

                                    {/* Hero Specific Content (Top Spacer) */}
                                    {isHero && (
                                        <div className="mb-auto mt-4" />
                                    )}

                                    <motion.div
                                        variants={{
                                            rest: { y: 0 },
                                            hover: { y: -10 }
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {/* Meta Tags */}
                                        <motion.div
                                            className="flex items-center gap-2 mb-2"
                                            variants={{
                                                rest: { opacity: 1 },
                                                hover: { opacity: 1 }
                                            }}
                                        >
                                            <span className="flex items-center gap-1 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-500 backdrop-blur-md">
                                                <Star className="h-3 w-3 fill-yellow-500" /> {rating}
                                            </span>
                                            <span className="text-xs font-medium text-white/80">{year}</span>
                                            {movie.media_type && <span className="text-[10px] uppercase text-white/40 border border-white/10 px-1 rounded">{movie.media_type}</span>}
                                        </motion.div>

                                        {/* Title */}
                                        <h3 className={cn(
                                            "font-black uppercase italic tracking-tighter text-white",
                                            isHero ? "text-4xl leading-none mb-4" : "text-xl leading-snug mb-2"
                                        )}>
                                            {title}
                                        </h3>

                                        {/* Metadata Slide Up Section (Genres/Overview) */}
                                        {!isHero && (
                                            <motion.div
                                                className="overflow-hidden"
                                                variants={{
                                                    rest: { height: 0, opacity: 0 },
                                                    hover: { height: "auto", opacity: 1 }
                                                }}
                                            >
                                                <p className="text-xs text-white/60 line-clamp-2">{movie.overview}</p>
                                            </motion.div>
                                        )}

                                        {/* Hero Actions */}
                                        {isHero && (
                                            <div className="flex items-center gap-4">
                                                <motion.button
                                                    className="flex items-center gap-2 rounded-xl bg-electric-purple px-6 py-3 text-sm font-bold text-white shadow-lg"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        backgroundColor: "#a855f7",
                                                        boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Watch now
                                                </motion.button>
                                                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/20">
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Loading Indicator / Sentinel */}
            <div ref={observerTarget} className="h-20 flex justify-center items-center">
                {loading && <div className="h-6 w-6 animate-spin rounded-full border-2 border-electric-purple border-t-transparent" />}
            </div>
        </div>
    );
}
