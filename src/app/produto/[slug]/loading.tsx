import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-150">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-2">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shrink-0" />
            ))}
          </div>
        </div>

        {/* Right: Details (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-36" />
          <div className="space-y-2 py-4 border-y border-zinc-200">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
