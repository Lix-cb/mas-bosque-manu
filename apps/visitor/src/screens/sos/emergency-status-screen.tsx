import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/buttons';
import { Badge, Notice } from '@/components/feedback';
import { CycleList } from '@/components/cycle-list';
import { Screen, TopBar } from '@/components/layout';
import { Txt } from '@/components/typography';
import { stagePresentation } from '@/data/alert-stages';
import { useDemo } from '@/hooks/use-demo';
import { color, space } from '@/constants/theme';

/**
 * V08 · Emergency status, with variants V08-a to V08-g.
 * Stages after "Transmitida" are only reached through the demo scenarios menu,
 * which stands in for a backend event. They never advance with time.
 */
export default function EmergencyStatusScreen() {
  const { alert, transmissionFailed } = useDemo();

  useEffect(() => {
    if (transmissionFailed) router.replace('/sos/error');
  }, [transmissionFailed]);

  useEffect(() => {
    if (!alert) router.replace('/(tabs)/inicio');
  }, [alert]);

  if (!alert) return null;

  const view = stagePresentation(alert.stage);

  return (
    <Screen>
      <TopBar title="Estado de emergencia" backTo="/(tabs)/inicio" />

      <Badge label={view.badgeLabel} tone={view.badgeTone} />

      <Txt variant="display" style={styles.title}>
        {view.title}
      </Txt>

      <Txt variant="body" style={styles.meta}>
        {alert.id} · Creada el {alert.createdAt}, {alert.createdTime}
      </Txt>
      <Txt variant="body" style={styles.metaLine}>
        Último evento: {alert.lastEventTime} · Datos simulados
      </Txt>

      <CycleList cycle={view.cycle} />

      <Notice tone={view.notice.tone} style={styles.notice}>
        {view.notice.text}
      </Notice>

      <Button label="Ver mapa" onPress={() => router.push('/(tabs)/mapa')} />
      <Button
        label="Ver consejos"
        kind="secondary"
        onPress={() => router.push('/(tabs)/consejos')}
        style={styles.secondary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 12 },
  meta: { marginTop: 12, color: color.textSecondary },
  metaLine: { marginBottom: space.md, color: color.textSecondary },
  notice: { marginTop: space.md, marginBottom: space.md },
  secondary: { marginTop: 12 },
});
