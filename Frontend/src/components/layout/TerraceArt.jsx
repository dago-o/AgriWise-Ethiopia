import { useId } from 'react'

// Deterministic terraced-highland landscape drawn as layered contour bands.
const W = 800
const H = 600

function smoothPath(points) {
  // Catmull-Rom -> cubic Bézier through the points
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1].toFixed(1)}`
  }
  return d
}

const layers = [
  { base: 250, amp: 26, phase: 0.2, fill: '#17382a', line: '#2c5f48' },
  { base: 295, amp: 24, phase: 1.1, fill: '#1c4433', line: '#356e52' },
  { base: 340, amp: 22, phase: 2.0, fill: '#215139', line: '#3d7a58' },
  { base: 385, amp: 22, phase: 0.7, fill: '#2a6034', line: '#5b9a4c' },
  { base: 430, amp: 20, phase: 1.6, fill: '#34702f', line: '#7fb555' },
  { base: 475, amp: 18, phase: 2.6, fill: '#43832f', line: '#a3cd7f' },
  { base: 520, amp: 16, phase: 0.4, fill: '#5a9a37', line: '#c6e1ae' },
  { base: 560, amp: 12, phase: 1.4, fill: '#73ad45', line: '#e2f0d5' },
].map((l) => {
  const pts = []
  for (let x = -40; x <= W + 40; x += 110) {
    pts.push([x, l.base + Math.sin(x / 150 + l.phase) * l.amp + Math.cos(x / 70 + l.phase * 2) * (l.amp / 3)])
  }
  const edge = smoothPath(pts)
  return { ...l, edge, fillPath: `${edge} L ${W + 40} ${H + 10} L -40 ${H + 10} Z` }
})

export function TerraceArt({ className, animate = true }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="xMidYMax slice" role="img" aria-label="Terraced highland fields under a low sun">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1d15" />
          <stop offset="1" stopColor="#17382a" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cfa33f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#cfa33f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky-${uid})`} />
      <circle cx="590" cy="170" r="190" fill={`url(#glow-${uid})`} />
      <circle cx="590" cy="170" r="52" fill="#cfa33f" />
      <circle cx="590" cy="170" r="84" fill="none" stroke="#cfa33f" strokeOpacity="0.28" />
      <circle cx="590" cy="170" r="118" fill="none" stroke="#cfa33f" strokeOpacity="0.14" />
      {layers.map((l, i) => (
        <g key={i}>
          <path d={l.fillPath} fill={l.fill} />
          <path
            d={l.edge}
            fill="none"
            stroke={l.line}
            strokeWidth={i > 4 ? 2.4 : 1.6}
            strokeLinecap="round"
            pathLength="1"
            className={animate ? 'terrace-line' : undefined}
            style={animate ? { animationDelay: `${i * 140}ms` } : undefined}
          />
        </g>
      ))}
    </svg>
  )
}
