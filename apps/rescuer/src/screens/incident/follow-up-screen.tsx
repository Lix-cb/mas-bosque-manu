import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { IncidentTimeline } from '@/components/incident-parts';
import { OperationScreen } from '@/components/shell';
import { Button, Card, Notice, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { CLOSABLE_STATUSES, STATUS_LABEL } from '@/constants/incident-status';
import { LAST_CONFIRMED_UPDATE } from '@/data/fixtures';
import type { IncidentStatus } from '@/types/models';
import { color, space } from '@/constants/theme';

/** R06 · Follow-up. Links to R05 (update), R04 (map) and R07 (close). */
export default function FollowUpScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIncident, allowedNextStatuses } = useDemo();
  const incident = getIncident(id);

  if (!incident) {
    return (
      <OperationScreen title="Seguimiento">
        <Notice tone="warning">Este incidente no existe en los datos de demostración.</Notice>
        <Button
          label="Volver a las alertas"
          onPress={() => router.replace('/(tabs)/alertas')}
          style={styles.action}
        />
      </OperationScreen>
    );
  }

  const lastEvent = incident.history[incident.history.length - 1];
  const next = allowedNextStatuses(incident)[0];
  const canClose = CLOSABLE_STATUSES.includes(incident.status);

  return (
    <OperationScreen title="Seguimiento">
      <Card tone="success">
        <Txt variant="section" tone="success">
          {incident.id} · {statusHeadline(incident.status)}
        </Txt>
        <Txt variant="support" style={styles.cardHint}>
          Última actualización confirmada: {lastEvent?.time ?? LAST_CONFIRMED_UPDATE}
        </Txt>
      </Card>

      <IncidentTimeline
        events={incident.history}
        nextStep={next ? `Registrar ${STATUS_LABEL[next].toLocaleLowerCase('es-MX')}` : undefined}
        style={styles.timeline}
      />

      {incident.notes.length > 0 ? (
        <Card style={styles.notes}>
          <Txt variant="bodyStrong" tone="textPrimary">
            Notas de atención
          </Txt>
          {incident.notes.map((note, index) => (
            <Txt key={`${note}-${index}`} variant="support" style={styles.note}>
              · {note}
            </Txt>
          ))}
        </Card>
      ) : null}

      <Button
        label="Actualizar estado"
        onPress={() => router.push(`/incidente/${incident.id}/estado`)}
        style={styles.action}
      />
      <Button
        label="Ver mapa"
        kind="secondary"
        onPress={() => router.push(`/incidente/${incident.id}/mapa`)}
        style={styles.actionGap}
      />
      <Button
        label="Cerrar incidente"
        kind="secondary"
        onPress={() => router.push(`/incidente/${incident.id}/cierre`)}
        disabled={!canClose}
        disabledHint={
          canClose
            ? undefined
            : 'El cierre se habilita cuando el incidente llega a "En sitio" o "Evacuado".'
        }
        style={styles.actionGap}
      />
    </OperationScreen>
  );
}

function statusHeadline(status: IncidentStatus): string {
  if (status === 'cerrado') return 'Atención cerrada';
  if (status === 'evacuado') return 'Evacuación registrada';
  return 'Atención en progreso';
}

const styles = StyleSheet.create({
  cardHint: { marginTop: 6, color: color.textSecondary },
  timeline: { marginTop: space.md },
  notes: { marginTop: space.md },
  note: { marginTop: 6 },
  action: { marginTop: space.md },
  actionGap: { marginTop: 12 },
});
