import { fetchTrendingPage } from "@/app/actions";
import { DiscoverGrid } from "@/components/dashboard/DiscoverGrid";

export default async function MoviesPage() {
    const initialMovies = await fetchTrendingPage(1, "movie");

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Movies</h1>
            <p className="text-white/40 -mt-6">Browse the latest blockbusters and indie gems.</p>
            <DiscoverGrid initialMovies={initialMovies} filter="movie" />
        </div>
    );
}
