import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/buttons';
import { Notice } from '@/components/feedback';
import { TopBar } from '@/components/layout';
import { Card, Divider } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import { STAGE_LABEL, STAGE_ORDER } from '@/data/alert-stages';
import { useDemo } from '@/hooks/use-demo';
import type { AlertStage } from '@/types/models';
import { color, minTouchTarget, radius, screenPadding, space } from '@/constants/theme';

/**
 * Demo scenarios menu. Not part of the Figma board: it lets presenters reach every
 * visitor state without editing code. Opened from the amber "Prototipo académico"
 * strip at the top of every screen.
 */
export default function DemoScenariosScreen() {
  const insets = useSafeAreaInsets();
  const {
    environment,
    alert,
    patchEnvironment,
    setPermission,
    setStage,
    clearAlert,
    forceTransmissionFailure,
    setForceTransmissionFailure,
    forceDownloadFailure,
    setForceDownloadFailure,
    resetDemo,
  } = useDemo();

  const goto = (path: Parameters<typeof router.push>[0]) => () => router.push(path);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <TopBar title="Escenarios de demostración" backTo="/(tabs)/inicio" />

        <Notice tone="info">
          Todo lo que ves en esta aplicación es local y simulado. Aquí puedes cambiar las
          condiciones para recorrer cada variante del diseño.
        </Notice>

        <Section title="Condiciones del dispositivo" />

        <Card>
          <Choice
            label="GPS"
            options={[
              { value: 'available', label: 'Disponible' },
              { value: 'unavailable', label: 'No disponible' },
              { value: 'denied', label: 'Permiso denegado' },
            ]}
            value={environment.gps}
            onChange={(gps) => {
              patchEnvironment({ gps });
              setPermission('location', gps === 'denied' ? 'denied' : 'granted');
            }}
          />
          <Divider style={styles.divider} />
          <Choice
            label="Conectividad"
            options={[
              { value: 'online', label: 'Con conexión' },
              { value: 'offline', label: 'Sin conexión' },
            ]}
            value={environment.connectivity}
            onChange={(connectivity) => patchEnvironment({ connectivity })}
          />
          <Divider style={styles.divider} />
          <Choice
            label="Mapa local"
            options={[
              { value: 'saved', label: 'Guardado' },
              { value: 'missing', label: 'Sin descargar' },
              { value: 'downloading', label: 'Descargando' },
              { value: 'failed', label: 'Fallido' },
            ]}
            value={environment.mapPackage}
            onChange={(mapPackage) => patchEnvironment({ mapPackage })}
          />
          <Divider style={styles.divider} />
          <Choice
            label="Consejos guardados"
            options={[
              { value: 'saved', label: 'Disponibles' },
              { value: 'missing', label: 'Sin copia' },
              { value: 'loading', label: 'Leyendo' },
            ]}
            value={environment.tips}
            onChange={(tips) => patchEnvironment({ tips })}
          />
          <Divider style={styles.divider} />
          <Toggle
            label="Catálogo de referencias disponible"
            hint="Desactívalo para ver V07-a, sin referencias guardadas."
            value={environment.referencesAvailable}
            onChange={(referencesAvailable) => patchEnvironment({ referencesAvailable })}
          />
          <Divider style={styles.divider} />
          <Toggle
            label="Forzar fallo de transmisión"
            hint="El siguiente envío o reintento terminará en V09."
            value={forceTransmissionFailure}
            onChange={setForceTransmissionFailure}
          />
          <Divider style={styles.divider} />
          <Toggle
            label="Forzar fallo de descarga"
            hint="La siguiente descarga terminará en V14-c."
            value={forceDownloadFailure}
            onChange={setForceDownloadFailure}
          />
        </Card>

        <Section title="Ciclo de la alerta" />
        <Txt variant="support" style={styles.sectionHint}>
          Los estados posteriores a «Transmitida» representan eventos autorizados que un
          backend real tendría que confirmar. Aquí se activan a mano, nunca por el paso del
          tiempo.
        </Txt>

        <Card style={styles.stageCard}>
          {STAGE_ORDER.map((stage) => (
            <StageRow
              key={stage}
              stage={stage}
              active={alert?.stage === stage}
              onPress={() => {
                setStage(stage);
                router.push('/sos/estado');
              }}
            />
          ))}
          <Button
            label="Descartar la alerta de demostración"
            kind="secondary"
            onPress={clearAlert}
            style={styles.stageAction}
          />
        </Card>

        <Section title="Ir a una pantalla" />

        <Card style={styles.linksCard}>
          <Link id="V01" label="Bienvenida" onPress={goto('/')} />
          <Link id="V02 / V02-a" label="Permisos" onPress={goto('/permisos')} />
          <Link id="V03" label="Configuración incompleta" onPress={goto('/preparacion')} />
          <Link id="V04 / V04-a" label="Inicio" onPress={goto('/(tabs)/inicio')} />
          <Link id="V05" label="Confirmar emergencia" onPress={goto('/sos/confirmar')} />
          <Link id="V06 / V06-a" label="Detalles de emergencia" onPress={goto('/sos/detalles')} />
          <Link id="V07 / V07-a" label="Ubicación no disponible" onPress={goto('/sos/referencia')} />
          <Link id="V08 · a–g" label="Estado de emergencia" onPress={goto('/sos/estado')} />
          <Link id="V09 / V09-a" label="Error de comunicación" onPress={goto('/sos/error')} />
          <Link id="V10" label="Alerta recibida" onPress={goto('/sos/recibida')} />
          <Link id="V11 · a–c" label="Mapa sin conexión" onPress={goto('/(tabs)/mapa')} />
          <Link id="V12" label="Kit médico" onPress={goto('/kit/kit-la-mesa')} />
          <Link id="V13 / a / b" label="Consejos de seguridad" onPress={goto('/(tabs)/consejos')} />
          <Link id="V14 · a–d" label="Descarga del mapa" onPress={goto('/mapa-descarga')} last />
        </Card>

        <Button
          label="Restablecer datos de demostración"
          onPress={() => {
            resetDemo();
            router.replace('/');
          }}
          style={styles.reset}
        />
      </ScrollView>
    </View>
  );
}

