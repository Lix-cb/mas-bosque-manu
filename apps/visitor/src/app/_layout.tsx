import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DemoProvider } from '@/context/demo-context';
import { color } from '@/constants/theme';

/**
 * Root navigator of the visitor app. The demo state provider wraps every screen.
 * The design only defines a light theme, so the status bar is always dark.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: color.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="demo" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
      </DemoProvider>
    </SafeAreaProvider>
  );
}
