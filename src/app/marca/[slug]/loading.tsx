import { Skeleton } from "@/components/ui/skeleton";

export default function MarcaLoading() {
  return (
    <div className="min-h-screen pb-16">
      <Skeleton className="h-48 sm:h-64 lg:h-80 w-full rounded-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 bg-white rounded-2xl border border-zinc-200 p-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
