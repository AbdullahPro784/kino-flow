import { getMovieDetails } from "@/lib/tmdb";
import { MovieDetailsView } from "@/components/player/MovieDetailsView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: PageProps) {
    const { id } = await params;
    let movie = null;
    let error = null;

    try {
        movie = await getMovieDetails(id);
        if (movie) movie.media_type = "movie";
    } catch (err: any) {
        console.error("Failed to fetch movie details:", err);
        error = err.message;
    }

    if (error || !movie) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-red-500">
                Error loading movie: {error || "Unknown error"}
            </div>
        );
    }

    return <MovieDetailsView movie={movie} />;
}
