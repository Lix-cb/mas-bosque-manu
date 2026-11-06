import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Badge, Notice } from '@/components/feedback';
import { SearchInput } from '@/components/fields';
import { Screen } from '@/components/layout';
import { MockMap, defaultMarkers, type MapMarker } from '@/components/mock-map';
import { Segmented } from '@/components/segmented';
import { REFERENCE_CATEGORIES } from '@/constants/reference-categories';
import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { useDemo } from '@/hooks/use-demo';
import { kits, references } from '@/data/fixtures';
import type { ReferenceCategory } from '@/types/models';
import { color, space } from '@/constants/theme';

/**
 * V11 · Offline map, with V11-a (reference sheet), V11-b (no GPS) and V11-c (no results).
 *
 * - An empty search result is not a network error.
 * - Without a position, no distance is calculated.
 * - Without a saved map, no map is drawn; the user is sent to V14 instead.
 */
export default function OfflineMapScreen() {
  const { environment } = useDemo();
  const [category, setCategory] = useState<ReferenceCategory>('rutas');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MapMarker | null>(null);

  const hasMap = environment.mapPackage === 'saved';
  const gpsReady = environment.gps === 'available';

  const results = useMemo(() => {
    const inCategory = references.filter((r) => r.category === category);
    const needle = query.trim().toLocaleLowerCase('es-MX');
    if (!needle) return inCategory;
    return inCategory.filter((r) => r.name.toLocaleLowerCase('es-MX').includes(needle));
  }, [category, query]);

  const noMatches = query.trim().length > 0 && results.length === 0;
  const sheetReference = selected ? references.find((r) => r.id === selected.id) ?? null : null;

  // No local copy: show the V14 entry point instead of a made-up map.
  if (!hasMap) return <NoResourcesBody />;

  return (
    <Screen>
      <Txt variant="section" style={styles.header}>
        Mapa sin conexión
      </Txt>

      {!gpsReady ? (
        <Notice tone="warning" style={styles.gpsNotice}>
          GPS no disponible. No se muestra tu posición.
        </Notice>
      ) : null}

      {sheetReference ? null : (
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar ruta, lugar o señal"
          label={noMatches ? 'Buscar en datos locales' : undefined}
          style={styles.search}
        />
      )}

      <Segmented
        options={REFERENCE_CATEGORIES}
        value={category}
        onChange={setCategory}
        style={styles.segmented}
      />

      {noMatches ? (
        <NoMatchesBody onClear={() => setQuery('')} />
      ) : (
        <>
          <MockMap
            height={232}
            showUser={gpsReady}
            markers={defaultMarkers}
            selectedMarkerId={selected?.id ?? null}
            onSelectMarker={(marker) =>
              // Kits have their own detail screen (V12); other markers open the sheet.
              marker.kind === 'kit' ? router.push(`/kit/${marker.id}`) : setSelected(marker)
            }
            style={styles.map}
          />

          {sheetReference ? (
            <Card style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <Txt variant="section" style={styles.sheetTitle}>
                {sheetReference.name}
              </Txt>
              <Badge
                label={sheetReference.sheetBadge ?? 'Referencia local'}
                tone="success"
                style={styles.sheetBadge}
              />
              <Txt variant="body" style={styles.sheetBody}>
                {sheetReference.sheet}
              </Txt>
              <Button
                label="Cerrar ficha"
                kind="secondary"
                onPress={() => setSelected(null)}
                style={styles.sheetAction}
              />
            </Card>
          ) : (
            <>
              <Badge
                label={
                  gpsReady
                    ? 'Copia local descargada · Muestra v0.1'
                    : 'Mapa local de muestra disponible'
                }
                tone="success"
                style={styles.badge}
              />

              <Card style={styles.kitCard}>
                <Txt variant="subtitle">
                  {gpsReady ? 'Kit conocido más cercano' : 'Kit conocido · Sendero La Mesa'}
                </Txt>
                {gpsReady ? (
                  <>
                    <Txt variant="support" style={styles.kitLine}>
                      {kits[0].trailName} · 650 m de muestra
                    </Txt>
                    <Txt variant="support">Ubicación y distancia pendientes de validar.</Txt>
                  </>
                ) : (
                  <>
                    <Txt variant="support" style={styles.kitLine}>
                      Distancia no calculable sin posición.
                    </Txt>
                    <Txt variant="support">
                      No se puede determinar cuál kit está más cerca.
                    </Txt>
                    <Txt variant="support">Ubicación del kit por validar.</Txt>
                  </>
                )}
                <Button
                  label="Abrir kit médico"
                  kind="secondary"
                  onPress={() => router.push(`/kit/${kits[0].id}`)}
                  style={styles.kitAction}
                />
              </Card>

              <Txt variant="caption" tone="textMuted" style={styles.footer}>
                La cartografía es ilustrativa. No indica una ruta segura ni reemplaza la
                señalización del bosque.
              </Txt>
            </>
          )}
        </>
      )}
    </Screen>
  );
}

/** V11-c: the search has no matches. */
function NoMatchesBody({ onClear }: { onClear: () => void }) {
  return (
    <View style={styles.emptyWrapper}>
      <Feather name="x-circle" size={30} color={color.textSecondary} />
      <Txt variant="display" style={styles.emptyTitle}>
        No hay coincidencias
      </Txt>
      <Txt variant="body" style={styles.emptyBody}>
        No encontramos esa referencia en la copia local. Prueba otro nombre o cambia de
        categoría.
      </Txt>
      <Button label="Limpiar búsqueda" kind="secondary" onPress={onClear} style={styles.emptyAction} />
      <Badge label="Mapa guardado · No es un fallo de red" tone="success" style={styles.badge} />
    </View>
  );
}

/** Shown when there is no saved map; links to V14. */
function NoResourcesBody() {
  return (
    <Screen>
      <Txt variant="section" style={styles.header}>
        Mapa sin conexión
      </Txt>
      <View style={styles.emptyWrapper}>
        <Feather name="map" size={30} color={color.textSecondary} />
        <Txt variant="display" style={styles.emptyTitle}>
          Mapa no disponible
        </Txt>
        <Txt variant="body" style={styles.emptyBody}>
          Aún no has descargado los recursos del bosque. Necesitas conexión para
          guardarlos antes de consultarlos sin internet.
        </Txt>
        <Button
          label="Preparar mapa"
          onPress={() => router.push('/mapa-descarga')}
          style={styles.emptyAction}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.md, marginBottom: space.md },
  gpsNotice: { marginBottom: 12 },
  search: { marginBottom: 12 },
  segmented: { marginBottom: space.md },
  map: {},
  badge: { marginTop: 12 },
  kitCard: { marginTop: 12 },
  kitLine: { marginTop: 8 },
  kitAction: { marginTop: 12 },
  footer: { marginTop: 12 },
  sheet: { marginTop: 12 },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {},
  sheetBadge: { marginTop: 8 },
  sheetBody: { marginTop: 12, color: color.textSecondary },
  sheetAction: { marginTop: space.md },
  emptyWrapper: { marginTop: space.md },
  emptyTitle: { marginTop: 12 },
  emptyBody: { marginTop: 8, color: color.textSecondary },
  emptyAction: { marginTop: space.md },
});
