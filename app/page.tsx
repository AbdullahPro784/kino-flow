import { getTrending } from "@/lib/tmdb";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialMovies = [];
  let errorMsg = "";

  try {
    const trendingData = await getTrending(1);
    if (trendingData && trendingData.results) {
      initialMovies = trendingData.results;
    } else {
      errorMsg = "No results found in TMDB response.";
    }
  } catch (error: any) {
    console.error("Failed to fetch trending data:", error);
    errorMsg = error.message || "Failed to fetch trending data.";
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {errorMsg ? (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-6 text-center text-red-500">
          <h3 className="font-bold">Error Loading Content</h3>
          <p>{errorMsg}</p>
          <p className="text-sm opacity-70 mt-2">Please check your TMDB_API_KEY in .env.local</p>
        </div>
      ) : (
        <Dashboard initialItems={initialMovies} />
      )}
    </div>
  );
}
