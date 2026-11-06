import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { color } from '@/constants/theme';
import { DemoProvider } from '@/context/demo-context';
import { useDemo } from '@/hooks/use-demo';

/** Root of the rescuer app: providers plus the root stack navigator. */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoProvider>
        <StatusBar style="light" />
        <RootStack />
      </DemoProvider>
    </SafeAreaProvider>
  );
}

/**
 * The sign-in screen (R01) is only reachable while signed out, and the rest of the
 * app only while signed in. This is a navigation guard for the demo session; it is
 * not real authentication.
 */
function RootStack() {
  const { signedIn } = useDemo();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="incidente/[id]/index" />
        <Stack.Screen name="incidente/[id]/mapa" />
        <Stack.Screen name="incidente/[id]/estado" />
        <Stack.Screen name="incidente/[id]/seguimiento" />
        <Stack.Screen name="incidente/[id]/cierre" />
        <Stack.Screen name="sin-conexion" />
      </Stack.Protected>
    </Stack>
  );
}
