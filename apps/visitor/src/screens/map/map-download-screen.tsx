import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Button } from '@/components/buttons';
import { Badge, Notice, ProgressBar } from '@/components/feedback';
import { Screen, TopBar } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { DEMO_DATE } from '@/data/fixtures';
import { color, space } from '@/constants/theme';

/**
 * V14 · Map not downloaded, with V14-a (offline), V14-b (downloading), V14-c (failed)
 * and V14-d (saved). No file is downloaded; only the demo state changes.
 */
export default function MapDownloadScreen() {
  const { environment, startDownload, cancelDownload } = useDemo();

  switch (environment.mapPackage) {
    case 'downloading':
      return <DownloadingBody onCancel={cancelDownload} percent={environment.downloadProgress} />;
    case 'failed':
      return <FailedBody onRetry={startDownload} />;
    case 'saved':
      return <SavedBody />;
    default:
      return (
        <MissingBody
          offline={environment.connectivity === 'offline'}
          onDownload={startDownload}
        />
      );
  }
}

/** V14 (online) and V14-a (offline). */
function MissingBody({ offline, onDownload }: { offline: boolean; onDownload: () => void }) {
  return (
    <Screen>
      <TopBar title="Mapa sin conexión" backTo="/(tabs)/inicio" />

      {offline ? (
        <View style={styles.glyph}>
          <StruckWifi />
        </View>
      ) : (
        <View style={styles.glyphCentered}>
          <RidgeGlyph />
        </View>
      )}

      <Txt variant="display" center={!offline} style={styles.title}>
        Mapa no disponible
      </Txt>

      <Txt variant="body" center={!offline} style={styles.body}>
        {offline
          ? 'No has descargado los recursos del bosque y no hay conexión. Conéctate antes de entrar para intentar descargarlos.'
          : 'Aún no has descargado los recursos del bosque. Necesitas conexión para guardarlos antes de consultarlos sin internet.'}
      </Txt>

      {offline ? (
        <Badge label="Sin conexión" tone="warning" style={styles.badgeLeft} />
      ) : (
        <View style={styles.badgeCentered}>
          <Badge label="Con conexión · Simulada" tone="info" />
        </View>
      )}

      {offline ? null : (
        <Notice tone="warning" style={styles.notice}>
          Descarga demostrativa. La cartografía debe validarse antes de cualquier uso en
          campo.
        </Notice>
      )}

      <Button
        label="Descargar mapa"
        onPress={onDownload}
        disabled={offline}
        disabledHint={offline ? 'La descarga se habilitará únicamente cuando haya conexión.' : undefined}
        style={styles.action}
      />
      <Button
        label="Volver al inicio"
        kind="secondary"
        onPress={() => router.replace('/(tabs)/inicio')}
        style={styles.actionGap}
      />
    </Screen>
  );
}

/** V14-b: download in progress. */
function DownloadingBody({ onCancel, percent }: { onCancel: () => void; percent: number }) {
  return (
    <Screen>
      <TopBar title="Descargar mapa" backTo="/(tabs)/inicio" />

      <Feather name="download" size={44} color={color.primary} style={styles.glyph} />

      <Txt variant="display" style={styles.title}>
        Guardando recursos del bosque
      </Txt>

      <ProgressBar percent={percent} label={`Descarga simulada · ${percent} %`} />

      <Txt variant="body" style={styles.body}>
        El mapa aún no está disponible sin conexión. Espera a que termine la descarga y se
        verifique el guardado.
      </Txt>

      <Button label="Cancelar descarga" kind="secondary" onPress={onCancel} style={styles.action} />

      <Notice tone="info" style={styles.notice}>
        Este indicador es estático. No se realiza una descarga real.
      </Notice>
    </Screen>
  );
}

/** V14-c: download failed. */
function FailedBody({ onRetry }: { onRetry: () => void }) {
  return (
    <Screen>
      <TopBar title="Descargar mapa" backTo="/(tabs)/inicio" />

      <Feather name="alert-circle" size={48} color={color.danger} style={styles.glyph} />

      <Txt variant="display" style={styles.title}>
        No pudimos descargar el mapa
      </Txt>

      <Txt variant="body" style={styles.body}>
        Los recursos no se guardaron completos. Revisa tu conexión y el espacio disponible
        antes de reintentar.
      </Txt>

      <Notice tone="danger" style={styles.notice}>
        El mapa no está disponible. No se usarán archivos incompletos.
      </Notice>

      <Button label="Reintentar" onPress={onRetry} style={styles.action} />
      <Button
        label="Volver al inicio"
        kind="secondary"
        onPress={() => router.replace('/(tabs)/inicio')}
        style={styles.actionGap}
      />
    </Screen>
  );
}

/** V14-d: map saved. */
function SavedBody() {
  return (
    <Screen>
      <TopBar title="Mapa sin conexión" backTo="/(tabs)/inicio" />

      <Feather name="check-circle" size={52} color={color.primary} style={styles.glyph} />

      <Txt variant="display" style={styles.title}>
        Mapa guardado
      </Txt>

      <Badge label="Copia local · Simulada" tone="success" style={styles.badgeLeft} />

      <Card style={styles.card}>
        <Txt variant="subtitle">La Primavera · Muestra v0.1</Txt>
        <Txt variant="support" style={styles.cardLine}>
          Guardado íntegro de ejemplo.
        </Txt>
        <Txt variant="support">{DEMO_DATE} · 10:20</Txt>
        <Txt variant="support">Rutas, lugares, señales y kits provisionales.</Txt>
      </Card>

      <Notice tone="warning" style={styles.notice}>
        Cartografía pendiente de validación. Tener mapa o GPS no garantiza que un SOS
        llegue.
      </Notice>

      <Button label="Abrir mapa" onPress={() => router.replace('/(tabs)/mapa')} />
      <Button
        label="Volver al inicio"
        kind="secondary"
        onPress={() => router.replace('/(tabs)/inicio')}
        style={styles.actionGap}
      />
    </Screen>
  );
}

function StruckWifi() {
  return (
    <Svg width={54} height={44} viewBox="0 0 36 30">
      <Path d="M3 10a22 22 0 0 1 30 0" stroke={color.warning} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M8.5 16a14 14 0 0 1 19 0" stroke={color.warning} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M14 21.5a6.5 6.5 0 0 1 8 0" stroke={color.warning} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M2 2 L34 28" stroke={color.warning} strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

function RidgeGlyph() {
  return (
    <Svg width={56} height={18} viewBox="0 0 48 14">
      <Path
        d="M2 11 C 12 1, 20 1, 27 7 C 32 10, 40 10, 46 6"
        stroke={color.textSecondary}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  glyph: { marginTop: space.sm, marginBottom: space.sm },
  glyphCentered: { alignItems: 'center', marginTop: space.xxl, marginBottom: space.sm },
  title: { marginTop: space.md },
  body: { marginTop: 12, color: color.textSecondary },
  badgeLeft: { marginTop: space.md },
  badgeCentered: { alignItems: 'center', marginTop: space.md },
  notice: { marginTop: space.md },
  card: { marginTop: space.md },
  cardLine: { marginTop: 8 },
  action: { marginTop: space.md },
  actionGap: { marginTop: 12 },
});
