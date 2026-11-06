import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IncidentMap, priorityTone } from '@/components/incident-parts';
import { OperationScreen } from '@/components/shell';
import { Button, Card, Notice, Tag, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { color, iconSize, radius, space } from '@/constants/theme';

/** R04 as a tab: the same schematic map, plus a picker for open incidents. */
export default function IncidentsMapScreen() {
  const { incidents } = useDemo();
  const open = incidents.filter((incident) => incident.status !== 'cerrado');
  const [selectedId, setSelectedId] = useState(open[0]?.id ?? null);
  const selected = open.find((incident) => incident.id === selectedId) ?? null;

  return (
    <OperationScreen title="Mapa de incidentes">
      <IncidentMap height={240} />

      <Card style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <Feather name="map-pin" size={iconSize.sm} color={color.danger} />
            <Txt variant="bodyStrong" tone="textPrimary">
              Incidente
            </Txt>
          </View>
          <View style={styles.legendItem}>
            <Feather name="corner-down-right" size={iconSize.sm} color={color.primary} />
            <Txt variant="bodyStrong" tone="textPrimary">
              Ruta sugerida
            </Txt>
          </View>
        </View>
      </Card>

      <Txt variant="section" tone="textPrimary" style={styles.sectionTitle}>
        Incidentes abiertos
      </Txt>

      {open.length === 0 ? (
        <Card>
          <Txt variant="subtitle" tone="textPrimary">
            No hay incidentes abiertos
          </Txt>
          <Txt variant="support" style={styles.emptyBody}>
            Todos los casos de demostración están cerrados.
          </Txt>
        </Card>
      ) : (
        <View style={styles.pins}>
          {open.map((incident) => {
            const isSelected = incident.id === selectedId;
            return (
              <Pressable
                key={incident.id}
                onPress={() => setSelectedId(incident.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Seleccionar ${incident.id}`}
                style={({ pressed }) => [
                  styles.pin,
                  isSelected && styles.pinSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Txt variant="bodyStrong" tone="textPrimary">
                  {incident.id}
                </Txt>
                <Txt variant="support" style={styles.pinSummary}>
                  {incident.zoneLabel}
                </Txt>
                <Tag label={incident.priority} tone={priorityTone[incident.priority]} style={styles.pinTag} />
              </Pressable>
            );
          })}
        </View>
      )}

      <Notice tone="warning" style={styles.notice}>
        Ruta ilustrativa; verificar acceso y terreno antes del traslado.
      </Notice>

      {selected ? (
        <Button
          label={`Abrir ${selected.id}`}
          onPress={() => router.push(`/incidente/${selected.id}`)}
          style={styles.action}
        />
      ) : null}
    </OperationScreen>
  );
}

const styles = StyleSheet.create({
  legend: { marginTop: space.md },
  legendRow: { flexDirection: 'row', gap: space.lg, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { marginTop: space.lg, marginBottom: 12 },
  pins: { gap: 12 },
  pin: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    padding: space.md,
  },
  pinSelected: { borderColor: color.primary, backgroundColor: color.surfaceSoft },
  pinSummary: { marginTop: 4 },
  pinTag: { marginTop: 10 },
  emptyBody: { marginTop: 8 },
  notice: { marginTop: space.md },
  action: { marginTop: space.md },
  pressed: { opacity: 0.8 },
});
