export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Memuat">
      <div className="h-8 w-48 animate-pulse rounded-full bg-purple-100" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-square animate-pulse bg-purple-100" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-1/3 animate-pulse rounded bg-pink-100" />
              <div className="h-4 w-full animate-pulse rounded bg-purple-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-purple-100" />
              <div className="mt-2 h-10 w-full animate-pulse rounded-full bg-purple-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
