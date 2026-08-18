export function DecorativeFigure({ className = '', variant = 1 }: { className?: string; variant?: 1 | 2 | 3 }) {
  const paths = {
    1: 'M32 8c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5zm-2 12h4l6 10-4 3-3-5v14h-6V28l-3 5-4-3z',
    2: 'M20 10c2.5 0 4.5 2 4.5 4.5S22.5 19 20 19s-4.5-2-4.5-4.5S17.5 10 20 10zm-3 11h6l4 8-9 12-4-3 6-8-3-5z',
    3: 'M24 6c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm-8 13h16l-2 9-4-2v14h-4V26l-4 2z',
  }
  return (
    <svg
      viewBox="0 0 64 64"
      className={`pointer-events-none select-none opacity-[0.06] dark:opacity-[0.08] ${className}`}
      fill="currentColor"
    >
      <path d={paths[variant]} />
    </svg>
  )
}
