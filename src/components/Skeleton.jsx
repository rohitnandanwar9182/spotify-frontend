export default function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 px-3 py-2.5">
      <div className="h-3 w-8 rounded bg-surface-raised" />
      <div className="flex-1">
        <div className="h-3 w-1/3 rounded bg-surface-raised" />
        <div className="mt-2 h-2.5 w-1/5 rounded bg-surface-raised" />
      </div>
    </div>
  )
}