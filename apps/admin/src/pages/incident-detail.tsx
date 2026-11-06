import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  Notice,
  PageHead,
  Tag,
} from '../components/ui';
import { fieldStyles } from '../components/ui-styles';
import { STATUS_LABEL, statusTone } from '../constants/incident-status';
import { useDemo } from '../hooks/use-demo';
import type { IncidentStatus } from '../types/models';

import styles from './pages.module.css';

const STATUS_OPTIONS: IncidentStatus[] = [
  'nueva',
  'recibido',
  'despachado',
  'en_sitio',
  'evacuado',
  'cerrado',
];

/**
 * A03 · Incident detail (a side panel in the mockup, its own page here).
 * Status changes ask for confirmation, and every change stays in memory.
 */
export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  // Remount per incident so the form state starts from that incident's data.
  return <IncidentDetail key={id} id={id} />;
}

function IncidentDetail({ id }: { id: string | undefined }) {
  const navigate = useNavigate();
  const { incidents, teams, updateIncidentStatus, assignIncident } = useDemo();
  const incident = incidents.find((item) => item.id === id);

  const [pendingStatus, setPendingStatus] = useState<IncidentStatus | null>(null);
  const [teamId, setTeamId] = useState<string>(incident?.assignedTeamId ?? '');

  if (!incident) {
    return (
      <Card>
        <EmptyState
          icon={<ArrowLeft size={34} />}
          title="Incidente no encontrado"
          body="Este identificador no existe en los datos de demostración."
          action={<Button onClick={() => navigate('/incidentes')}>Volver a la tabla</Button>}
        />
      </Card>
    );
  }

  const team = teams.find((item) => item.id === incident.assignedTeamId) ?? null;

  return (
    <div className={styles.stack}>
      <PageHead
        title={`${incident.id} · ${incident.title}`}
        subtitle={`Recibido ${incident.receivedAt} · Información preliminar`}
        actions={
          <div className={styles.pageActions}>
            <Tag tone={statusTone[incident.status]}>{STATUS_LABEL[incident.status]}</Tag>
            <Button kind="secondary" icon={<ArrowLeft size={17} aria-hidden />} onClick={() => navigate('/incidentes')}>
              Volver
            </Button>
          </div>
        }
      />

      <div className={styles.splitGrid}>
        <Card>
          <h2 className={styles.sectionTitle}>Información del registro</h2>
          <div className={styles.detailList}>
            <Detail label="Categoría" value={incident.category} />
            <Detail label="Prioridad" value={capitalize(incident.priority)} />
            <Detail label="Zona reportada" value={incident.zone} />
            <Detail label="Hora de recepción" value={incident.receivedAt} />
            <Detail label="Equipo asignado" value={team ? team.name : 'Sin asignar'} />
          </div>
          <p className={styles.mutedSmall}>{incident.description}</p>
        </Card>

        <Card>
          <h2 className={styles.sectionTitle}>Acciones de demostración</h2>

          <div className={styles.formGrid}>
            <Field label="Cambiar estado" htmlFor="incident-status">
              <select
                id="incident-status"
                className={fieldStyles.select}
                value={incident.status}
                onChange={(event) => setPendingStatus(event.target.value as IncidentStatus)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {STATUS_LABEL[option]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Asignar equipo" htmlFor="incident-team">
              <select
                id="incident-team"
                className={fieldStyles.select}
                value={teamId}
                onChange={(event) => setTeamId(event.target.value)}
              >
                <option value="">Sin asignar</option>
                {teams.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className={styles.formActions}>
            <Button onClick={() => assignIncident(incident.id, teamId || null)}>
              Guardar asignación
            </Button>
            <Button kind="secondary" onClick={() => navigate('/rescatistas')}>
              Ver rescatistas
            </Button>
          </div>
        </Card>
      </div>

      <Notice tone="warning">
        Estos controles modifican únicamente los datos locales. En una versión real, cada
        transición requeriría autorización del servidor y quedaría auditada.
      </Notice>

      <Modal
        open={pendingStatus !== null}
        title="¿Cambiar el estado del incidente?"
        description={
          pendingStatus
            ? `${incident.id} pasará a «${STATUS_LABEL[pendingStatus]}» en la demostración local.`
            : undefined
        }
        onClose={() => setPendingStatus(null)}
        actions={
          <>
            <Button kind="secondary" onClick={() => setPendingStatus(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (pendingStatus) updateIncidentStatus(incident.id, pendingStatus);
                setPendingStatus(null);
              }}
            >
              Confirmar cambio
            </Button>
          </>
        }
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailKey}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase('es-MX') + value.slice(1);
}
