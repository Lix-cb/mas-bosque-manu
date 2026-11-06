import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Badge, Notice } from '@/components/feedback';
import { FormField, SelectField } from '@/components/fields';
import { Screen, TopBar } from '@/components/layout';
import { Segmented } from '@/components/segmented';
import { REFERENCE_CATEGORIES } from '@/constants/reference-categories';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { DEMO_DATE, references } from '@/data/fixtures';
import type { ReferenceCategory } from '@/types/models';
import { color, iconSize, space } from '@/constants/theme';

/**
 * V06 · Emergency details, and V06-a · Manual reference without GPS.
 * Optional fields never block the request. The coordinates are the sample values
 * from the mockup and are always labelled as such.
 */
export default function EmergencyDetailsScreen() {
  const { environment, draft, patchDraft, createAlert } = useDemo();
  const [category, setCategory] = useState<ReferenceCategory>('rutas');
  const gpsReady = environment.gps === 'available';

  const selected = references.find((r) => r.id === draft.referenceId) ?? null;
  const selectedLabel = selected
    ? draft.referenceIsManual
      ? `${selected.name} · Manual`
      : selected.name
    : null;

  const submit = () => {
    createAlert({
      description: draft.description,
      referenceId: draft.referenceId,
      referenceIsManual: draft.referenceIsManual,
    });
    router.push('/sos/estado');
  };

  return (
    <Screen>
      <TopBar title="Detalles de emergencia" backTo="/sos/confirmar" />

      <Card>
        <View style={styles.locationHeader}>
          <Feather name="map-pin" size={iconSize.sm} color={color.primary} />
          <Txt variant="subtitle">Tu ubicación</Txt>
          {gpsReady ? null : <Badge label="GPS no disponible" tone="warning" />}
        </View>

        {gpsReady ? (
          <>
            <Txt variant="section" style={styles.coords}>
              20.6502, −103.5608
            </Txt>
            <Txt variant="support" style={styles.locationLine}>
              Precisión estimada: ±18 m · GPS de muestra
            </Txt>
            <Txt variant="support">{DEMO_DATE} · 10:23:50</Txt>
          </>
        ) : (
          <>
            <Txt variant="support" style={styles.locationLine}>
              Sin coordenadas, precisión ni hora GPS.
            </Txt>
            <Txt variant="support">Referencia manual: no es una posición GPS.</Txt>
          </>
        )}
      </Card>

      <FormField
        label="Descripción (opcional)"
        value={draft.description}
        onChangeText={(description) => patchDraft({ description })}
        placeholder={gpsReady ? 'Ej. Me lastimé el tobillo' : 'Puedes dejarla vacía'}
        multiline
        style={styles.field}
      />

      <SelectField
        label="Referencia cercana (opcional)"
        valueLabel={selectedLabel}
        placeholder="Selecciona una referencia"
        // The picker opens on the category selected below.
        onPress={() => router.push({ pathname: '/sos/referencia', params: { category } })}
        style={styles.field}
      />

      <Segmented
        options={REFERENCE_CATEGORIES}
        value={category}
        onChange={setCategory}
        style={styles.segmented}
      />

      {gpsReady ? (
        <Txt variant="support" style={styles.hint}>
          Puedes enviar la alerta sin completar los campos opcionales.
        </Txt>
      ) : (
        <Notice tone="warning" style={styles.hint}>
          Referencia de muestra por validar. Puedes enviar sin descripción ni referencia.
        </Notice>
      )}

      <Button
        label="Enviar alerta"
        kind="danger"
        onPress={submit}
        accessibilityHint="Prepara la solicitud en este dispositivo. No contacta a ningún servicio de emergencia."
        style={styles.submit}
      />

      {gpsReady ? (
        <Txt variant="support" tone="warningText" style={styles.footer}>
          Datos demostrativos. GPS disponible no significa que el SOS pueda transmitirse.
        </Txt>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  coords: { marginTop: 10 },
  locationLine: { marginTop: 6 },
  field: { marginTop: space.md },
  segmented: { marginTop: 12 },
  hint: { marginTop: 12 },
  submit: { marginTop: space.md },
  footer: { marginTop: 12 },
});
