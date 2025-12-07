"use client";

export interface WatchlistItem {
    id: string | number;
    title: string;
    poster_path: string | null;
    media_type: string;
    release_date?: string;
    vote_average?: number;
}

const STORAGE_KEY = "kino_watchlist";

export function getWatchlist(): WatchlistItem[] {
    if (typeof window === "undefined") return [];
    try {
        const item = localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Failed to get watchlist", error);
        return [];
    }
}

export function addToWatchlist(movie: WatchlistItem) {
    const list = getWatchlist();
    if (list.some((i) => i.id === movie.id)) return;

    list.unshift(movie); // Add to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Dispatch event for instant UI updates across components
    window.dispatchEvent(new Event("watchlist-updated"));
}

export function removeFromWatchlist(id: string | number) {
    let list = getWatchlist();
    list = list.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("watchlist-updated"));
}

export function isInWatchlist(id: string | number): boolean {
    const list = getWatchlist();
    return list.some((i) => i.id === id);
}
