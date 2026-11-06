import { Tabs } from 'expo-router';

import { TabBarIcon, TabBarLabel } from '@/components/tab-bar';
import { color } from '@/constants/theme';

/** Bottom tab navigator: Alertas · Mapa · Casos · Perfil. */
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
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarAccessibilityLabel: 'Alertas activas',
          tabBarIcon: ({ focused }) => <TabBarIcon name="alert-triangle" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Alertas</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarAccessibilityLabel: 'Mapa de incidentes',
          tabBarIcon: ({ focused }) => <TabBarIcon name="map" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Mapa</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="casos"
        options={{
          title: 'Casos',
          tabBarAccessibilityLabel: 'Seguimiento de casos',
          tabBarIcon: ({ focused }) => <TabBarIcon name="file-text" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Casos</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil y sincronización',
          tabBarIcon: ({ focused }) => <TabBarIcon name="user" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused}>Perfil</TabBarLabel>,
        }}
      />
    </Tabs>
  );
}
