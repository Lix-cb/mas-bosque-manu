import { CheckCircle2, Clock, Download, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

import { IncidentChart } from '../components/incident-chart';
import {
  Button,
  Card,
  ChipGroup,
  Notice,
  PageHead,
} from '../components/ui';
import { useDemo } from '../hooks/use-demo';
import { monthlyIncidents, reportMetrics } from '../data/fixtures';
import styles from './pages.module.css';

type Range = '30' | '90' | 'anio';

/** A07 · Reports. "Exportar CSV" downloads the sample incidents shown on screen. */
export function ReportsPage() {
  const { visibleIncidents } = useDemo();
  const [range, setRange] = useState<Range>('30');

  const series = useMemo(() => {
    if (range === '30') return monthlyIncidents.slice(-3);
    if (range === '90') return monthlyIncidents.slice(-6);
    return monthlyIncidents;
  }, [range]);

  const exportCsv = () => {
    const header = 'id,categoria,estado,prioridad,zona,recibido\n';
    const rows = visibleIncidents
      .map((incident) =>
        [
          incident.id,
          incident.category,
          incident.status,
          incident.priority,
          incident.zone,
          incident.receivedAt,
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob([`${header}${rows}\n`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mas-bosque-manu-incidentes-demo.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.stack}>
      <PageHead title="Reportes" subtitle="Indicadores de actividad y respuesta" />

      <div className={styles.toolbar}>
        <ChipGroup
          label="Periodo del reporte"
          value={range}
          onChange={setRange}
          options={[
            { value: '30', label: 'Últimos 30 días' },
            { value: '90', label: 'Últimos 90 días' },
            { value: 'anio', label: 'Año en curso' },
          ]}
          extra={
            <Button icon={<Download size={18} aria-hidden />} onClick={exportCsv}>
              Exportar CSV
            </Button>
          }
        />
      </div>

      <div className={styles.kpiGrid}>
        <Metric
          icon={<TriangleAlert size={18} color="var(--admin)" />}
          label="Incidentes"
          value={String(reportMetrics.incidents)}
          color="var(--admin)"
        />
        <Metric
          icon={<Clock size={18} color="var(--info)" />}
          label="Tiempo medio"
          value={reportMetrics.averageResponse}
          color="var(--info)"
        />
        <Metric
          icon={<CheckCircle2 size={18} color="var(--success)" />}
          label="Cerrados"
          value={String(reportMetrics.closed)}
          color="var(--success)"
        />
      </div>

      <Card>
        <IncidentChart data={series} />
      </Card>

      <div className={styles.highlight}>
        <h2 className={styles.highlightTitle}>Métricas de ejemplo</h2>
        <p className={styles.highlightBody}>
          Los tiempos son ilustrativos; se requieren eventos confirmados para calcular
          indicadores reales.
        </p>
      </div>

      <Notice tone="admin">
        La exportación genera un CSV real con los registros de demostración que ves en
        pantalla. No contiene datos de personas ni de incidentes reales.
      </Notice>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiHead}>
        {icon}
        {label}
      </div>
      <div className={styles.kpiValue} style={{ color }}>
        {value}
      </div>
    </div>
  );
}
