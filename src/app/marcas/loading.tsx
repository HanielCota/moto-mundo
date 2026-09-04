import { Skeleton } from "@/components/ui/skeleton";

export default function MarcasLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="space-y-3 pb-6 border-b border-zinc-200">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <Skeleton className="h-28 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
