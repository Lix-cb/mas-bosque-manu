import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ResponseCycle, statusTone } from '@/components/incident-parts';
import { OperationScreen } from '@/components/shell';
import { Button, Card, Notice, Tag, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { STATUS_LABEL } from '@/constants/incident-status';
import type { IncidentStatus } from '@/types/models';
import { color, radius, space, typography } from '@/constants/theme';

/**
 * R05 · Update status.
 * - Only the next allowed step can be selected.
 * - Offline, the change stays pending and the app goes to R08, because saving it on
 *   the phone does not mean the control center received it.
 */
export default function UpdateStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIncident, allowedNextStatuses, advanceIncident } = useDemo();
  const incident = getIncident(id);

  const allowed = incident ? allowedNextStatuses(incident) : [];
  const [selected, setSelected] = useState<IncidentStatus | null>(allowed[0] ?? null);
  const [note, setNote] = useState('');

  if (!incident) {
    return (
      <OperationScreen title="Actualizar estado">
        <Notice tone="warning">Este incidente no existe en los datos de demostración.</Notice>
        <Button
          label="Volver a las alertas"
          onPress={() => router.replace('/(tabs)/alertas')}
          style={styles.action}
        />
      </OperationScreen>
    );
  }

  const save = () => {
    if (!selected) return;
    const confirmed = advanceIncident(incident.id, selected, note);
    router.replace(confirmed ? `/incidente/${incident.id}/seguimiento` : '/sin-conexion');
  };

  return (
    <OperationScreen title="Actualizar estado">
      <Card tone="soft">
        <Txt variant="section" tone="textPrimary">
          {incident.id}
        </Txt>
        <Tag label={STATUS_LABEL[incident.status]} tone={statusTone[incident.status]} style={styles.tag} />
        <Txt variant="support" style={styles.hint}>
          {allowed.length > 0
            ? 'Selecciona la siguiente etapa permitida.'
            : 'Este incidente ya alcanzó el final del ciclo de demostración.'}
        </Txt>
      </Card>

      <View style={styles.cycle}>
        <ResponseCycle
          incident={incident}
          allowed={allowed}
          selected={selected}
          onSelect={setSelected}
        />
      </View>

      <Card style={styles.notes}>
        <Txt variant="bodyStrong" tone="textPrimary">
          Notas de atención (opcional)
        </Txt>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Añade información operativa sin datos innecesarios."
          placeholderTextColor={color.textMuted}
          multiline
          accessibilityLabel="Notas de atención"
          style={styles.input}
        />
      </Card>

      <Button
        label="Guardar actualización"
        onPress={save}
        fullWidth={false}
        disabled={!selected}
        disabledHint={
          allowed.length === 0 ? 'No hay una etapa siguiente disponible para este incidente.' : undefined
        }
        accessibilityHint="Registra el cambio en la demostración local"
        style={styles.action}
      />
      <Button
        label="Cancelar"
        kind="ghost"
        onPress={() => (router.canGoBack() ? router.back() : router.replace(`/incidente/${id}`))}
        fullWidth={false}
        style={styles.actionGap}
      />
    </OperationScreen>
  );
}

const styles = StyleSheet.create({
  tag: { marginTop: 10 },
  hint: { marginTop: 10 },
  cycle: { marginTop: space.md },
  notes: { marginTop: space.md },
  input: {
    marginTop: 10,
    minHeight: 84,
    textAlignVertical: 'top',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    padding: 12,
    color: color.textBody,
    ...typography.body,
  },
  action: { marginTop: space.md },
  actionGap: { marginTop: 8 },
});
