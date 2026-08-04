export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/30 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-2/3 bg-surface-container-high rounded-full" />
          <div className="h-2.5 w-1/3 bg-surface-container rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2.5 w-full bg-surface-container rounded-full" />
        <div className="h-2.5 w-5/6 bg-surface-container rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="bg-background animate-pulse">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="h-3 w-40 bg-surface-container-high rounded-full mb-4" />
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-surface-container-high shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-surface-container-high rounded-full" />
            <div className="h-6 w-3/4 bg-surface-container-high rounded-lg" />
            <div className="h-4 w-full bg-surface-container rounded-full" />
            <div className="h-4 w-2/3 bg-surface-container rounded-full" />
          </div>
        </div>
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 bg-surface-container-high rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
              <div className="px-5 py-3 border-b border-border-slate/60 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-surface-container-high" />
                <div className="h-3.5 w-32 bg-surface-container-high rounded-full" />
              </div>
              <div className="px-5 py-3 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-surface-container-high shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-1/2 bg-surface-container-high rounded-full" />
                      <div className="h-2.5 w-3/4 bg-surface-container rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGenerate() {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-pulse">
      <div className="bg-surface border-b border-border-slate h-14 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-5 w-24 bg-surface-container-high rounded-full" />
          <div className="w-px h-4 bg-border-slate" />
          <div className="h-3 w-32 bg-surface-container-high rounded-full" />
        </div>
        <div className="h-3 w-20 bg-surface-container-high rounded-full" />
      </div>
      <div className="flex-1 flex">
        <div className="hidden lg:block w-[380px] shrink-0 bg-surface-container-low/60 border-e-2 border-primary/10 p-6">
          <div className="space-y-4">
            <div className="h-20 bg-surface-container-high rounded-2xl" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-5 h-5 rounded-full bg-surface-container-high shrink-0" />
                  <div className="h-3 flex-1 bg-surface-container-high rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 md:px-8 py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-24 bg-surface-container-high rounded-full" />
              <div className="h-3 w-16 bg-surface-container-high rounded-full" />
            </div>
            <div className="bg-primary-fixed/20 rounded-2xl p-6 md:p-8">
              <div className="h-5 w-3/4 bg-surface-container-high rounded-lg mb-3" />
              <div className="h-3 w-full bg-surface-container rounded-full" />
              <div className="h-3 w-2/3 bg-surface-container rounded-full" />
            </div>
            <div className="bg-surface rounded-2xl border border-outline-variant/40 p-5 md:p-6">
              <div className="h-8 w-full bg-surface-container-high rounded-xl" />
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-20 bg-surface-container-high rounded-xl" />
              <div className="h-12 flex-1 bg-surface-container-high rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
