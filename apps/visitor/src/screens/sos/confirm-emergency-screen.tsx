import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Txt } from '@/components/typography';
import { color, space } from '@/constants/theme';

/**
 * V05 · Confirm emergency. A single confirmation step to avoid accidental requests.
 * Nothing is sent from here; it only navigates to V06.
 */
export default function ConfirmEmergencyScreen() {
  return (
    <Screen>
      <TopBar title="Solicitud de ayuda" backTo="/(tabs)/inicio" />

      <View style={styles.markWrapper}>
        <View style={styles.mark}>
          <AlarmGlyph />
        </View>
      </View>

      <Txt variant="display" center style={styles.title}>
        ¿Necesitas ayuda?
      </Txt>

      <Txt variant="body" center style={styles.lead}>
        La aplicación intentará compartir tu ubicación y los detalles que agregues. La
        entrega depende de la comunicación disponible.
      </Txt>

      <Notice tone="warning" style={styles.notice}>
        No se ha enviado ninguna alerta. Este prototipo no contacta al personal de
        emergencia.
      </Notice>

      <Button
        label="Confirmar SOS"
        kind="danger"
        onPress={() => router.push('/sos/detalles')}
        accessibilityHint="Abre el formulario de detalles de la simulación"
      />
      <Button
        label="Cancelar"
        kind="secondary"
        onPress={() => router.back()}
        style={styles.cancel}
      />
    </Screen>
  );
}

/** Alarm bell glyph drawn with strokes. */
function AlarmGlyph() {
  return (
    <Svg width={54} height={54} viewBox="0 0 48 48">
      <Path
        d="M14 32h20M16 32v-8a8 8 0 0 1 16 0v8M24 12V8"
        stroke={color.danger}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M10 18l-3-3M38 18l3-3" stroke={color.danger} strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={24} cy={38} r={2.2} fill={color.danger} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  markWrapper: { alignItems: 'center', marginTop: space.lg },
  mark: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: color.dangerSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: space.lg },
  lead: { marginTop: space.sm, color: color.textSecondary },
  notice: { marginTop: space.lg, marginBottom: space.lg },
  cancel: { marginTop: 12 },
});
