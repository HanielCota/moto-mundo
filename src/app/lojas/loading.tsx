import { Skeleton } from "@/components/ui/skeleton";

export default function LojasLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-150">
      <div className="space-y-3 pb-6 border-b border-zinc-200">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
