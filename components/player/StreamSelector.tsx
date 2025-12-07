"use client";

import { useState, useEffect } from "react";
import { Play, Film, Server, AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { resolveRealDebridLink } from "@/app/actions";

interface Stream {
    name: string;
    title: string;
    url: string; // Magnet or HTTP
    quality?: string;
    seeds?: number;
    size?: string;
}

interface StreamSelectorProps {
    imdbId: string | null;
    tmdbId: string;
    title: string;
    onSelectStream: (url: string, type: "embed" | "magnet" | "direct") => void;
}

export function StreamSelector({ imdbId, tmdbId, title, onSelectStream }: StreamSelectorProps) {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState<number | null>(null);
    const [error, setError] = useState("");

    const handleStreamClick = async (stream: Stream, index: number) => {
        if (resolving !== null) return;
        setError("");

        try {
            setResolving(index);
            const directUrl = await resolveRealDebridLink(stream.url);
            onSelectStream(directUrl, "direct");
        } catch (err: any) {
            console.error("Failed to resolve via RD:", err);
            setError(err.message || "Failed to resolve stream via RealDebrid");
        } finally {
            setResolving(null);
        }
    };

    useEffect(() => {
        if (!imdbId) return;

        const fetchStreams = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`https://torrentio.strem.fun/stream/movie/${imdbId}.json`);
                if (!res.ok) throw new Error("Failed to fetch streams");

                const data = await res.json();
                const rawStreams = data.streams || [];

                const formattedStreams = rawStreams.map((s: any) => {
                    const titleLines = s.title.split("\n");
                    const quality = titleLines[0];
                    const meta = titleLines[1] || "";

                    let magnetUrl = s.url;
                    if (!magnetUrl && s.infoHash) {
                        magnetUrl = `magnet:?xt=urn:btih:${s.infoHash}&dn=${encodeURIComponent(quality)}`;
                    }

                    return {
                        name: s.name || "Torrentio",
                        title: quality,
                        url: magnetUrl || "",
                        quality: quality.includes("4k") ? "4K" : quality.includes("1080") ? "1080p" : "720p",
                        seeds: 0,
                        size: meta
                    };
                }).filter((s: any) => s.url);

                setStreams(formattedStreams);
            } catch (err) {
                console.error(err);
                setError("Could not load streams from Torrentio.");
            } finally {
                setLoading(false);
            }
        };

        fetchStreams();
    }, [imdbId]);

    return (
        <div className="flex flex-col gap-4 p-6 bg-neutral-900 rounded-2xl border border-white/5 max-h-[600px] overflow-hidden">


            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <Play className="h-5 w-5 text-electric-purple" />
                Free Instant Servers
            </h3>

            <div className="flex flex-col gap-2">
                {[
                    { name: "Server 1 (VidSrc)", url: `https://vidsrc.xyz/embed/movie/${tmdbId}`, recommended: true },
                    { name: "Server 2 (SuperEmbed)", url: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`, recommended: false },
                    { name: "Server 3 (2Embed)", url: `https://www.2embed.cc/embed/${tmdbId}`, recommended: false }
                ].map((server, i) => (
                    <div
                        key={i}
                        onClick={() => onSelectStream(server.url, "embed")}
                        className={clsx(
                            "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all group",
                            server.recommended
                                ? "bg-electric-purple/10 border-electric-purple/50 hover:bg-electric-purple/20"
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={clsx(
                                "h-8 w-8 rounded-full flex items-center justify-center shadow-lg transition-transform",
                                server.recommended ? "bg-electric-purple" : "bg-white/10"
                            )}>
                                <Play className="h-3 w-3 fill-white text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{server.name}</h4>
                                {server.recommended && <p className="text-[10px] text-electric-purple/80">Fast Load • Ad-supported</p>}
                            </div>
                        </div>
                        {server.recommended && <span className="text-[10px] font-bold bg-electric-purple text-white px-2 py-0.5 rounded">BEST</span>}
                    </div>
                ))}
            </div>

            <div className="h-px bg-white/10 my-4" />

            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-electric-purple" />
                Torrent Mirrors (Requires RealDebrid)
            </h3>

            {loading && (
                <div className="flex items-center justify-center py-8 text-white/40 animate-pulse">
                    Searching for streams...
                </div>
            )}

            {error && (
                <div className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {error}
                </div>
            )}

            {!loading && streams.length === 0 && !error && (
                <div className="text-white/40 text-sm italic">
                    No torrent streams found for this title. Try the Instant Player.
                </div>
            )}

            <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                {streams.map((stream, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleStreamClick(stream, idx)}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{stream.title}</span>
                                {stream.quality && <span className="text-[10px] bg-white/10 px-1.5 rounded text-white/60">{stream.quality}</span>}
                            </div>
                            <p className="text-xs text-white/40 mt-1">{stream.size} • {stream.name}</p>
                        </div>
                        {resolving === idx ? (
                            <Loader2 className="h-4 w-4 text-electric-purple animate-spin" />
                        ) : (
                            <Play className="h-4 w-4 text-white/20" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
