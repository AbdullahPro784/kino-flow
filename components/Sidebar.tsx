"use client";

import { Home, Search, Film, Tv, Bookmark, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Film, label: "Movies", href: "/movies" },
    { icon: Tv, label: "TV Series", href: "/tv" },
    { icon: Bookmark, label: "Library", href: "/library" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center justify-between border-r border-white/10 bg-white/5 py-8 backdrop-blur-xl transition-all duration-300">
            <div className="flex flex-col items-center gap-8">
                {/* Logo Placeholder */}
                {/* Logo Placeholder */}
                <Link href="/" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric-purple to-cyan-neon shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform hover:scale-110">
                    <span className="font-black italic text-white text-lg">K</span>
                </Link>

                <nav className="flex flex-col gap-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 hover:bg-white/10",
                                    isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                                )}
                                title={item.label}
                            >
                                <Icon className="h-5 w-5" />
                                {isActive && (
                                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                                )}
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -right-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan-neon shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex flex-col gap-4">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/10 hover:text-white">
                    <Settings className="h-5 w-5" />
                </button>
            </div>
        </aside>
    );
}
