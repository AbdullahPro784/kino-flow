"use client";

import { useState } from "react";
import { Maximize, X } from "lucide-react";

interface VideoPlayerProps {
    url: string;
    type: "embed" | "magnet" | "direct";
    onClose: () => void;
}

export function VideoPlayer({ url, type, onClose }: VideoPlayerProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <h2 className="text-white font-bold text-lg">Now Playing</h2>
                <button
                    onClick={onClose}
                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Player Container */}
            <div className="relative w-full max-w-[90vw] lg:max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {type === "embed" && (
                    <iframe
                        src={url}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                    />
                )}

                {type === "direct" && (
                    <video
                        src={url}
                        className="w-full h-full"
                        controls
                        autoPlay
                    />
                )}

                {type === "magnet" && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4">
                        <div className="p-4 bg-yellow-500/10 rounded-full">
                            <Maximize className="h-8 w-8 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">External Player Required</h3>
                        <p className="text-white/60 max-w-md">
                            This is a magnet/torrent link. Browsers cannot play these directly securely.
                        </p>
                        <div className="p-4 bg-neutral-800 rounded-lg break-all text-xs text-white/40 font-mono select-all">
                            {url}
                        </div>
                        <a
                            href={url}
                            className="px-6 py-3 bg-electric-purple rounded-xl font-bold text-white hover:bg-purple-600 transition-colors"
                        >
                            Open in Torrent Client
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
