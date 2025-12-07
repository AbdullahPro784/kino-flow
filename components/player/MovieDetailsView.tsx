"use client";

import { useState, useEffect } from "react";
import { Play, Star, Clock, Calendar, X, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StreamSelector } from "./StreamSelector";
import { VideoPlayer } from "./VideoPlayer";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";

interface MovieDetailsViewProps {
    movie: any;
}

export function MovieDetailsView({ movie }: MovieDetailsViewProps) {
    const [showStreams, setShowStreams] = useState(false);
    const [activeStream, setActiveStream] = useState<{ url: string; type: "embed" | "magnet" | "direct" } | null>(null);
    const [inWatchlist, setInWatchlist] = useState(false);

    useEffect(() => {
        setInWatchlist(isInWatchlist(movie.id));
    }, [movie.id]);

    const toggleWatchlist = () => {
        if (inWatchlist) {
            removeFromWatchlist(movie.id);
            setInWatchlist(false);
        } else {
            addToWatchlist({
                id: movie.id,
                title: movie.title || movie.name,
                poster_path: movie.poster_path,
                media_type: movie.media_type || (movie.title ? "movie" : "tv"),
                release_date: movie.release_date || movie.first_air_date,
                vote_average: movie.vote_average
            });
            setInWatchlist(true);
        }
    };

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    const handleStreamSelect = (url: string, type: "embed" | "magnet" | "direct") => {
        setActiveStream({ url, type });
    };

    return (
        <div className="relative w-full min-h-screen pb-20">

            {/* Background Backdrop with Gradient */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 pt-20 flex flex-col lg:flex-row gap-12 px-4 lg:px-0">

                {/* Left: Poster & Actions */}
                <div className="flex flex-col gap-6 w-full lg:w-1/3 max-w-sm shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[2/3]"
                    >
                        {posterUrl && <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
                    </motion.div>

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowStreams(true)}
                            className="w-full py-4 bg-electric-purple rounded-2xl font-black text-white text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-3"
                        >
                            <Play className="fill-white" />
                            WATCH NOW
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={toggleWatchlist}
                            className={`
                                w-full py-4 rounded-2xl font-bold text-white text-lg border transition-all flex items-center justify-center gap-3
                                ${inWatchlist
                                    ? "bg-green-500/20 border-green-500/50 text-green-500 hover:bg-green-500/30"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}
                            `}
                        >
                            {inWatchlist ? (
                                <>
                                    <Check className="h-5 w-5" />
                                    IN WATCHLIST
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    ADD TO WATCHLIST
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex flex-col gap-6 flex-1">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]"
                    >
                        {movie.title}
                    </motion.h1>

                    <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm font-medium">
                        <span className="flex items-center gap-1 text-yellow-500"><Star className="fill-yellow-500 h-4 w-4" /> {movie.vote_average.toFixed(1)}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {movie.release_date?.split("-")[0]}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {movie.runtime}m</span>
                        {movie.genres?.map((g: any) => (
                            <span key={g.id} className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/80">
                                {g.name}
                            </span>
                        ))}
                    </div>

                    <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
                        {movie.overview}
                    </p>

                    {/* Stream Selector Modal/Panel */}
                    <AnimatePresence>
                        {showStreams && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                            >
                                <StreamSelector
                                    title={movie.title}
                                    imdbId={movie.external_ids?.imdb_id}
                                    tmdbId={movie.id}
                                    onSelectStream={handleStreamSelect}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Fullscreen Player Overlay */}
            {activeStream && (
                <VideoPlayer
                    url={activeStream.url}
                    type={activeStream.type}
                    onClose={() => setActiveStream(null)}
                />
            )}
        </div>
    );
}
