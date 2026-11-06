import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { OperationScreen } from '@/components/shell';
import { Button, Card, IconRow, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { STATUS_LABEL } from '@/constants/incident-status';
import { color, space } from '@/constants/theme';

/**
 * R08 · Offline. Pending changes are listed as unconfirmed. Retrying only applies
 * them when the simulated network is back; it never fakes an acknowledgement.
 */
export default function OfflineScreen() {
  const { pending, sync, setSync, retrySync } = useDemo();
  const showPending = pending.length > 0;
  const lastIncidentId = pending[pending.length - 1]?.incidentId;

  const retry = () => {
    const applied = retrySync();
    if (applied) router.replace('/(tabs)/alertas');
  };

  return (
    <OperationScreen title="Sin conexión">
      <Card tone="danger">
        <StruckWifi />
        <Txt variant="title" tone="danger" style={styles.title}>
          Sin conexión al servidor
        </Txt>
        <Txt variant="body" style={styles.body}>
          La central NO ha confirmado estos cambios.
        </Txt>
      </Card>

      <Card style={styles.pending}>
        <IconRow
          icon="clock"
          title={`${pending.length} ${pending.length === 1 ? 'cambio pendiente' : 'cambios pendientes'}`}
          detail="Guardado únicamente en el teléfono"
        />
        <Txt variant="bodyStrong" tone="danger" style={styles.pendingWarning}>
          No equivale a una actualización recibida.
        </Txt>
      </Card>

      {showPending ? (
        <Card style={styles.list}>
          <Txt variant="bodyStrong" tone="textPrimary">
            Cambios en espera
          </Txt>
          {pending.map((change) => (
            <Txt key={change.id} variant="support" style={styles.listItem}>
              {change.incidentId} → {STATUS_LABEL[change.status]} · {change.createdAt}
            </Txt>
          ))}
        </Card>
      ) : null}

      <Button
        label="Reintentar conexión"
        onPress={retry}
        fullWidth={false}
        style={styles.action}
        accessibilityHint="Aplica los cambios pendientes sólo si el escenario tiene red simulada"
      />
      <Button
        label={sync === 'sin_conexion' ? 'Restablecer la red simulada' : 'Cortar la red simulada'}
        kind="secondary"
        fullWidth={false}
        onPress={() => setSync(sync === 'sin_conexion' ? 'conectado' : 'sin_conexion')}
        style={styles.actionGap}
      />
      <Button
        label={lastIncidentId ? 'Regresar al incidente' : 'Regresar a las alertas'}
        kind="ghost"
        fullWidth={false}
        onPress={() =>
          router.replace(lastIncidentId ? `/incidente/${lastIncidentId}` : '/(tabs)/alertas')
        }
        style={styles.actionGap}
      />

      <Card tone="soft" style={styles.footer}>
        <Txt variant="support" tone="primaryDeep">
          El envío solo se confirma cuando existe acuse del sistema central.
        </Txt>
      </Card>
    </OperationScreen>
  );
}

function StruckWifi() {
  return (
    <View>
      <Svg width={46} height={38} viewBox="0 0 36 30">
        <Path d="M3 10a22 22 0 0 1 30 0" stroke={color.danger} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <Path d="M8.5 16a14 14 0 0 1 19 0" stroke={color.danger} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <Path d="M14 21.5a6.5 6.5 0 0 1 8 0" stroke={color.danger} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <Path d="M3 3 L33 27" stroke={color.danger} strokeWidth={2.6} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 12 },
  body: { marginTop: 8 },
  pending: { marginTop: space.md },
  pendingWarning: { marginTop: 6 },
  list: { marginTop: space.md },
  listItem: { marginTop: 6 },
  action: { marginTop: space.md },
  actionGap: { marginTop: 8 },
  footer: { marginTop: space.md },
});
