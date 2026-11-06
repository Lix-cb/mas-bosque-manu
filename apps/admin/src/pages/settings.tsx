import { Clock, ShieldCheck, TriangleAlert, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  ChipGroup,
  ListRow,
  Notice,
  PageHead,
  Tag,
  type TagTone,
} from '../components/ui';
import { type AdminScenario } from '../context/demo-context';
import { useDemo } from '../hooks/use-demo';
import { auditEvents } from '../data/fixtures';
import type { DemoServiceState } from '../types/models';
import styles from './pages.module.css';

const ICONS = { shield: ShieldCheck, alert: TriangleAlert, wifi: Wifi };

const STATE_LABEL: Record<DemoServiceState, string> = {
  seguro: 'Seguro',
  demo: 'Demo',
  pendiente: 'Pendiente',
};

const STATE_TONE: Record<DemoServiceState, TagTone> = {
  seguro: 'success',
  demo: 'info',
  pendiente: 'warning',
};

/**
 * A08 · Settings and audit. Also hosts the demo scenarios, so the alternative
 * states (no data, error) can be reached without editing code.
 */
export function SettingsPage() {
  const navigate = useNavigate();
  const { services, scenario, setScenario, resetDemo, signOut } = useDemo();

  return (
    <div className={styles.stack}>
      <PageHead title="Configuración" subtitle="Servicios, permisos y auditoría" />

      <Card>
        <h2 className={styles.sectionTitle}>Servicios y conectividad</h2>
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <ListRow
              key={service.id}
              icon={<Icon size={19} />}
              title={service.name}
              detail={service.detail}
              right={<Tag tone={STATE_TONE[service.state]}>{STATE_LABEL[service.state]}</Tag>}
            />
          );
        })}
      </Card>

      <Card>
        <h2 className={styles.sectionTitle}>Auditoría de actividad</h2>
        {auditEvents.map((event) => (
          <ListRow
            key={event.id}
            icon={<Clock size={19} />}
            title={event.label}
            detail={event.detail}
            right={<Tag tone="info">Auditoría</Tag>}
          />
        ))}
        <p className={styles.mutedSmall}>
          Las acciones reales requerirán permisos y registros persistentes.
        </p>
      </Card>

      <Card>
        <h2 className={styles.sectionTitle}>Escenarios de demostración</h2>
        <p className={styles.muted}>
          Cambia el estado del panel para mostrar los casos alternativos del diseño sin
          tocar el código.
        </p>
        <div style={{ marginTop: 'var(--space-md)' }}>
          <ChipGroup
            label="Escenario del panel"
            value={scenario}
            onChange={(value: AdminScenario) => setScenario(value)}
            options={[
              { value: 'con-datos', label: 'Con datos' },
              { value: 'sin-datos', label: 'Sin datos' },
              { value: 'error', label: 'Error simulado' },
            ]}
          />
        </div>

        <div className={styles.formActions}>
          <Button kind="secondary" onClick={() => navigate('/error')}>
            Abrir pantalla de error (A09)
          </Button>
          <Button kind="secondary" onClick={resetDemo}>
            Restablecer datos de demostración
          </Button>
          <Button
            kind="secondary"
            onClick={() => {
              signOut();
              navigate('/');
            }}
          >
            Cerrar sesión de demostración
          </Button>
        </div>
      </Card>

      <Notice tone="warning">
        No se exponen claves ni parámetros reales de infraestructura. La pantalla de
        acceso es una simulación de experiencia, no un mecanismo de seguridad.
      </Notice>
    </div>
  );
}
