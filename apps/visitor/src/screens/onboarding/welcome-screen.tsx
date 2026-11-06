import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { ForestHero } from '@/components/forest-hero';
import { BrandHeader, Screen, StatusChip } from '@/components/layout';
import { Txt } from '@/components/typography';
import { color, space } from '@/constants/theme';

/** V01 · Welcome. Introduces the app; "Comenzar" goes to V02. */
export default function WelcomeScreen() {
  return (
    <Screen>
      <BrandHeader />

      <ForestHero style={styles.hero} />

      <StatusChip label="BOSQUE LA PRIMAVERA · JALISCO" tone="success" />

      <Txt variant="display" style={styles.title}>
        Disfruta el bosque.{'\n'}Prepárate para cuidarte.
      </Txt>

      <Txt variant="body" style={styles.lead}>
        Consulta referencias y consejos, y conoce cómo intentar solicitar ayuda en una
        emergencia.
      </Txt>

      <Notice tone="info" style={styles.notice}>
        Prepara la aplicación y sus recursos antes de entrar al bosque.
      </Notice>

      <Button label="Comenzar" onPress={() => router.push('/permisos')} />

      <View style={styles.footer}>
        <Txt variant="caption" tone="textMuted">
          Proyecto de estudiantes de Ingeniería en Tecnologías Computacionales ·
          Tecnológico de Monterrey.
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: space.md, marginBottom: space.md },
  title: { marginTop: space.md },
  lead: { marginTop: space.sm, color: color.textSecondary },
  notice: { marginTop: space.md, marginBottom: space.md },
  footer: { marginTop: space.md },
});
