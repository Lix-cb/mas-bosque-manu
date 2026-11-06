import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Badge, Notice, SkeletonCard } from '@/components/feedback';
import { Screen } from '@/components/layout';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { sosFallbackTip, tips } from '@/data/fixtures';
import type { DemoTip } from '@/types/models';
import { color, iconSize, space } from '@/constants/theme';

/**
 * V13 · Safety tips, V13-a · Tips not saved, V13-b · Loading.
 * Content comes from `src/data/fixtures.ts`; there is no CMS or download yet.
 */
export default function SafetyTipsScreen() {
  const { environment } = useDemo();

  if (environment.tips === 'missing') return <MissingBody />;
  if (environment.tips === 'loading') return <LoadingBody />;

  return (
    <Screen>
      <Txt variant="section" style={styles.header}>
        Consejos de seguridad
      </Txt>

      <Badge label="Guardados en este dispositivo · v0.1" tone="success" />

      <View style={styles.list}>
        {tips.map((tip) => (
          <TipRow key={tip.id} tip={tip} />
        ))}
      </View>

      <Card tone="soft" style={styles.fallback}>
        <Txt variant="subtitle">{sosFallbackTip.title}</Txt>
        <Txt variant="body" style={styles.fallbackBody}>
          {sosFallbackTip.body}
        </Txt>
      </Card>

      <Txt variant="caption" tone="textMuted" style={styles.footer}>
        Contenido de muestra pendiente de validación. Disponible sin conexión sólo si se
        guardó antes.
      </Txt>
    </Screen>
  );
}

function TipRow({ tip }: { tip: DemoTip }) {
  return (
    <View style={styles.tipRow}>
      <TipIcon icon={tip.icon} />
      <View style={styles.tipText}>
        <Txt variant="bodyStrong">{tip.title}</Txt>
        <Txt variant="support" style={styles.tipBody}>
          {tip.body}
        </Txt>
      </View>
    </View>
  );
}

function TipIcon({ icon }: { icon: DemoTip['icon'] }) {
  if (icon === 'water') return <Feather name="droplet" size={iconSize.md} color={color.primary} />;
  if (icon === 'battery') return <Feather name="battery" size={iconSize.md} color={color.primary} />;
  if (icon === 'weather') return <Feather name="cloud" size={iconSize.md} color={color.primary} />;
  // Feather has no trail-sign icon, so it is drawn here.
  return (
    <Svg width={iconSize.md} height={iconSize.md} viewBox="0 0 24 24">
      <Path
        d="M4 9h12l3 3-3 3H4z"
        stroke={color.primary}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** V13-a: no local copy of the tips. */
function MissingBody() {
  return (
    <Screen>
      <Txt variant="section" style={styles.header}>
        Consejos de seguridad
      </Txt>
      <Feather name="file-text" size={44} color={color.textPrimary} style={styles.missingGlyph} />
      <Txt variant="display" style={styles.missingTitle}>
        Consejos no disponibles
      </Txt>
      <Txt variant="body" style={styles.missingBody}>
        No hay una copia de las recomendaciones guardada en este dispositivo. No podemos
        mostrar artículos sin conexión.
      </Txt>
      <Notice tone="info" style={styles.missingNotice}>
        La obtención y publicación de contenido se implementarán después. No se está
        descargando información.
      </Notice>
    </Screen>
  );
}

/** V13-b: static loading state. */
function LoadingBody() {
  return (
    <Screen>
      <Txt variant="section" style={styles.header}>
        Consejos de seguridad
      </Txt>
      <Badge label="Leyendo recursos locales" tone="info" />
      <Txt variant="display" style={styles.missingTitle}>
        Cargando consejos
      </Txt>
      <Txt variant="body" style={styles.missingBody}>
        Estamos revisando la copia almacenada en este dispositivo. Estado de carga
        simulado.
      </Txt>
      <View style={styles.skeletons}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
      <Txt variant="caption" tone="textMuted" style={styles.footer}>
        Si la lectura falla, se muestra contenido no disponible, no una lista vacía de
        consejos.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.md, marginBottom: 12 },
  list: { marginTop: space.md, gap: space.md },
  tipRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  tipText: { flex: 1 },
  tipBody: { marginTop: 4 },
  fallback: { marginTop: space.lg },
  fallbackBody: { marginTop: 10, color: color.textSecondary },
  footer: { marginTop: 12 },
  missingGlyph: { marginTop: space.sm },
  missingTitle: { marginTop: space.md },
  missingBody: { marginTop: 12, color: color.textSecondary },
  missingNotice: { marginTop: space.md },
  skeletons: { marginTop: space.md, gap: 12 },
});
