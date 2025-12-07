import { getTVDetails } from "@/lib/tmdb";
import { MovieDetailsView } from "@/components/player/MovieDetailsView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TVPage({ params }: PageProps) {
    const { id } = await params;
    let item = null;
    let error = null;

    try {
        const tvData = await getTVDetails(id);
        // Normalize to "Movie" shape for the view
        item = {
            ...tvData,
            title: tvData.name,
            media_type: "tv",
            release_date: tvData.first_air_date,
            runtime: tvData.episode_run_time?.[0] || 0,
            // TV specific props can be passed if View supports them later
        };
    } catch (err: any) {
        console.error("Failed to fetch tv details:", err);
        error = err.message;
    }

    if (error || !item) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-red-500">
                Error loading TV show: {error || "Unknown error"}
            </div>
        );
    }

    return <MovieDetailsView movie={item} />;
}
