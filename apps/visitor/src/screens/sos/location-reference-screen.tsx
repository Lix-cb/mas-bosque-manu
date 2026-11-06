import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { RadioRow } from '@/components/fields';
import { Screen, TopBar } from '@/components/layout';
import { Segmented } from '@/components/segmented';
import { REFERENCE_CATEGORIES, isReferenceCategory } from '@/constants/reference-categories';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { references } from '@/data/fixtures';
import type { ReferenceCategory } from '@/types/models';
import { color, space } from '@/constants/theme';

/**
 * V07 · Location unavailable, and V07-a · No saved references.
 * Picking a place only attaches a manual label; it never creates GPS coordinates.
 */
export default function LocationReferenceScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { environment, draft, patchDraft } = useDemo();
  const [category, setCategory] = useState<ReferenceCategory>(
    isReferenceCategory(params.category) ? params.category : 'rutas',
  );
  const [picked, setPicked] = useState<string | null>(draft.referenceId);
  const [gpsRetryFailed, setGpsRetryFailed] = useState(false);

  const options = useMemo(
    () => (environment.referencesAvailable ? references.filter((r) => r.category === category) : []),
    [category, environment.referencesAvailable],
  );

  const applyReference = () => {
    patchDraft({ referenceId: picked, referenceIsManual: true });
    router.back();
  };

  const continueWithout = () => {
    patchDraft({ referenceId: null, referenceIsManual: false });
    router.back();
  };

  // Goes back to V06 only if the GPS scenario is "available"; otherwise stays here.
  const retryGps = () => {
    if (environment.gps === 'available') {
      router.back();
      return;
    }
    setGpsRetryFailed(true);
  };

  return (
    <Screen>
      <TopBar title="Tu ubicación" backTo="/sos/detalles" />

      <StruckPin />

      <Txt variant="display" style={styles.title}>
        No pudimos obtener tu ubicación
      </Txt>

      {options.length > 0 ? (
        <Txt variant="body" style={styles.lead}>
          Si reconoces un lugar, selecciónalo. La referencia es opcional y no sustituye una
          posición GPS.
        </Txt>
      ) : null}

      <Segmented
        options={REFERENCE_CATEGORIES}
        value={category}
        onChange={setCategory}
        style={styles.segmented}
      />

      {options.length > 0 ? (
        <View style={styles.options}>
          {options.map((option) => (
            <RadioRow
              key={option.id}
              label={option.name}
              detail={option.detail}
              selected={picked === option.id}
              onPress={() => setPicked(option.id)}
            />
          ))}
        </View>
      ) : (
        <Card style={styles.empty}>
          <EmptyHill />
          <Txt variant="subtitle" style={styles.emptyTitle}>
            Sin referencias guardadas
          </Txt>
          <Txt variant="support" style={styles.emptyBody}>
            No hay un catálogo local disponible. No necesitas una referencia para intentar
            enviar SOS.
          </Txt>
        </Card>
      )}

      {options.length > 0 ? (
        <>
          <Button
            label="Usar esta referencia"
            onPress={applyReference}
            disabled={!picked}
            disabledHint={!picked ? 'Selecciona una referencia de la lista para usarla.' : undefined}
            style={styles.action}
          />
          <Button label="Reintentar GPS" kind="secondary" onPress={retryGps} style={styles.actionGap} />
          <Button label="Continuar sin referencia" kind="ghost" onPress={continueWithout} style={styles.actionGap} />
        </>
      ) : (
        <>
          <Button label="Continuar sin referencia" onPress={continueWithout} style={styles.action} />
          <Button label="Reintentar GPS" kind="secondary" onPress={retryGps} style={styles.actionGap} />
          <Txt variant="support" style={styles.footer}>
            Si el GPS vuelve a fallar, permanecerás aquí. No se inventará una ubicación.
          </Txt>
        </>
      )}

      {gpsRetryFailed ? (
        <Notice tone="warning" style={styles.retryNotice}>
          El GPS sigue sin estar disponible. No se inventará una ubicación.
        </Notice>
      ) : null}
    </Screen>
  );
}

/** Crossed-out location pin. */
function StruckPin() {
  return (
    <View style={styles.glyph}>
      <Svg width={52} height={52} viewBox="0 0 32 32">
        <Path
          d="M16 29s9-9.2 9-16a9 9 0 0 0-18 0c0 6.8 9 16 9 16Z"
          stroke={color.warning}
          strokeWidth={2.2}
          fill="none"
        />
        <Path d="M4 28L28 4" stroke={color.warning} strokeWidth={2.2} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Small hill glyph used for the "nothing saved" state. */
function EmptyHill() {
  return (
    <Svg width={36} height={16} viewBox="0 0 36 16">
      <Path d="M2 13 C 9 3, 16 3, 22 9 C 26 12, 30 12, 34 9" stroke={color.textSecondary} strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  glyph: { marginTop: space.sm },
  title: { marginTop: space.md },
  lead: { marginTop: space.sm, color: color.textSecondary },
  segmented: { marginTop: space.md },
  options: { gap: 12, marginTop: 12 },
  empty: { marginTop: 12 },
  emptyTitle: { marginTop: 12 },
  emptyBody: { marginTop: 6 },
  action: { marginTop: space.md },
  actionGap: { marginTop: 12 },
  footer: { marginTop: 12 },
  retryNotice: { marginTop: space.md },
});
