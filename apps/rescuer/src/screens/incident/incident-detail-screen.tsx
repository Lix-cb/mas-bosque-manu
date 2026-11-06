import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { priorityTone, statusTone } from '@/components/incident-parts';
import { OperationScreen } from '@/components/shell';
import { Button, Card, IconRow, Notice, Tag, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { STATUS_LABEL } from '@/constants/incident-status';
import { color, space } from '@/constants/theme';

/** R03 · Incident detail. Links to R04 (map), R05 (update status) and R06 (follow-up). */
export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIncident } = useDemo();
  const incident = getIncident(id);

  if (!incident) return <MissingIncident />;

  return (
    <OperationScreen title="Detalle del incidente">
      <Card tone={PRIORITY_CARD_TONE[incident.priority]}>
        <Tag label={`Prioridad ${incident.priority}`} tone={priorityTone[incident.priority]} />
        <Txt variant="title" tone="textPrimary" style={styles.title}>
          {incident.id} · {incident.title}
        </Txt>
        <Txt variant="support" style={styles.subtitle}>
          Recibido {incident.receivedAt} · Información preliminar
        </Txt>
      </Card>

      <Card style={styles.facts}>
        <IconRow icon="map-pin" title="Zona reportada" detail={incident.zoneLabel} />
        <IconRow icon="activity" title="Descripción" detail={incident.description} />
        <IconRow icon="clock" title="Ubicación GPS" detail={incident.gpsLabel} />
      </Card>

      <Card tone="soft" style={styles.note}>
        <Txt variant="support" tone="primaryDeep">
          La posición puede variar bajo vegetación densa.
        </Txt>
      </Card>

      <View style={styles.statusRow}>
        <Txt variant="support">Estado actual:</Txt>
        <Tag label={STATUS_LABEL[incident.status]} tone={statusTone[incident.status]} />
      </View>

      <Button
        label="Ver ubicación en mapa"
        onPress={() => router.push(`/incidente/${incident.id}/mapa`)}
        style={styles.action}
      />
      <Button
        label="Actualizar estado"
        kind="secondary"
        onPress={() => router.push(`/incidente/${incident.id}/estado`)}
        style={styles.actionGap}
      />
      <Button
        label="Ver seguimiento"
        kind="secondary"
        onPress={() => router.push(`/incidente/${incident.id}/seguimiento`)}
        style={styles.actionGap}
      />
      <Button
        label="Regresar a las alertas"
        kind="ghost"
        onPress={() => router.replace('/(tabs)/alertas')}
        style={styles.actionGap}
      />
    </OperationScreen>
  );
}

function MissingIncident() {
  return (
    <OperationScreen title="Incidente no encontrado">
      <Notice tone="warning">
        Este identificador no existe en los datos de demostración. Vuelve a la bandeja
        para elegir otro incidente.
      </Notice>
      <Button
        label="Volver a las alertas"
        onPress={() => router.replace('/(tabs)/alertas')}
        style={styles.action}
      />
    </OperationScreen>
  );
}

const PRIORITY_CARD_TONE = { alta: 'danger', media: 'warning', baja: 'soft' } as const;

const styles = StyleSheet.create({
  title: { marginTop: 12 },
  subtitle: { marginTop: 6, color: color.textSecondary },
  facts: { marginTop: space.md },
  note: { marginTop: space.md },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: space.md },
  action: { marginTop: space.md },
  actionGap: { marginTop: 12 },
});
