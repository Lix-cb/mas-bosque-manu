import { useState } from 'react';

import type { MonthlyPoint } from '../types/models';
import { Button, Tag } from './ui';
import styles from './incident-chart.module.css';

/**
 * "Incidentes por periodo" bar chart (A02 and A07).
 *
 * A single series, so the title names it and there is no legend. Bar shade encodes
 * magnitude (light to dark purple), as in the mockup. The lightest shade is below
 * 3:1 contrast, so the "Ver tabla" view gives the exact values without relying on
 * color.
 */

const RAMP = ['#B6A9EC', '#8E77D9', '#6437B5'] as const;

export function IncidentChart({
  data,
  title = 'Incidentes por periodo',
  showDemoTag = true,
}: {
  data: MonthlyPoint[];
  title?: string;
  showDemoTag?: boolean;
}) {
  const [showTable, setShowTable] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const max = Math.max(...data.map((point) => point.value), 1);
  const toneFor = (value: number) => {
    const ratio = value / max;
    if (ratio >= 0.78) return RAMP[2];
    if (ratio >= 0.5) return RAMP[1];
    return RAMP[0];
  };

  return (
    <div>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {showDemoTag ? <Tag tone="info">Demo</Tag> : null}
        <Button kind="ghost" onClick={() => setShowTable((value) => !value)}>
          {showTable ? 'Ver gráfico' : 'Ver tabla'}
        </Button>
      </div>

      {showTable ? (
        <table className={styles.table}>
          <caption className="sr-only">{title}, datos de demostración</caption>
          <thead>
            <tr>
              <th scope="col">Mes</th>
              <th scope="col">Incidentes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.label}>
                <th scope="row">
                  <span className={styles.swatch} style={{ background: toneFor(point.value) }} aria-hidden />
                  {point.label}
                </th>
                <td>{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.plot}>
            {data.map((point) => {
              const height = Math.max((point.value / max) * 100, 6);
              return (
                <button
                  key={point.label}
                  type="button"
                  className={styles.column}
                  onMouseEnter={() => setHovered(point.label)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(point.label)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${point.label}: ${point.value} incidentes de demostración`}
                >
                  {hovered === point.label ? (
                    <span className={styles.tooltip} role="tooltip">
                      {point.label} · {point.value} incidentes
                    </span>
                  ) : null}
                  <span
                    className={styles.bar}
                    style={{ height: `${height}%`, background: toneFor(point.value) }}
                    aria-hidden
                  />
                  <span className={styles.axisLabel}>{point.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className={styles.footnote}>
        Serie de demostración. El tono indica la magnitud; los valores exactos están en
        la vista de tabla.
      </p>
    </div>
  );
}
