import { Tabs } from 'expo-router';

import { TabBarIcon, TabBarLabel } from '@/components/tab-bar';
import { color } from '@/constants/theme';

/** Bottom tab navigator: Inicio (V04) · Mapa (V11) · Consejos (V13). */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Keep the icon above the label. Otherwise React Navigation switches to
        // "beside-icon" in landscape windows, which is the norm on desktop browsers.
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.textSecondary,
        tabBarStyle: {
          backgroundColor: color.surface,
          borderTopColor: color.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarItemStyle: { paddingVertical: 2 },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarAccessibilityLabel: 'Inicio',
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Inicio</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarAccessibilityLabel: 'Mapa sin conexión',
          tabBarIcon: ({ focused }) => <TabBarIcon name="map" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Mapa</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="consejos"
        options={{
          title: 'Consejos',
          tabBarAccessibilityLabel: 'Consejos de seguridad',
          tabBarIcon: ({ focused }) => <TabBarIcon name="shield" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Consejos</TabBarLabel>,
        }}
      />
    </Tabs>
  );
}
