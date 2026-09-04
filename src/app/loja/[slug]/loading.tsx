import { Skeleton } from "@/components/ui/skeleton";

export default function StoreProfileLoading() {
  return (
    <div className="min-h-screen pb-16">
      <Skeleton className="h-44 sm:h-56 lg:h-72 w-full rounded-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-14 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-4">
          <Skeleton className="size-20 rounded-2xl" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-16 rounded-xl" />
            ))}
          </div>
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
