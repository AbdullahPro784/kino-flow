"use server";

import { getTrending, searchMovies, getMoviesByGenre } from "@/lib/tmdb";

const REAL_DEBRID_API_KEY = process.env.REAL_DEBRID_API_KEY;

export async function fetchTrendingPage(page: number, type: string = "all") {
    try {
        const data = await getTrending(page, type);
        return data.results;
    } catch (error) {
        console.error("Failed to fetch trending page:", error);
        return [];
    }
}

export async function searchMedia(query: string) {
    if (!query) return [];
    try {
        const data = await searchMovies(query);
        return data.results;
    } catch (error) {
        console.error("Failed to search media:", error);
        return [];
    }
}

export async function discoverByGenre(genreId: string, page: number = 1) {
    try {
        const data = await getMoviesByGenre(genreId, page);
        return data.results;
    } catch (error) {
        console.error("Failed to discover by genre:", error);
        return [];
    }
}

export async function resolveRealDebridLink(magnet: string) {
    if (!REAL_DEBRID_API_KEY) {
        throw new Error("RealDebrid API Key not configured.");
    }

    const headers = {
        "Authorization": `Bearer ${REAL_DEBRID_API_KEY}`
    };

    try {
        // 1. Add Magnet
        const addForm = new FormData();
        addForm.append("magnet", magnet);
        const addRes = await fetch("https://api.real-debrid.com/rest/1.0/torrents/addMagnet", {
            method: "POST",
            headers,
            body: addForm
        });
        if (!addRes.ok) {
            const errorText = await addRes.text();
            let errorMessage = `RealDebrid Error: ${addRes.status}`;

            try {
                const errJson = JSON.parse(errorText);
                if (errJson.error_code === 9) {
                    errorMessage = "RealDebrid Premium Account Required. Please upgrade your account.";
                } else if (errJson.error_code === 8) {
                    errorMessage = "RealDebrid IP blocked or Bad Token.";
                } else {
                    errorMessage = `RealDebrid: ${errJson.error || errorText}`;
                }
            } catch (e) {
                errorMessage = `RealDebrid Error: ${errorText}`;
            }

            throw new Error(errorMessage);
        }
        const addData = await addRes.json();
        const torrentId = addData.id;

        // 2. Select Files (All)
        const selectForm = new FormData();
        selectForm.append("files", "all");
        await fetch(`https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`, {
            method: "POST",
            headers,
            body: selectForm
        });

        // 3. Get Info (to find links)
        const infoRes = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`, {
            headers
        });
        const infoData = await infoRes.json();

        if (!infoData.links || infoData.links.length === 0) {
            throw new Error("No links found in torrent.");
        }

        // 4. Unrestrict the first link
        const linkToUnrestrict = infoData.links[0];
        const unrestrictForm = new FormData();
        unrestrictForm.append("link", linkToUnrestrict);
        const unrestrictRes = await fetch("https://api.real-debrid.com/rest/1.0/unrestrict/link", {
            method: "POST",
            headers,
            body: unrestrictForm
        });

        if (!unrestrictRes.ok) throw new Error("Failed to unrestrict link");
        const unrestrictData = await unrestrictRes.json();

        return unrestrictData.download;

    } catch (error: any) {
        console.error("RD Error:", error);
        throw new Error(error.message || "Failed to resolve stream");
    }
}
