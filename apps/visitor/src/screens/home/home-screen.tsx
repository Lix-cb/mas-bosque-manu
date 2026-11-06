import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { BrandHeader, Screen, StatusChip } from '@/components/layout';
import { MockMap } from '@/components/mock-map';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { color, minTouchTarget, radius, space } from '@/constants/theme';

/**
 * V04 · Home, and V04-a · Home without resources.
 * SOS is always reachable: missing GPS, connectivity or map data changes the layout
 * but never blocks the request.
 */
export default function HomeScreen() {
  const { environment } = useDemo();
  const hasMap = environment.mapPackage === 'saved';
  const gpsReady = environment.gps === 'available';
  const online = environment.connectivity === 'online';
  const degraded = !hasMap || !gpsReady || !online;

  return (
    <Screen>
      {degraded ? (
        <Txt variant="section" style={styles.plainHeader}>
          Inicio
        </Txt>
      ) : (
        <BrandHeader />
      )}

      <Txt variant="display" style={styles.title}>
        {degraded ? 'Solicitar ayuda' : '¿Cómo podemos\nayudarte?'}
      </Txt>

      <View style={styles.chips}>
        <StatusChip
          label={gpsReady ? 'GPS disponible' : 'Ubicación no disponible'}
          tone={gpsReady ? 'success' : 'warning'}
        />
        <StatusChip
          label={online ? 'Conexión de muestra' : 'Sin conexión · No confirma entrega'}
          tone={online ? 'info' : 'warning'}
        />
      </View>

      {degraded ? <SosBlock /> : <SosCircle />}

      {hasMap ? (
        <>
          <MockMap height={132} showUser={gpsReady} style={styles.map} />
          <Pressable
            onPress={() => router.push('/(tabs)/mapa')}
            accessibilityRole="button"
            accessibilityLabel="Mapa local, muestra v0.1"
            accessibilityHint="Abre el mapa sin conexión"
            style={({ pressed }) => [styles.mapLink, pressed && styles.pressed]}
          >
            <Txt variant="body" tone="textSecondary" style={styles.mapLinkText}>
              Mapa local · Muestra v0.1
            </Txt>
            <Feather name="arrow-right" size={20} color={color.primary} />
          </Pressable>
          <Txt variant="support" style={styles.tipLine}>
            Permanece en rutas señalizadas y cuida la batería de tu teléfono.
          </Txt>
        </>
      ) : (
        <>
          <Notice tone="warning" style={styles.map}>
            Sin mapa guardado. No hay vista previa disponible.
          </Notice>
          <Button
            label="Preparar mapa"
            kind="secondary"
            onPress={() => router.push('/mapa-descarga')}
            style={styles.prepareButton}
          />
          <Txt variant="support" style={styles.tipLine}>
            Puedes preparar una solicitud. Sin canal de comunicación, seguirá pendiente y no
            se habrá avisado al personal.
          </Txt>
        </>
      )}
    </Screen>
  );
}

/** Round SOS button (V04). */
function SosCircle() {
  return (
    <View style={styles.sosWrapper}>
      <Pressable
        onPress={() => router.push('/sos/confirmar')}
        accessibilityRole="button"
        accessibilityLabel="SOS, solicitar ayuda"
        accessibilityHint="Abre la confirmación de la simulación de emergencia"
        style={({ pressed }) => [styles.sosCircle, pressed && styles.pressed]}
      >
        <Txt variant="display" style={styles.sosLabel}>
          SOS
        </Txt>
      </Pressable>
      <Txt variant="section" style={styles.sosCaption}>
        Solicitar ayuda
      </Txt>
      <Txt variant="support" center>
        Sin registro · Envío no garantizado
      </Txt>
    </View>
  );
}

/** Rectangular SOS button (V04-a). Same destination, different layout. */
function SosBlock() {
  return (
    <Pressable
      onPress={() => router.push('/sos/confirmar')}
      accessibilityRole="button"
      accessibilityLabel="SOS, solicitar ayuda"
      accessibilityHint="Abre la confirmación de la simulación de emergencia"
      style={({ pressed }) => [styles.sosBlock, pressed && styles.pressed]}
    >
      <Txt variant="display" style={styles.sosBlockLabel}>
        SOS
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  plainHeader: { marginTop: space.md },
  title: { marginTop: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: 12 },
  sosWrapper: { alignItems: 'center', marginTop: space.lg },
  sosCircle: {
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosLabel: { color: color.textOnPrimary, fontSize: 40, lineHeight: 46, letterSpacing: 1 },
  sosCaption: { marginTop: space.md },
  sosBlock: {
    marginTop: space.lg,
    height: 140,
    borderRadius: radius.lg,
    backgroundColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBlockLabel: { color: color.textOnPrimary, fontSize: 40, lineHeight: 46, letterSpacing: 1 },
  map: { marginTop: space.lg },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouchTarget,
    marginTop: 12,
  },
  mapLinkText: { flex: 1 },
  prepareButton: { marginTop: 12 },
  tipLine: { marginTop: space.sm },
  pressed: { opacity: 0.8 },
});
