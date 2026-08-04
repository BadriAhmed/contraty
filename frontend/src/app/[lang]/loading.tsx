export default function Loading() {
  return (
    <div className="bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="space-y-4">
          <div className="h-10 w-2/3 bg-surface-container-high rounded-lg" />
          <div className="h-4 w-3/4 bg-surface-container rounded-full" />
          <div className="h-12 w-48 bg-surface-container-high rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
}
