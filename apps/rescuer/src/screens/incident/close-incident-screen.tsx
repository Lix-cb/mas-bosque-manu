import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import { OperationScreen } from '@/components/shell';
import { Button, Card, IconRow, Notice, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { CLOSABLE_STATUSES, STATUS_LABEL } from '@/constants/incident-status';
import { color, iconSize, radius, space } from '@/constants/theme';

/**
 * R07 · Close incident. Closing needs an explicit confirmation and is only allowed
 * from "En sitio" or "Evacuado". Offline, the close stays pending and the app goes to R08.
 */
export default function CloseIncidentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIncident, advanceIncident } = useDemo();
  const incident = getIncident(id);
  const [confirming, setConfirming] = useState(false);

  if (!incident) {
    return (
      <OperationScreen title="Cerrar incidente">
        <Notice tone="warning">Este incidente no existe en los datos de demostración.</Notice>
        <Button
          label="Volver a las alertas"
          onPress={() => router.replace('/(tabs)/alertas')}
          style={styles.action}
        />
      </OperationScreen>
    );
  }

  const canClose = CLOSABLE_STATUSES.includes(incident.status);

  const confirmClose = () => {
    setConfirming(false);
    const confirmed = advanceIncident(incident.id, 'cerrado', 'Cierre de demostración');
    router.replace(confirmed ? '/(tabs)/alertas' : '/sin-conexion');
  };

  return (
    <OperationScreen title="Cerrar incidente">
      <Card tone="success">
        <Feather name="flag" size={iconSize.md} color={color.success} />
        <Txt variant="section" tone="success" style={styles.headline}>
          Finalizar atención
        </Txt>
        <Txt variant="support" style={styles.headlineBody}>
          Cierra el caso solo después de completar el procedimiento.
        </Txt>
      </Card>

      <Card style={styles.summary}>
        <IconRow
          icon="file-text"
          title="Incidente"
          detail={`${incident.id} · ${STATUS_LABEL[incident.status]}`}
        />
        <IconRow
          icon="check-circle"
          title="Resultado"
          detail={
            incident.status === 'en_sitio'
              ? 'Atención en sitio, sin traslado (demostración)'
              : 'Evacuación completada (demostración)'
          }
          tone="success"
        />
        <IconRow icon="info" title="Notas finales" detail="Resumen de acciones realizadas" />
      </Card>

      <Notice tone="warning" style={styles.notice}>
        El cierre requiere confirmación del servidor.
      </Notice>

      <Button
        label="Confirmar cierre"
        onPress={() => setConfirming(true)}
        disabled={!canClose}
        disabledHint={
          incident.status === 'cerrado'
            ? 'Este incidente ya está cerrado.'
            : 'El cierre se habilita cuando el incidente llega a "En sitio" o "Evacuado".'
        }
        fullWidth={false}
        style={styles.action}
      />
      <Button
        label="Cancelar"
        kind="ghost"
        fullWidth={false}
        onPress={() => router.replace(`/incidente/${incident.id}/seguimiento`)}
        style={styles.actionGap}
      />

      <Modal
        visible={confirming}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirming(false)}
      >
        <Pressable
          style={styles.backdrop}
          accessibilityLabel="Cerrar el diálogo"
          accessibilityRole="button"
          onPress={() => setConfirming(false)}
        >
          <Pressable style={styles.dialog} onPress={() => undefined}>
            <Txt variant="section" tone="textPrimary">
              ¿Cerrar {incident.id}?
            </Txt>
            <Txt variant="support" style={styles.dialogBody}>
              En la demostración el caso pasará a «Cerrado». En una versión real esta
              transición tendría que autorizarla el servidor.
            </Txt>
            <Button label="Sí, cerrar el caso" onPress={confirmClose} style={styles.dialogAction} />
            <Button
              label="Volver"
              kind="secondary"
              onPress={() => setConfirming(false)}
              style={styles.dialogActionGap}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </OperationScreen>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: 10 },
  headlineBody: { marginTop: 6 },
  summary: { marginTop: space.md },
  notice: { marginTop: space.md },
  action: { marginTop: space.md },
  actionGap: { marginTop: 8 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 45, 88, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  dialogBody: { marginTop: 10 },
  dialogAction: { marginTop: space.lg },
  dialogActionGap: { marginTop: 10 },
});
