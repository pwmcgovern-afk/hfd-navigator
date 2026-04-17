// Shared wordmark used in the hero header (and `/about` header) of every
// Navigator app. The compass-needle glyph is identical across all three
// cities; the city name lives in the hero title or the About page so the
// header itself stays uncluttered.
//
// Hover: subtle underline animation defined in `globals.css` (.navigator-wordmark).

interface NavigatorWordmarkProps {
  /** When true, renders for dark backgrounds (e.g. the hero). Defaults true. */
  onDark?: boolean
}

export default function NavigatorWordmark({ onDark = true }: NavigatorWordmarkProps) {
  const toneClass = onDark ? 'text-white/70' : ''
  return (
    <span
      className={`navigator-wordmark inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-widest uppercase ${toneClass}`}
      style={onDark ? undefined : { color: 'var(--color-text-secondary)' }}
    >
      <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true" fill="currentColor">
        <path d="M5 0.5 L7 6 L5 11.5 L3 6 Z" />
      </svg>
      <span className="navigator-wordmark__label">Navigator</span>
    </span>
  )
}
