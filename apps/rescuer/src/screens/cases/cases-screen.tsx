import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { statusTone } from '@/components/incident-parts';
import { OperationScreen } from '@/components/shell';
import { Button, Card, Tag, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { STATUS_LABEL } from '@/constants/incident-status';
import { color, minTouchTarget, radius, space, typography } from '@/constants/theme';

/**
 * Cases tab (no Figma frame): local search over the demo incidents, linking to R06.
 * The search ignores case and accents.
 */
export default function CasesScreen() {
  const { incidents } = useDemo();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return incidents;
    return incidents.filter((incident) =>
      [incident.id, incident.summary, incident.title, incident.zoneLabel]
        .map(normalize)
        .some((field) => field.includes(needle)),
    );
  }, [incidents, query]);

  return (
    <OperationScreen title="Casos">
      <Card>
        <Txt variant="bodyStrong" tone="textPrimary">
          Buscar en casos de demostración
        </Txt>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Identificador, zona o descripción"
          placeholderTextColor={color.textMuted}
          accessibilityLabel="Buscar casos"
          style={styles.input}
        />
      </Card>

      {results.length === 0 ? (
        <Card style={styles.empty}>
          <Txt variant="subtitle" tone="textPrimary">
            Sin coincidencias
          </Txt>
          <Txt variant="support" style={styles.emptyBody}>
            No encontramos «{query.trim()}» en los casos locales. No es un fallo de
            conexión.
          </Txt>
          <Button
            label="Limpiar búsqueda"
            kind="secondary"
            onPress={() => setQuery('')}
            style={styles.emptyAction}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {results.map((incident) => (
            <Pressable
              key={incident.id}
              onPress={() => router.push(`/incidente/${incident.id}/seguimiento`)}
              accessibilityRole="button"
              accessibilityLabel={`${incident.id}, ${incident.summary}`}
              accessibilityHint="Abre el seguimiento del caso"
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Card>
                <View style={styles.rowHead}>
                  <Txt variant="subtitle" tone="textPrimary" style={styles.rowId}>
                    {incident.id}
                  </Txt>
                  <Tag label={STATUS_LABEL[incident.status]} tone={statusTone[incident.status]} />
                </View>
                <Txt variant="support" style={styles.rowSummary}>
                  {incident.summary}
                </Txt>
                <Txt variant="caption" tone="textMuted" style={styles.rowMeta}>
                  Recibido {incident.receivedAt} · {incident.history.length} eventos
                  registrados
                </Txt>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </OperationScreen>
  );
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .trim();
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    minHeight: minTouchTarget,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 12,
    color: color.textBody,
    ...typography.body,
  },
  list: { marginTop: space.md, gap: 12 },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowId: { flex: 1 },
  rowSummary: { marginTop: 8 },
  rowMeta: { marginTop: 8 },
  empty: { marginTop: space.md },
  emptyBody: { marginTop: 8 },
  emptyAction: { marginTop: space.md },
  pressed: { opacity: 0.8 },
});
