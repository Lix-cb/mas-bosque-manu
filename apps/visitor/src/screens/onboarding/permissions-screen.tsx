import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Badge, Notice } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import type { PermissionState } from '@/types/models';
import { color, iconSize, space } from '@/constants/theme';

/**
 * V02 · Permissions, and V02-a · Location denied.
 * No real OS permission is requested: "Conceder permisos" only updates the local
 * demo state.
 */
export default function PermissionsScreen() {
  const { environment, setPermission, patchEnvironment } = useDemo();
  const { permissions, mapPackage } = environment;
  const denied = permissions.location === 'denied';

  const grant = () => {
    if (denied) {
      // A denied permission keeps the user on V02-a.
      setPermission('location', 'denied');
      return;
    }
    setPermission('location', 'granted');
    setPermission('notifications', 'granted');
    patchEnvironment({ gps: 'available' });
  };

  const onContinue = () => {
    const ready = permissions.location === 'granted' && mapPackage === 'saved';
    router.push(ready ? '/(tabs)/inicio' : '/preparacion');
  };

  return (
    <Screen>
      <TopBar title="Prepara tu visita" backTo="/" />

      {denied ? <DeniedBody /> : <DefaultBody />}

      <View style={styles.permissions}>
        <PermissionCard
          icon="map-pin"
          title="Ubicación"
          description="Para obtener tu posición y precisión GPS."
          state={permissions.location}
        />
        <PermissionCard
          icon="bluetooth"
          title="Bluetooth"
          description="Si la tecnología de comunicación lo requiere · Por definir"
          state={permissions.bluetooth}
        />
        <PermissionCard
          icon="bell"
          title="Notificaciones"
          description="Para mostrar actualizaciones cuando estén disponibles."
          state={permissions.notifications}
        />
      </View>

      {denied ? (
        <Badge label="Mapa sin descargar" tone="warning" style={styles.mapBadge} />
      ) : (
        <View style={styles.mapRow}>
          <Feather name="check" size={16} color={color.primary} />
          <Txt variant="support" tone="successText">
            {mapPackage === 'saved'
              ? 'Mapa local descargado · Muestra v0.1'
              : 'Mapa local pendiente de descarga'}
          </Txt>
        </View>
      )}

      <Button label="Conceder permisos" onPress={grant} style={styles.primaryAction} />
      <Button label="Continuar" kind="secondary" onPress={onContinue} style={styles.secondaryAction} />
    </Screen>
  );
}

function DefaultBody() {
  return (
    <>
      <Txt variant="display">Tú tienes el control</Txt>
      <Txt variant="body" style={styles.lead}>
        Estos recursos ayudan a preparar una solicitud. No garantizan su entrega.
      </Txt>
    </>
  );
}

/** V02-a. */
function DeniedBody() {
  return (
    <>
      <Txt variant="display">Ubicación no permitida</Txt>
      <Notice tone="warning" style={styles.deniedNotice}>
        Puedes continuar y acceder al SOS. No podremos obtener tu posición mientras el
        permiso esté denegado.
      </Notice>
    </>
  );
}

const stateLabel: Record<PermissionState, { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  granted: { label: 'Permitida', tone: 'success' },
  denied: { label: 'No permitido', tone: 'warning' },
  pending: { label: 'Pendiente', tone: 'warning' },
  undefined: { label: 'Por definir', tone: 'neutral' },
};

function PermissionCard({
  icon,
  title,
  description,
  state,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
  state: PermissionState;
}) {
  const badge = stateLabel[state];
  return (
    <Card>
      <View style={styles.permissionHeader}>
        <Feather name={icon} size={iconSize.sm} color={color.primary} />
        <Txt variant="subtitle" style={styles.permissionTitle}>
          {title}
        </Txt>
        <Badge label={badge.label} tone={badge.tone} />
      </View>
      <Txt variant="support" style={styles.permissionDescription}>
        {description}
      </Txt>
    </Card>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: space.sm, color: color.textSecondary },
  deniedNotice: { marginTop: space.md },
  permissions: { gap: 12, marginTop: space.md },
  permissionHeader: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  permissionTitle: { flex: 1 },
  permissionDescription: { marginTop: space.sm },
  mapRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.md },
  mapBadge: { marginTop: space.md },
  primaryAction: { marginTop: space.md },
  secondaryAction: { marginTop: 12 },
});
