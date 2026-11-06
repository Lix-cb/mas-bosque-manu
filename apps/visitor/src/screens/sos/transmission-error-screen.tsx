import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { DEMO_ALERT_ID, DEMO_DATE, STAGE_TIMES } from '@/data/fixtures';
import { color, space } from '@/constants/theme';

/**
 * V09 · Communication error, and V09-a · Retry failed.
 * The local ID is kept across attempts, and a retry never reports success by itself.
 */
export default function TransmissionErrorScreen() {
  const { alert, retryTransmission, forceTransmissionFailure, setForceTransmissionFailure } = useDemo();
  const [hasRetried, setHasRetried] = useState(false);

  const id = alert?.id ?? DEMO_ALERT_ID;
  const createdTime = alert?.createdTime ?? STAGE_TIMES.preparing;

  const retry = () => {
    setHasRetried(true);
    if (forceTransmissionFailure) {
      // The failure scenario is still on, so the user stays on V09-a.
      return;
    }
    retryTransmission();
    router.replace('/sos/estado');
  };

  return (
    <Screen>
      <TopBar title="Estado de emergencia" backTo="/(tabs)/inicio" />

      <View style={styles.glyph}>
        <Feather name="alert-circle" size={52} color={color.danger} />
      </View>

      <Txt variant="display" style={styles.title}>
        Alerta pendiente
      </Txt>

      {hasRetried ? (
        <Notice tone="danger" style={styles.leadNotice}>
          El reintento no se completó. El personal de emergencia no ha confirmado la
          recepción.
        </Notice>
      ) : null}

      <Txt variant="body" style={styles.lead}>
        No pudimos confirmar el envío de tu alerta. Tu solicitud permanece guardada en este
        dispositivo.
      </Txt>

      <Card style={styles.card}>
        <Txt variant="subtitle">
          {hasRetried ? `${id} · Mismo identificador` : `${id} · ${createdTime}`}
        </Txt>
        {hasRetried ? (
          <>
            <Txt variant="support" style={styles.cardLine}>
              Creación {DEMO_DATE} · {createdTime}
            </Txt>
            <Txt variant="support">Guardado local simulado</Txt>
          </>
        ) : (
          <Txt variant="support" style={styles.cardLine}>
            Guardado local simulado · {DEMO_DATE}
          </Txt>
        )}
      </Card>

      {hasRetried ? null : (
        <Notice tone="danger" style={styles.notice}>
          El personal de emergencia no ha confirmado la recepción
        </Notice>
      )}

      <Button label="Reintentar envío" onPress={retry} style={styles.action} />
      <Button
        label="Ver mapa"
        kind="secondary"
        onPress={() => router.push('/(tabs)/mapa')}
        style={styles.actionGap}
      />
      <Button
        label="Ver consejos"
        kind="secondary"
        onPress={() => router.push('/(tabs)/consejos')}
        style={styles.actionGap}
      />

      <Txt variant="caption" tone="textMuted" style={styles.footer}>
        Si no hay un canal disponible, el intento puede volver a fallar. No asumas que la
        ayuda va en camino.
      </Txt>

      {forceTransmissionFailure ? (
        <Button
          label="Desactivar el fallo simulado"
          kind="ghost"
          onPress={() => setForceTransmissionFailure(false)}
          accessibilityHint="Control del escenario de demostración"
          style={styles.scenarioToggle}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { marginTop: space.sm },
  title: { marginTop: space.md },
  leadNotice: { marginTop: 12 },
  lead: { marginTop: 12, color: color.textSecondary },
  card: { marginTop: space.md },
  cardLine: { marginTop: 6 },
  notice: { marginTop: space.md },
  action: { marginTop: space.md },
  actionGap: { marginTop: 12 },
  footer: { marginTop: 12 },
  scenarioToggle: { marginTop: space.sm },
});
