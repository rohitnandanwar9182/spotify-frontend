export default function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-3 py-2.5">
      <div className="animate-shimmer h-3 w-8 rounded" />
      <div className="flex-1">
        <div className="animate-shimmer h-3 w-1/3 rounded" />
        <div className="animate-shimmer mt-2 h-2.5 w-1/5 rounded" />
      </div>
    </div>
  )
}