function Section({ title }: { title: string }) {
  return (
    <Txt variant="section" style={styles.section}>
      {title}
    </Txt>
  );
}

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View>
      <Txt variant="bodyStrong">{label}</Txt>
      <View style={styles.choiceRow}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${label}: ${option.label}`}
              style={({ pressed }) => [
                styles.choice,
                selected && styles.choiceSelected,
                pressed && styles.pressed,
              ]}
            >
              <Txt variant="caption" style={selected ? styles.choiceLabelSelected : undefined}>
                {option.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Txt variant="bodyStrong">{label}</Txt>
        <Txt variant="caption" style={styles.toggleHint}>
          {hint}
        </Txt>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: color.surfaceSoft, false: color.border }}
        thumbColor={value ? color.primary : color.surface}
      />
    </View>
  );
}

function StageRow({
  stage,
  active,
  onPress,
}: {
  stage: AlertStage;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ir al estado ${STAGE_LABEL[stage]}`}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.stageRow, active && styles.stageRowActive, pressed && styles.pressed]}
    >
      <Txt variant="body" style={active ? styles.stageLabelActive : undefined}>
        {STAGE_LABEL[stage]}
      </Txt>
    </Pressable>
  );
}

function Link({
  id,
  label,
  onPress,
  last = false,
}: {
  id: string;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${id}, ${label}`}
      style={({ pressed }) => [styles.link, !last && styles.linkBorder, pressed && styles.pressed]}
    >
      <Txt variant="overline" tone="textMuted" style={styles.linkId}>
        {id}
      </Txt>
      <Txt variant="body" style={styles.linkLabel}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.background },
  content: { paddingHorizontal: screenPadding },
  section: { marginTop: space.lg, marginBottom: 12 },
  sectionHint: { marginTop: -6, marginBottom: 12 },
  divider: { marginVertical: 14 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  choice: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  choiceSelected: { backgroundColor: color.surfaceSoft, borderColor: color.primary },
  choiceLabelSelected: { color: color.primaryDeep, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleText: { flex: 1 },
  toggleHint: { marginTop: 2 },
  stageCard: {},
  stageRow: {
    minHeight: minTouchTarget,
    justifyContent: 'center',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  stageRowActive: { backgroundColor: color.surfaceSoft },
  stageLabelActive: { color: color.primaryDeep, fontWeight: '600' },
  stageAction: { marginTop: 12 },
  linksCard: { paddingVertical: 0 },
  link: { minHeight: minTouchTarget, justifyContent: 'center', paddingVertical: 12 },
  linkBorder: { borderBottomWidth: 1, borderBottomColor: color.border },
  linkId: {},
  linkLabel: { marginTop: 2 },
  reset: { marginTop: space.lg },
  pressed: { opacity: 0.75 },
});
