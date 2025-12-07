"use client";

import { Play, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface Item {
    title: string;
    description?: string;
    image?: string;
    progress?: number;
    rating?: string;
}

interface ContentSectionProps {
    title: string;
    items: Item[];
    variant?: "continue" | "top-rated";
}

export function ContentSection({ title, items, variant = "top-rated" }: ContentSectionProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button className="text-xs font-medium text-white/40 transition-colors hover:text-white">See all &gt;</button>
            </div>

            <div className={cn(
                "grid gap-6",
                variant === "continue" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}>
                {items.map((item, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all hover:border-white/20 hover:shadow-xl hover:-translate-y-1">
                        {/* Image Placeholder */}
                        <div className={cn(
                            "relative w-full overflow-hidden bg-neutral-800",
                            variant === "continue" ? "h-32" : "h-40"
                        )}>
                            {variant === "continue" && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Play className="h-3 w-3 fill-white text-white" />
                                    </div>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        </div>

                        <div className="p-4">
                            {variant === "top-rated" && (
                                <div className="absolute top-2 left-2 z-20 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-yellow-500 backdrop-blur-md">
                                    ★ {item.rating}
                                </div>
                            )}

                            <h4 className="truncate font-bold text-white">{item.title}</h4>
                            <p className="text-xs text-white/40">{item.description}</p>

                            {variant === "continue" && item.progress !== undefined && (
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="relative h-1 w-full rounded-full bg-white/10">
                                        <div
                                            className="absolute left-0 top-0 h-full rounded-full bg-white relative"
                                            style={{ width: `${item.progress}%` }}
                                        >
                                            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-white/60">
                                        {Math.floor((124 * item.progress) / 100)}m
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
