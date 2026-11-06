import { Inbox, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  ChipGroup,
  EmptyState,
  Field,
  Modal,
  Notice,
  PageHead,
  Tag,
} from '../components/ui';
import { fieldStyles, tableStyles } from '../components/ui-styles';
import { OPEN_STATUSES, STATUS_LABEL, statusTone } from '../constants/incident-status';
import { useDemo } from '../hooks/use-demo';
import type { DemoIncident, IncidentCategory } from '../types/models';
import styles from './pages.module.css';

type Filter = 'todos' | 'activos' | 'cerrados';

/**
 * A03 · Incident management: table, filters and search over local data.
 * "Nuevo reporte" creates a demo record in memory.
 */
export function IncidentsPage() {
  const navigate = useNavigate();
  const { visibleIncidents, addIncident, scenario } = useDemo();
  const [filter, setFilter] = useState<Filter>('todos');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => {
    const byFilter = visibleIncidents.filter((incident) => {
      if (filter === 'activos') return OPEN_STATUSES.includes(incident.status);
      if (filter === 'cerrados') return incident.status === 'cerrado';
      return true;
    });
    const needle = normalize(query);
    if (!needle) return byFilter;
    return byFilter.filter((incident) =>
      [incident.id, incident.category, incident.zone, incident.title].some((field) =>
        normalize(field).includes(needle),
      ),
    );
  }, [filter, query, visibleIncidents]);

  const highlight = visibleIncidents.find((incident) => incident.status === 'recibido') ?? null;

  return (
    <div className={styles.stack}>
      <PageHead title="Gestión de incidentes" subtitle="Seguimiento de solicitudes recibidas" />

      <div className={styles.toolbar}>
        <ChipGroup
          label="Filtrar incidentes"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'activos', label: 'Activos' },
            { value: 'cerrados', label: 'Cerrados' },
          ]}
          extra={
            <Button icon={<Plus size={18} aria-hidden />} onClick={() => setCreating(true)}>
              Nuevo reporte
            </Button>
          }
        />
        <div className={styles.toolbarSpacer} />
        <div className={styles.searchBox}>
          <Search size={17} color="var(--text-muted)" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por ID, categoría o zona"
            aria-label="Buscar incidentes en la tabla"
          />
        </div>
      </div>

      <Card flush>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Inbox size={36} />}
            title={scenario === 'sin-datos' ? 'Sin datos de demostración' : 'Sin coincidencias'}
            body={
              scenario === 'sin-datos'
                ? 'El escenario activo no carga incidentes. Cámbialo en Configuración.'
                : 'Ningún incidente de demostración coincide con el filtro o la búsqueda. No es un fallo de conexión.'
            }
            action={
              query ? (
                <Button kind="secondary" onClick={() => setQuery('')}>
                  Limpiar búsqueda
                </Button>
              ) : (
                <Button kind="secondary" onClick={() => setFilter('todos')}>
                  Ver todos
                </Button>
              )
            }
          />
        ) : (
          <div className={tableStyles.wrapper}>
            <table className={tableStyles.table}>
              <caption className="sr-only">
                Incidentes de demostración, {rows.length} registros
              </caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Zona</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <button
                        type="button"
                        className={tableStyles.rowButton}
                        onClick={() => navigate(`/incidentes/${incident.id}`)}
                      >
                        {incident.id}
                      </button>
                    </td>
                    <td>{incident.category}</td>
                    <td>
                      <Tag tone={statusTone[incident.status]}>{STATUS_LABEL[incident.status]}</Tag>
                    </td>
                    <td>{incident.zone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {highlight ? (
        <div className={styles.highlight}>
          <h2 className={styles.highlightTitle}>{highlight.id} · Atención pendiente</h2>
          <p className={styles.highlightBody}>
            {highlight.title} ·{' '}
            {highlight.assignedTeamId ? 'Rescatista asignado' : 'Rescatista no asignado'}
          </p>
          <div className={styles.highlightActions}>
            <Button kind="secondary" onClick={() => navigate(`/incidentes/${highlight.id}`)}>
              Ver detalle
            </Button>
            <Button kind="secondary" onClick={() => navigate(`/incidentes/${highlight.id}`)}>
              Asignar
            </Button>
            <Button kind="secondary" onClick={() => navigate(`/incidentes/${highlight.id}`)}>
              Actualizar
            </Button>
          </div>
        </div>
      ) : null}

      <Notice tone="admin">
        Los cambios se guardan únicamente en memoria. Una versión real exigiría
        autorización del servidor y registro de auditoría.
      </Notice>

      <NewIncidentModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={(incident) => {
          addIncident(incident);
          setCreating(false);
        }}
        nextId={nextIncidentId(visibleIncidents)}
      />
    </div>
  );
}

function NewIncidentModal({
  open,
  onClose,
  onCreate,
  nextId,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (incident: DemoIncident) => void;
  nextId: string;
}) {
  const [title, setTitle] = useState('');
  const [zone, setZone] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Lesión');
  const [touched, setTouched] = useState(false);

  const titleError = touched && title.trim().length < 3;

  const submit = () => {
    setTouched(true);
    if (title.trim().length < 3) return;
    onCreate({
      id: nextId,
      category,
      status: 'nueva',
      priority: 'media',
      zone: zone.trim() || 'Zona de muestra',
      title: title.trim(),
      description: 'Registro creado desde el panel de demostración.',
      receivedAt: '12:00',
      assignedTeamId: null,
      isDemo: true,
    });
    setTitle('');
    setZone('');
    setTouched(false);
  };

  return (
    <Modal
      open={open}
      title="Nuevo reporte de demostración"
      description={`Se creará ${nextId} como registro local. No se envía a ningún servidor.`}
      onClose={onClose}
      actions={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit}>Crear registro</Button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field label="Título" htmlFor="new-incident-title">
          <input
            id="new-incident-title"
            className={fieldStyles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={titleError}
            placeholder="Ej. Caída reportada en el sendero"
          />
          {titleError ? (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 6 }}>
              Escribe al menos tres caracteres.
            </p>
          ) : null}
        </Field>

        <Field label="Zona" htmlFor="new-incident-zone">
          <input
            id="new-incident-zone"
            className={fieldStyles.input}
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            placeholder="Ej. Sendero La Mesa"
          />
        </Field>

        <Field label="Categoría" htmlFor="new-incident-category">
          <select
            id="new-incident-category"
            className={fieldStyles.select}
            value={category}
            onChange={(event) => setCategory(event.target.value as IncidentCategory)}
          >
            {(['Lesión', 'Caída', 'Consulta', 'Rescate', 'Otro'] as IncidentCategory[]).map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ),
            )}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function nextIncidentId(incidents: DemoIncident[]): string {
  const numbers = incidents
    .map((incident) => Number.parseInt(incident.id.replace('MBM-', ''), 10))
    .filter((value) => Number.isFinite(value));
  const next = (numbers.length > 0 ? Math.max(...numbers) : 250) + 1;
  return `MBM-${next.toString().padStart(4, '0')}`;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .trim();
}
