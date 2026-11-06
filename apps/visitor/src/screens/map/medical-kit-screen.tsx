import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { kits } from '@/data/fixtures';
import { color, radius, space } from '@/constants/theme';

/**
 * V12 · Medical kit. Both the illustration and the stock are labelled as
 * unverified sample data.
 */
export default function MedicalKitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { environment } = useDemo();
  const kit = kits.find((k) => k.id === id);

  if (!kit) {
    return (
      <Screen>
        <TopBar title="Punto de primeros auxilios" backTo="/(tabs)/mapa" />
        <Txt variant="display" style={styles.title}>
          Información no disponible
        </Txt>
        <Txt variant="body" style={styles.body}>
          No hay una ficha local para este punto. Regresa al mapa para elegir otra
          referencia.
        </Txt>
        <Button
          label="Volver al mapa"
          onPress={() => router.replace('/(tabs)/mapa')}
          style={styles.action}
        />
      </Screen>
    );
  }

  const gpsReady = environment.gps === 'available';

  return (
    <Screen>
      <TopBar title="Punto de primeros auxilios" backTo="/(tabs)/mapa" />

      <Txt variant="display">{kit.name}</Txt>

      <View style={styles.illustration}>
        <Feather name="plus-square" size={56} color={color.primary} />
        <Txt variant="caption" tone="textSecondary" style={styles.illustrationCaption}>
          Ilustración · No representa equipo verificado
        </Txt>
      </View>

      <Txt variant="body" style={styles.body}>
        {kit.description}
      </Txt>

      <Card style={styles.card}>
        <Txt variant="support">{kit.positionLabel}</Txt>
        <Txt variant="support">
          {gpsReady ? kit.distanceLabel : 'Distancia no calculable sin posición.'}
        </Txt>
        <Txt variant="support">{kit.nearbyLabel}</Txt>
        <Txt variant="support" style={styles.cardGap}>
          {kit.contentsLabel}
        </Txt>
      </Card>

      <Notice tone="warning" style={styles.notice}>
        Contenido de muestra, stock no confirmado. Si hay una emergencia, intenta solicitar
        ayuda; no dependas de este kit.
      </Notice>

      <Button
        label="Ver en mapa"
        onPress={() => router.replace('/(tabs)/mapa')}
        accessibilityHint="Vuelve al mapa sin conexión"
      />
      <Button
        label="Volver al mapa"
        kind="secondary"
        onPress={() => router.back()}
        style={styles.secondary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space.sm },
  illustration: {
    marginTop: space.md,
    backgroundColor: color.surfaceSoft,
    borderRadius: radius.md,
    paddingVertical: space.lg,
    alignItems: 'center',
  },
  illustrationCaption: { marginTop: 10 },
  body: { marginTop: space.md, color: color.textSecondary },
  card: { marginTop: space.md },
  cardGap: { marginTop: 10 },
  notice: { marginTop: space.md, marginBottom: space.md },
  action: { marginTop: space.md },
  secondary: { marginTop: 12 },
});
