import { Compass, Lock, RotateCw, TriangleAlert, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  ListRow,
  Notice,
  PageHead,
  Tag,
} from '../components/ui';
import { useDemo } from '../hooks/use-demo';
import styles from './pages.module.css';

/** A09 · System error. Offers a way back to the previous section or to A02. */
export function ErrorPage() {
  const navigate = useNavigate();
  const { setScenario } = useDemo();

  const retry = () => {
    setScenario('con-datos');
    navigate('/panel');
  };

  return (
    <div className={styles.stack}>
      <PageHead title="Error del sistema" subtitle="No fue posible completar la acción" />

      <div className={styles.errorPanel}>
        <TriangleAlert size={40} color="var(--danger)" aria-hidden />
        <h2 className={styles.errorTitle}>No se guardaron los cambios</h2>
        <p className={styles.errorBody}>
          La operación no pudo confirmarse. No se ha actualizado el servidor.
        </p>
        <div className={styles.errorAction}>
          <Button icon={<RotateCw size={17} aria-hidden />} onClick={retry}>
            Reintentar
          </Button>
        </div>
        <p className={styles.errorHelp}>
          Si continúa el error, comunícate con el equipo técnico.
        </p>
      </div>

      <Card>
        <ListRow
          icon={<Lock size={19} />}
          title="Permisos insuficientes"
          detail="Tu cuenta no puede realizar esta acción"
          right={<Tag tone="warning">Revisar</Tag>}
        />
        <ListRow
          icon={<Wifi size={19} />}
          title="Servicio temporalmente inaccesible"
          detail="Sin confirmación de guardado"
          right={<Tag tone="danger">Fallo</Tag>}
        />
      </Card>

      <div className={styles.formActions}>
        <Button kind="secondary" onClick={() => navigate(-1)}>
          Volver al módulo anterior
        </Button>
        <Button kind="secondary" onClick={() => navigate('/panel')}>
          Ir al panel general
        </Button>
      </div>

      <Notice tone="warning">
        Este error es una simulación del escenario de demostración. No hay servidor ni
        operación real detrás de él.
      </Notice>
    </div>
  );
}

/** Unknown route inside the panel. */
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.stack}>
      <PageHead title="Página no encontrada" subtitle="Esta ruta no existe en el panel" />
      <Card>
        <ListRow
          icon={<Compass size={19} />}
          title="Ruta sin pantalla asociada"
          detail="Revisa el menú lateral para continuar la demostración."
        />
      </Card>
      <div className={styles.formActions}>
        <Button onClick={() => navigate('/panel')}>Ir al panel general</Button>
      </div>
    </div>
  );
}
