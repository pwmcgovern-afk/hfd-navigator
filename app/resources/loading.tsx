// Skeleton placeholder shown while /resources fetches. Eliminates the
// flash-to-content jank a slow DB query causes.
export default function Loading() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-live="polite">
      <div className="page-header">
        <div className="hero__strip">
          <div className="skeleton" style={{ width: 90, height: 14 }} />
          <div className="skeleton" style={{ width: 120, height: 14, margin: '0 auto' }} />
          <div className="skeleton" style={{ width: 60, height: 14 }} />
        </div>
        <div className="page-header__title-block">
          <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: '70%', height: 38 }} />
        </div>
      </div>
      <main className="px-5 pb-12">
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="card-flat">
              <div className="skeleton" style={{ width: '60%', height: 18, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: '40%', height: 14 }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
