import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/buttons';
import { Screen, TopBar } from '@/components/layout';
import { Txt } from '@/components/typography';
import { color, space } from '@/constants/theme';

/** Fallback for unknown routes, so the app never shows a blank screen. */
export default function NotFoundScreen() {
  const pathname = usePathname();
  return (
    <Screen>
      <TopBar title="Pantalla no encontrada" backTo="/(tabs)/inicio" />
      <Feather name="compass" size={44} color={color.textSecondary} style={styles.glyph} />
      <Txt variant="display" style={styles.title}>
        Esta ruta no existe
      </Txt>
      <Txt variant="body" style={styles.body}>
        No hay una pantalla para «{pathname}». Vuelve al inicio para continuar la
        demostración.
      </Txt>
      <Button
        label="Volver al inicio"
        onPress={() => router.replace('/(tabs)/inicio')}
        style={styles.action}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { marginTop: space.sm },
  title: { marginTop: space.md },
  body: { marginTop: 12, color: color.textSecondary },
  action: { marginTop: space.lg },
});
