import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IncidentCard } from '@/components/incident-parts';
import { OperationScreen, ShieldGlyph } from '@/components/shell';
import { Button, Card, Notice, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { color, minTouchTarget, radius, space } from '@/constants/theme';

type Filter = 'activas' | 'todas' | 'cerradas';

const CLOSED: string[] = ['cerrado'];

/**
 * R02 · Active alerts, and R09 · No alerts.
 * An empty inbox (R09) is a different state from a sync failure (R08): being
 * offline does not mean there are no emergencies.
 */
export default function AlertsScreen() {
  const { incidents, inboxEmpty, sync } = useDemo();
  const [filter, setFilter] = useState<Filter>('activas');

  const visible = useMemo(() => {
    if (inboxEmpty) return [];
    if (filter === 'todas') return incidents;
    if (filter === 'cerradas') return incidents.filter((i) => CLOSED.includes(i.status));
    return incidents.filter((i) => !CLOSED.includes(i.status));
  }, [filter, incidents, inboxEmpty]);

  const activeCount = inboxEmpty ? 0 : incidents.filter((i) => !CLOSED.includes(i.status)).length;
  const unassigned = inboxEmpty ? 0 : incidents.filter((i) => !i.assignedTeamId && !CLOSED.includes(i.status)).length;

  if (inboxEmpty) return <EmptyInbox />;

  return (
    <OperationScreen title="Alertas activas">
      <Card tone="soft">
        <View style={styles.countRow}>
          <Txt variant="section" tone="textPrimary">
            {activeCount} alertas activas
          </Txt>
          <Txt variant="section" tone="textMuted">
            •
          </Txt>
          <Txt variant="section" tone="textPrimary">
            {unassigned} sin asignar
          </Txt>
        </View>
        <Txt variant="support" style={styles.countHint}>
          Datos simulados · última consulta 10:24
        </Txt>
      </Card>

      <View style={styles.filters}>
        {(['activas', 'todas', 'cerradas'] as Filter[]).map((option) => {
          const selected = option === filter;
          return (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Filtrar: ${option}`}
              style={({ pressed }) => [
                styles.filter,
                selected ? styles.filterSelected : styles.filterIdle,
                pressed && styles.pressed,
              ]}
            >
              <Txt
                variant="bodyStrong"
                style={selected ? styles.filterLabelSelected : styles.filterLabelIdle}
              >
                {option[0].toLocaleUpperCase('es-MX') + option.slice(1)}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      {sync === 'sin_conexion' ? (
        <Notice tone="warning" style={styles.syncNotice}>
          La lista procede de la copia local. La central no ha confirmado consultas
          recientes.
        </Notice>
      ) : null}

      {visible.length === 0 ? (
        <Card style={styles.noResults}>
          <Txt variant="subtitle" tone="textPrimary">
            Sin resultados en este filtro
          </Txt>
          <Txt variant="support" style={styles.noResultsBody}>
            No hay incidentes de demostración para «{filter}». Cambia de filtro para ver
            los demás.
          </Txt>
          <Button
            label="Ver todas"
            kind="secondary"
            onPress={() => setFilter('todas')}
            style={styles.noResultsAction}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {visible.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onPress={() => router.push(`/incidente/${incident.id}`)}
            />
          ))}
        </View>
      )}
    </OperationScreen>
  );
}

/** R09: empty inbox. */
function EmptyInbox() {
  const { setInboxEmpty, sync } = useDemo();
  return (
    <OperationScreen title="Sin alertas">
      <Card tone="soft" style={styles.emptyCard}>
        <ShieldGlyph size={34} tint={color.primary} />
        <Txt variant="title" tone="textPrimary" style={styles.emptyTitle}>
          Todo tranquilo por ahora
        </Txt>
        <Txt variant="body" style={styles.emptyBody}>
          No hay alertas activas para tu equipo.
        </Txt>
      </Card>

      <Card style={styles.emptyMeta}>
        <Txt variant="bodyStrong" tone="textPrimary">
          Última consulta
        </Txt>
        <Txt variant="support" style={styles.emptyMetaLine}>
          {sync === 'conectado' ? 'Conectado · revisión confirmada' : 'Sin confirmar · copia local'}
        </Txt>
      </Card>

      <Button
        label="Actualizar alertas"
        onPress={() => setInboxEmpty(false)}
        accessibilityHint="Vuelve a mostrar la bandeja de demostración"
        style={styles.emptyAction}
      />

      <Notice tone="warning" style={styles.emptyNotice}>
        Sin conexión no significa que no existan emergencias.
      </Notice>
    </OperationScreen>
  );
}

const styles = StyleSheet.create({
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  countHint: { marginTop: 6 },
  filters: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  filter: {
    flex: 1,
    minHeight: minTouchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  filterIdle: { backgroundColor: color.surfaceSoft },
  filterSelected: { backgroundColor: color.primary },
  filterLabelIdle: { color: color.primaryDeep },
  filterLabelSelected: { color: color.textOnDark },
  syncNotice: { marginTop: space.md },
  list: { marginTop: space.md, gap: 12 },
  noResults: { marginTop: space.md },
  noResultsBody: { marginTop: 8 },
  noResultsAction: { marginTop: space.md },
  emptyCard: { paddingVertical: space.lg },
  emptyTitle: { marginTop: space.md },
  emptyBody: { marginTop: 8 },
  emptyMeta: { marginTop: space.md },
  emptyMetaLine: { marginTop: 4 },
  emptyAction: { marginTop: space.md },
  emptyNotice: { marginTop: space.md },
  pressed: { opacity: 0.8 },
});
