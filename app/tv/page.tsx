import { fetchTrendingPage } from "@/app/actions";
import { DiscoverGrid } from "@/components/dashboard/DiscoverGrid";

export default async function TvPage() {
    const initialShows = await fetchTrendingPage(1, "tv");

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">TV Series</h1>
            <p className="text-white/40 -mt-6">Binge-worthy shows curated for you.</p>
            <DiscoverGrid initialMovies={initialShows} filter="tv" />
        </div>
    );
}
