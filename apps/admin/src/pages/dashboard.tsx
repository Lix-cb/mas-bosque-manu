import { CheckCircle2, Clock, Inbox, ShieldCheck, TriangleAlert, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { IncidentChart } from '../components/incident-chart';
import {
  Button,
  Card,
  EmptyState,
  Notice,
  PageHead,
  Tag,
} from '../components/ui';
import { useDemo } from '../hooks/use-demo';
import { OPEN_STATUSES } from '../constants/incident-status';
import { monthlyIncidents } from '../data/fixtures';
import type { DemoIncident } from '../types/models';
import styles from './pages.module.css';

/**
 * A02 · Dashboard. KPIs are derived from the same data as the A03 table, so the
 * numbers never contradict each other. Times are sample values, not live data.
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { visibleIncidents, teams, scenario } = useDemo();

  const open = visibleIncidents.filter((incident) => OPEN_STATUSES.includes(incident.status));
  const unassigned = open.filter((incident) => !incident.assignedTeamId);
  const recent = visibleIncidents.slice(0, 2);

  if (scenario === 'sin-datos') {
    return (
      <>
        <PageHead title="Panel general" subtitle="Vista general del sistema" />
        <Card>
          <EmptyState
            icon={<Inbox size={36} />}
            title="Sin datos de demostración"
            body="El escenario activo no carga incidentes. Cámbialo en Configuración para volver a poblar el panel."
            action={<Button onClick={() => navigate('/configuracion')}>Ir a Configuración</Button>}
          />
        </Card>
      </>
    );
  }

  return (
    <div className={styles.stack}>
      <PageHead
        title="Panel general"
        subtitle="Vista general del sistema"
        actions={<Tag tone="info">Demo</Tag>}
      />

      <div className={styles.kpiGrid}>
        <Kpi icon={<TriangleAlert size={18} color="var(--danger)" />} label="Incidentes" value={pad(open.length)} valueColor="var(--danger)" />
        <Kpi icon={<Users size={18} color="var(--success)" />} label="Rescatistas" value={pad(teams.length + 1)} valueColor="var(--success)" />
        <Kpi icon={<Clock size={18} color="var(--warning)" />} label="Pendientes" value={pad(unassigned.length)} valueColor="var(--warning)" />
        <Kpi icon={<ShieldCheck size={18} color="var(--admin)" />} label="Servicios" rule />
      </div>

      <Card>
        <IncidentChart data={monthlyIncidents} />
      </Card>

      <Card>
        <h2 className={styles.sectionTitle}>Actividad reciente</h2>
        {recent.length === 0 ? (
          <p className={styles.muted}>No hay actividad en los datos de demostración.</p>
        ) : (
          recent.map((incident) => (
            <ActivityRow
              key={incident.id}
              incident={incident}
              onOpen={() => navigate(`/incidentes/${incident.id}`)}
            />
          ))
        )}
      </Card>

      <Notice tone="admin">
        Las cifras provienen de los registros locales de demostración. No hay conexión
        con ningún sistema de emergencias ni actualización en vivo.
      </Notice>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  valueColor,
  rule = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  valueColor?: string;
  rule?: boolean;
}) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiHead}>
        {icon}
        {label}
      </div>
      {rule ? (
        <div className={styles.kpiRule} aria-label="Sin dato disponible" />
      ) : (
        <div className={styles.kpiValue} style={{ color: valueColor }}>
          {value}
        </div>
      )}
    </div>
  );
}

function ActivityRow({ incident, onOpen }: { incident: DemoIncident; onOpen: () => void }) {
  const closed = incident.status === 'cerrado';
  return (
    <button type="button" className={styles.activityRow} onClick={onOpen}>
      <span
        className={styles.activityIcon}
        style={{ background: closed ? 'var(--success-surface)' : 'var(--danger-surface)' }}
        aria-hidden
      >
        {closed ? (
          <CheckCircle2 size={20} color="var(--success)" />
        ) : (
          <TriangleAlert size={20} color="var(--danger)" />
        )}
      </span>
      <span className={styles.activityText}>
        <span className={styles.activityTitle}>
          {incident.id} · {incident.category}
        </span>
        <span className={styles.activityMeta}>
          {labelFor(incident)} {incident.receivedAt}
        </span>
      </span>
      {closed ? <Tag tone="success">En curso</Tag> : <Tag tone="danger">{incident.priority}</Tag>}
    </button>
  );
}

function labelFor(incident: DemoIncident): string {
  if (incident.status === 'cerrado') return 'Despachado';
  return 'Recibido';
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}
