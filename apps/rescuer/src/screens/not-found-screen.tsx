import { router, usePathname } from 'expo-router';
import { StyleSheet } from 'react-native';

import { OperationScreen } from '@/components/shell';
import { Button, Notice, Txt } from '@/components/ui';
import { space } from '@/constants/theme';
import { useDemo } from '@/hooks/use-demo';

/** Fallback for unknown routes, so the app never shows a blank screen. */
export default function NotFoundScreen() {
  const pathname = usePathname();
  const { signedIn } = useDemo();

  return (
    <OperationScreen title="Ruta no encontrada" showActions={signedIn}>
      <Notice tone="warning">{`No hay una pantalla para «${pathname}».`}</Notice>
      <Txt variant="support" style={styles.body}>
        {signedIn
          ? 'Vuelve a la bandeja de alertas para continuar la demostración.'
          : 'Inicia sesión para continuar la demostración.'}
      </Txt>
      <Button
        label={signedIn ? 'Volver a las alertas' : 'Ir al inicio de sesión'}
        onPress={() => router.replace(signedIn ? '/(tabs)/alertas' : '/')}
        style={styles.action}
      />
    </OperationScreen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: space.md },
  action: { marginTop: space.md },
});
