import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { color, space } from '@/constants/theme';

/**
 * V03 · Incomplete setup. Warns about missing permissions or map data without
 * blocking access to SOS. "Completar configuración" → V02, "Continuar" → V04.
 */
export default function IncompleteSetupScreen() {
  const { environment } = useDemo();
  const locationLabel =
    environment.permissions.location === 'granted' ? 'Ubicación · Permitida' : 'Ubicación · No permitido';
  const mapLabel = environment.mapPackage === 'saved' ? 'Mapa descargado' : 'Mapa sin descargar';

  return (
    <Screen>
      <TopBar title="Preparación" backTo="/permisos" />

      <Feather name="alert-triangle" size={44} color={color.warning} style={styles.icon} />

      <Txt variant="display" style={styles.title}>
        Configuración{'\n'}incompleta
      </Txt>

      <Card style={styles.summary}>
        <Txt variant="bodyStrong">{locationLabel}</Txt>
        <Txt variant="bodyStrong" style={styles.summaryLine}>
          {mapLabel}
        </Txt>
        <Txt variant="support" style={styles.summaryLine}>
          Puedes continuar y acceder al SOS sin cuenta.
        </Txt>
      </Card>

      <Notice tone="warning" style={styles.notice}>
        Sin estos permisos, es posible que no podamos determinar tu ubicación ni enviarte
        ayuda en caso de emergencia.
      </Notice>

      <Txt variant="body" style={styles.body}>
        Incluso con permisos, el envío depende de un canal de comunicación disponible y no
        está garantizado.
      </Txt>

      <Button
        label="Completar configuración"
        onPress={() => router.push('/permisos')}
        style={styles.primaryAction}
      />
      <Button
        label="Continuar de todos modos"
        kind="secondary"
        onPress={() => router.push('/(tabs)/inicio')}
        style={styles.secondaryAction}
      />

      <View style={styles.spacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: { marginTop: space.sm },
  title: { marginTop: space.md },
  summary: { marginTop: space.md },
  summaryLine: { marginTop: 6 },
  notice: { marginTop: space.md },
  body: { marginTop: space.md, color: color.textSecondary },
  primaryAction: { marginTop: space.md },
  secondaryAction: { marginTop: 12 },
  spacer: { height: space.lg },
});
