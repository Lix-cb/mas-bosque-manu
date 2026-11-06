import type { DemoGeoPoint } from '../types/models';
import styles from './schematic-map.module.css';

/**
 * Schematic map for A05. No map SDK and no projected coordinates: just shapes that
 * follow the mockup, with the "Datos ilustrativos" label drawn on the canvas.
 */
export function SchematicMap({
  points,
  selectedId,
  onSelect,
  layerLabel,
}: {
  points: DemoGeoPoint[];
  selectedId: string | null;
  onSelect: (point: DemoGeoPoint) => void;
  layerLabel: string;
}) {
  return (
    <div className={styles.map}>
      <svg
        viewBox="0 0 600 300"
        preserveAspectRatio="xMidYMid slice"
        className={styles.canvas}
        aria-hidden
      >
        <rect x={0} y={0} width={600} height={300} fill="#D9ECD6" />
        <path d="M0 0 H600 V108 C 470 136, 250 78, 0 116 Z" fill="#C6DFC2" opacity={0.75} />
        <path d="M0 196 C 180 168, 400 224, 600 188 V300 H0 Z" fill="#C6DFC2" opacity={0.6} />
        <path
          d="M-10 104 C 110 78, 210 150, 320 126 S 500 82, 610 108"
          stroke="#FFFFFF"
          strokeWidth={6}
          strokeDasharray="14 12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-10 238 C 140 214, 260 252, 390 222 S 540 182, 610 198"
          stroke="#FFFFFF"
          strokeWidth={6}
          strokeDasharray="14 12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M80 220 C 170 196, 220 160, 290 152 C 380 142, 450 112, 520 62"
          stroke="var(--admin)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={80} cy={220} r={11} fill="#2563EB" />
        <circle cx={290} cy={152} r={11} fill="#146B45" />
        <path
          d="M520 44 c-9 0-16 7-16 16 0 12 16 29 16 29s16-17 16-29c0-9-7-16-16-16Z"
          fill="#D93636"
        />
        <circle cx={520} cy={60} r={5.5} fill="#fff" />
      </svg>

      <span className={styles.layerChip}>{layerLabel}</span>

      {points.map((point) => (
        <button
          key={point.id}
          type="button"
          className={`${styles.pin} ${selectedId === point.id ? styles.pinSelected : ''}`}
          style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
          onClick={() => onSelect(point)}
          aria-pressed={selectedId === point.id}
          aria-label={`${point.name}. ${point.detail}`}
          title={point.name}
        >
          <span className={styles.pinDot} aria-hidden />
        </button>
      ))}

      <span className={styles.disclaimer}>Datos ilustrativos</span>
    </div>
  );
}
