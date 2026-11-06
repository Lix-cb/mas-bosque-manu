import { Plus, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Card,
  Field,
  ListRow,
  Modal,
  Notice,
  PageHead,
  Tag,
  type TagTone,
} from '../components/ui';
import { fieldStyles } from '../components/ui-styles';
import { useDemo } from '../hooks/use-demo';
import type { DemoTeam, TeamAvailability } from '../types/models';
import styles from './pages.module.css';

const AVAILABILITY_LABEL: Record<TeamAvailability, string> = {
  en_linea: 'En línea',
  ocupado: 'Ocupado',
  inactivo: 'Inactivo',
  gestion: 'Gestión',
};

const AVAILABILITY_TONE: Record<TeamAvailability, TagTone> = {
  en_linea: 'success',
  ocupado: 'danger',
  inactivo: 'info',
  gestion: 'info',
};

/** A04 · Rescue teams. Fictional profiles only: no real accounts or personal data. */
export function RescuersPage() {
  const { teams, setTeamAvailability, addTeam } = useDemo();
  const [creating, setCreating] = useState(false);
  const available = teams.filter((team) => team.availability === 'en_linea').length;

  return (
    <div className={styles.stack}>
      <PageHead title="Rescatistas" subtitle="Personal y accesos autorizados" />

      <div className={styles.toolbar}>
        <Button icon={<Plus size={18} aria-hidden />} onClick={() => setCreating(true)}>
          Agregar rescatista
        </Button>
        <Tag tone="success">{`Disponibles ${available}`}</Tag>
      </div>

      <Card>
        <h2 className={styles.sectionTitle}>Equipo de respuesta</h2>
        {teams.map((team) => (
          <ListRow
            key={team.id}
            icon={<Users size={19} />}
            title={team.name}
            detail={`${team.note} · ${team.members} integrantes de muestra`}
            right={
              <div className={styles.inlineActions}>
                <Tag tone={AVAILABILITY_TONE[team.availability]}>
                  {AVAILABILITY_LABEL[team.availability]}
                </Tag>
                <select
                  className={fieldStyles.select}
                  style={{ width: 150, minHeight: 38 }}
                  value={team.availability}
                  onChange={(event) =>
                    setTeamAvailability(team.id, event.target.value as TeamAvailability)
                  }
                  aria-label={`Disponibilidad de ${team.name}`}
                >
                  {(Object.keys(AVAILABILITY_LABEL) as TeamAvailability[]).map((option) => (
                    <option key={option} value={option}>
                      {AVAILABILITY_LABEL[option]}
                    </option>
                  ))}
                </select>
              </div>
            }
          />
        ))}
      </Card>

      <div className={styles.highlight}>
        <h2 className={styles.highlightTitle}>Acceso basado en roles</h2>
        <p className={styles.highlightBody}>
          Solo administradores autorizados pueden crear, editar o desactivar cuentas.
        </p>
      </div>

      <Notice tone="warning">
        Los perfiles son ficticios. En esta fase no existe autenticación, autorización
        por rol ni gestión de credenciales: todo se decide en el navegador.
      </Notice>

      <NewTeamModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={(team) => {
          addTeam(team);
          setCreating(false);
        }}
      />
    </div>
  );
}

function NewTeamModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (team: DemoTeam) => void;
}) {
  const [name, setName] = useState('');
  const [availability, setAvailability] = useState<TeamAvailability>('en_linea');
  const [touched, setTouched] = useState(false);
  const nameError = touched && name.trim().length < 3;

  const submit = () => {
    setTouched(true);
    if (name.trim().length < 3) return;
    onCreate({
      id: `equipo-${Date.now()}`,
      name: name.trim(),
      note: 'Registro creado en la demostración',
      availability,
      members: 2,
      isDemo: true,
    });
    setName('');
    setTouched(false);
  };

  return (
    <Modal
      open={open}
      title="Agregar equipo de demostración"
      description="Se crea un registro ficticio en memoria. No se da de alta ninguna cuenta real."
      onClose={onClose}
      actions={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} icon={<ShieldCheck size={17} aria-hidden />}>
            Crear registro
          </Button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field label="Nombre del equipo" htmlFor="team-name">
          <input
            id="team-name"
            className={fieldStyles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={nameError}
            placeholder="Ej. Equipo Delta"
          />
          {nameError ? (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 6 }}>
              Escribe al menos tres caracteres.
            </p>
          ) : null}
        </Field>

        <Field label="Disponibilidad" htmlFor="team-availability">
          <select
            id="team-availability"
            className={fieldStyles.select}
            value={availability}
            onChange={(event) => setAvailability(event.target.value as TeamAvailability)}
          >
            {(Object.keys(AVAILABILITY_LABEL) as TeamAvailability[]).map((option) => (
              <option key={option} value={option}>
                {AVAILABILITY_LABEL[option]}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}
