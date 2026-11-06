import { MapPin, Plus, Route, ShieldCheck, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SchematicMap } from '../components/schematic-map';
import {
  Button,
  Card,
  ChipGroup,
  EmptyState,
  Field,
  ListRow,
  Modal,
  Notice,
  PageHead,
} from '../components/ui';
import { fieldStyles } from '../components/ui-styles';
import { useDemo } from '../hooks/use-demo';
import type { DemoGeoPoint, GeoLayer } from '../types/models';
import styles from './pages.module.css';

const LAYER_LABEL: Record<GeoLayer, string> = {
  rutas: 'Rutas',
  lugares: 'Lugares',
  senales: 'Señales',
};

/** A05 · Maps and reference points. The map is schematic; the catalog is editable in memory. */
export function LocationsPage() {
  const { geoPoints, addGeoPoint, removeGeoPoint } = useDemo();
  const [layer, setLayer] = useState<GeoLayer>('rutas');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<DemoGeoPoint | null>(null);

  const points = useMemo(() => geoPoints.filter((point) => point.layer === layer), [geoPoints, layer]);
  const selected = geoPoints.find((point) => point.id === selectedId) ?? null;

  return (
    <div className={styles.stack}>
      <PageHead title="Mapas y referencias" subtitle="Datos geográficos del bosque" />

      <div className={styles.toolbar}>
        <ChipGroup
          label="Capa geográfica"
          value={layer}
          onChange={(value) => {
            setLayer(value);
            setSelectedId(null);
          }}
          options={[
            { value: 'rutas', label: 'Rutas' },
            { value: 'lugares', label: 'Lugares' },
            { value: 'senales', label: 'Señales' },
          ]}
          extra={
            <Button icon={<Plus size={18} aria-hidden />} onClick={() => setCreating(true)}>
              Añadir punto
            </Button>
          }
        />
      </div>

      <Card>
        <SchematicMap
          points={points}
          selectedId={selectedId}
          onSelect={(point) => setSelectedId(point.id)}
          layerLabel="Rutas · Lugares · Señales"
        />
      </Card>

      <div className={styles.splitGrid}>
        <Card>
          <h2 className={styles.sectionTitle}>Capas geográficas</h2>
          <div className={styles.layerLegend}>
            <span className={styles.layerItem}>
              <Route size={19} color="var(--admin)" aria-hidden /> Rutas
            </span>
            <span className={styles.layerItem}>
              <MapPin size={19} color="var(--danger)" aria-hidden /> Kits médicos
            </span>
            <span className={styles.layerItem}>
              <ShieldCheck size={19} color="var(--info)" aria-hidden /> Señales
            </span>
          </div>
          <p className={styles.mutedSmall}>
            Datos de ejemplo · requerirán revisión y publicación.
          </p>

          <div style={{ marginTop: 'var(--space-lg)' }}>
            {points.length === 0 ? (
              <EmptyState
                icon={<MapPin size={32} />}
                title={`Sin ${LAYER_LABEL[layer].toLocaleLowerCase('es-MX')} en el catálogo`}
                body="Añade un punto de demostración para poblar esta capa."
                action={<Button onClick={() => setCreating(true)}>Añadir punto</Button>}
              />
            ) : (
              points.map((point) => (
                <ListRow
                  key={point.id}
                  icon={<MapPin size={19} />}
                  title={point.name}
                  detail={point.detail}
                  right={
                    <div className={styles.inlineActions}>
                      <Button kind="ghost" onClick={() => setSelectedId(point.id)}>
                        Ver
                      </Button>
                      <Button
                        kind="ghost"
                        onClick={() => setConfirmDelete(point)}
                        icon={<Trash2 size={16} aria-hidden />}
                        title={`Retirar ${point.name}`}
                      >
                        Retirar
                      </Button>
                    </div>
                  }
                />
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className={styles.sectionTitle}>Detalle del punto</h2>
          {selected ? (
            <>
              <div className={styles.detailList}>
                <Row label="Nombre" value={selected.name} />
                <Row label="Capa" value={LAYER_LABEL[selected.layer]} />
                <Row label="Estado" value="Pendiente de validar" />
              </div>
              <p className={styles.mutedSmall}>{selected.detail}</p>
            </>
          ) : (
            <p className={styles.muted}>
              Selecciona un marcador del mapa o un punto de la lista para ver su ficha.
            </p>
          )}
        </Card>
      </div>

      <Notice tone="warning">
        El mapa es una ilustración esquemática, no cartografía. Las posiciones son
        aproximadas y no deben usarse para orientarse ni para planear una evacuación.
      </Notice>

      <NewPointModal
        open={creating}
        layer={layer}
        onClose={() => setCreating(false)}
        onCreate={(point) => {
          addGeoPoint(point);
          setCreating(false);
        }}
      />

      <Modal
        open={confirmDelete !== null}
        title="¿Retirar el punto del catálogo?"
        description={
          confirmDelete
            ? `«${confirmDelete.name}» se quitará de los datos de demostración en memoria.`
            : undefined
        }
        onClose={() => setConfirmDelete(null)}
        actions={
          <>
            <Button kind="secondary" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button
              kind="danger"
              onClick={() => {
                if (confirmDelete) removeGeoPoint(confirmDelete.id);
                setSelectedId(null);
                setConfirmDelete(null);
              }}
            >
              Retirar punto
            </Button>
          </>
        }
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailKey}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function NewPointModal({
  open,
  layer,
  onClose,
  onCreate,
}: {
  open: boolean;
  layer: GeoLayer;
  onClose: () => void;
  onCreate: (point: DemoGeoPoint) => void;
}) {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const nameError = touched && name.trim().length < 3;

  const submit = () => {
    setTouched(true);
    if (name.trim().length < 3) return;
    onCreate({
      id: `${layer}-${Date.now()}`,
      name: name.trim(),
      layer,
      detail: 'Punto de muestra · Pendiente de validar',
      x: 0.35 + Math.random() * 0.3,
      y: 0.3 + Math.random() * 0.4,
      isDemo: true,
    });
    setName('');
    setTouched(false);
  };

  return (
    <Modal
      open={open}
      title={`Añadir punto a «${LAYER_LABEL[layer]}»`}
      description="Se crea un registro local, sin coordenadas reales ni publicación."
      onClose={onClose}
      actions={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit}>Añadir punto</Button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field label="Nombre del punto" htmlFor="point-name">
          <input
            id="point-name"
            className={fieldStyles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={nameError}
            placeholder="Ej. Señal M-21"
          />
          {nameError ? (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 6 }}>
              Escribe al menos tres caracteres.
            </p>
          ) : null}
        </Field>
      </div>
    </Modal>
  );
}
