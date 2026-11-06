import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { IncidentMap } from '@/components/incident-parts';
import { OperationScreen } from '@/components/shell';
import { Button, Card, Notice, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { color, iconSize, space } from '@/constants/theme';

/** R04 · Incident map. The path is illustrative: no map SDK and no GPS navigation. */
export default function IncidentMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIncident } = useDemo();
  const incident = getIncident(id);

  return (
    <OperationScreen title="Navegación">
      <IncidentMap />

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
        {incident ? (
          <Txt variant="support" style={styles.legendHint}>
            {incident.id} · {incident.zoneLabel}
          </Txt>
        ) : null}
      </Card>

      <Notice tone="warning" style={styles.notice}>
        Ruta ilustrativa; verificar acceso y terreno antes del traslado.
      </Notice>

      <Button
        label="Volver al incidente"
        fullWidth={false}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(`/incidente/${id}`))}
        style={styles.action}
      />
    </OperationScreen>
  );
}

const styles = StyleSheet.create({
  legend: { marginTop: space.md },
  legendRow: { flexDirection: 'row', gap: space.lg, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendHint: { marginTop: 10 },
  notice: { marginTop: space.md },
  action: { marginTop: space.md },
});
