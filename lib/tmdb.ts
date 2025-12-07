const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not defined in the environment variables.");
}

interface TMDBOptions extends RequestInit {
    headers?: Record<string, string>;
}

async function fetchTMDB(endpoint: string, options: TMDBOptions = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultOptions = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    const separator = endpoint.includes("?") ? "&" : "?";
    const finalUrl = `${url}${separator}api_key=${TMDB_API_KEY}&language=en-US`;

    const res = await fetch(finalUrl, mergedOptions);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`TMDB Error: ${res.status} ${res.statusText}\n${errorText}`);
    }

    return res.json();
}

export async function getTrending(page = 1, type = "all") {
    return fetchTMDB(`/trending/${type}/week?page=${page}`);
}

export async function getLatestReleases() {
    return fetchTMDB("/movie/now_playing?page=1");
}

export async function searchMovies(query: string) {
    return fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&page=1`);
}

export async function getMovieDetails(id: string) {
    return fetchTMDB(`/movie/${id}?append_to_response=external_ids,credits,similar`);
}

export async function getTVDetails(id: string) {
    return fetchTMDB(`/tv/${id}?append_to_response=external_ids,credits,similar`);
}

export async function getMoviesByGenre(genreId: string, page = 1) {
    return fetchTMDB(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
}
