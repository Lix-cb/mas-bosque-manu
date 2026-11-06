import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Badge, Notice } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { DEMO_ALERT_ID, DEMO_DATE, STAGE_TIMES } from '@/data/fixtures';
import { color, space } from '@/constants/theme';

/**
 * V10 · Alert received. Only reachable after a (simulated) acknowledgement.
 * Without one, it shows a guard message and links back to the real alert status.
 */
export default function AlertReceivedScreen() {
  const { alert } = useDemo();
  const acknowledged =
    alert != null && ['received', 'mobilized', 'on_site', 'evacuated', 'closed'].includes(alert.stage);

  if (!acknowledged) {
    return (
      <Screen>
        <TopBar title="Confirmación" backTo="/(tabs)/inicio" />
        <Notice tone="warning" style={styles.guard}>
          Todavía no hay un acuse simulado asociado a esta solicitud. Esta pantalla sólo
          puede abrirse después de un acuse.
        </Notice>
        <Button
          label="Ver estado de la alerta"
          onPress={() => router.replace(alert ? '/sos/estado' : '/(tabs)/inicio')}
          style={styles.guardAction}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Confirmación" backTo="/(tabs)/inicio" />

      <View style={styles.markWrapper}>
        <View style={styles.mark}>
          <Feather name="check" size={48} color={color.primary} />
        </View>
      </View>

      <Txt variant="display" center style={styles.title}>
        Alerta recibida
      </Txt>

      <View style={styles.badgeRow}>
        <Badge label="Acuse del backend simulado" tone="success" />
      </View>

      <Card style={styles.card}>
        <Txt variant="section">{alert?.id ?? DEMO_ALERT_ID}</Txt>
        <Txt variant="support" style={styles.cardLine}>
          Acuse: {DEMO_DATE} · {STAGE_TIMES.received}
        </Txt>
        <Txt variant="support">
          Creación: {alert?.createdTime ?? STAGE_TIMES.preparing} · No hay despacho aún.
        </Txt>
      </Card>

      <Txt variant="body" style={styles.body}>
        Mantén la calma y cuida tu batería. Si es seguro, permanece en un lugar
        identificable. Evita desplazarte hacia zonas de riesgo.
      </Txt>

      <Notice tone="warning" style={styles.notice}>
        Confirmación de ejemplo. No hay personal notificado ni rescate real en curso.
      </Notice>

      <Button label="Ver estado" onPress={() => router.push('/sos/estado')} />
      <Button
        label="Ver mapa"
        kind="secondary"
        onPress={() => router.push('/(tabs)/mapa')}
        style={styles.secondary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  guard: { marginTop: space.md },
  guardAction: { marginTop: space.md },
  markWrapper: { alignItems: 'center', marginTop: space.lg },
  mark: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: color.successSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: space.md },
  badgeRow: { alignItems: 'center', marginTop: 12 },
  card: { marginTop: space.md },
  cardLine: { marginTop: 8 },
  body: { marginTop: space.md, color: color.textSecondary },
  notice: { marginTop: space.md, marginBottom: space.md },
  secondary: { marginTop: 12 },
});
