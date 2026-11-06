import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { OperationScreen } from '@/components/shell';
import { Button, Card, IconRow, Notice, Tag, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { profile, teams } from '@/data/fixtures';
import { color, minTouchTarget, radius, space } from '@/constants/theme';

/**
 * Profile tab (no Figma frame). It also hosts the demo scenario controls, so the
 * designed screens stay untouched.
 */
export default function ProfileScreen() {
  const { sync, setSync, inboxEmpty, setInboxEmpty, pending, signOut, resetDemo } = useDemo();

  const team = teams.find((t) => t.id === profile.teamId);

  return (
    <OperationScreen title="Perfil">
      <Card>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Txt variant="section" style={styles.avatarText}>
              EA
            </Txt>
          </View>
          <View style={styles.identityText}>
            <Txt variant="section" tone="textPrimary">
              {profile.displayName}
            </Txt>
            <Txt variant="support">{profile.role}</Txt>
          </View>
        </View>
        <Txt variant="caption" tone="textMuted" style={styles.station}>
          {profile.stationLabel}
        </Txt>
      </Card>

      <Card style={styles.block}>
        <Txt variant="section" tone="textPrimary">
          Equipos de respuesta
        </Txt>
        {teams.map((item) => (
          <IconRow
            key={item.id}
            icon="users"
            title={item.name}
            detail={item.note}
            tone={item.availability === 'en_linea' ? 'success' : 'info'}
          />
        ))}
        {team ? (
          <Txt variant="caption" tone="textMuted" style={styles.station}>
            Tu equipo en la demostración: {team.name}.
          </Txt>
        ) : null}
      </Card>

      <Txt variant="section" tone="textPrimary" style={styles.sectionTitle}>
        Escenarios de demostración
      </Txt>

      <Card>
        <Txt variant="bodyStrong" tone="textPrimary">
          Central simulada
        </Txt>
        <View style={styles.choices}>
          <Choice label="Conectado" selected={sync === 'conectado'} onPress={() => setSync('conectado')} />
          <Choice
            label="Sin conexión"
            selected={sync === 'sin_conexion'}
            onPress={() => setSync('sin_conexion')}
          />
        </View>
        <Txt variant="caption" tone="textMuted" style={styles.choiceHint}>
          Sin conexión, cada actualización queda pendiente y lleva a R08 en vez de
          confirmarse.
        </Txt>

        <Txt variant="bodyStrong" tone="textPrimary" style={styles.block}>
          Bandeja de alertas
        </Txt>
        <View style={styles.choices}>
          <Choice label="Con alertas" selected={!inboxEmpty} onPress={() => setInboxEmpty(false)} />
          <Choice label="Sin alertas (R09)" selected={inboxEmpty} onPress={() => setInboxEmpty(true)} />
        </View>

        {pending.length > 0 ? (
          <Notice tone="warning" style={styles.block}>
            {`Hay ${pending.length} ${pending.length === 1 ? 'cambio' : 'cambios'} sin confirmar por la central simulada.`}
          </Notice>
        ) : null}

        <Button
          label="Abrir pantalla sin conexión (R08)"
          kind="secondary"
          onPress={() => router.push('/sin-conexion')}
          style={styles.block}
        />
      </Card>

      <Card style={styles.block}>
        <Txt variant="section" tone="textPrimary">
          Disponibilidad
        </Txt>
        <View style={styles.availability}>
          <Tag label="En turno · demostración" tone="success" />
        </View>
        <Txt variant="caption" tone="textMuted" style={styles.station}>
          La disponibilidad es ficticia y no notifica a nadie.
        </Txt>
      </Card>

      <Button
        label="Restablecer datos de demostración"
        onPress={resetDemo}
        style={styles.block}
      />
      <Button
        label="Cerrar sesión de demostración"
        kind="secondary"
        onPress={() => {
          signOut();
          router.replace('/');
        }}
        style={styles.blockGap}
      />
    </OperationScreen>
  );
}

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.choice,
        selected ? styles.choiceSelected : styles.choiceIdle,
        pressed && styles.pressed,
      ]}
    >
      <Txt variant="support" style={selected ? styles.choiceLabelSelected : undefined}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: color.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: color.primary },
  identityText: { flex: 1 },
  station: { marginTop: 10 },
  block: { marginTop: space.md },
  blockGap: { marginTop: 12 },
  sectionTitle: { marginTop: space.lg, marginBottom: 12 },
  choices: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  choice: {
    minHeight: minTouchTarget - 10,
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  choiceIdle: { borderColor: color.border, backgroundColor: color.surface },
  choiceSelected: { borderColor: color.primary, backgroundColor: color.surfaceSoft },
  choiceLabelSelected: { color: color.primaryDeep, fontWeight: '600' },
  choiceHint: { marginTop: 10 },
  availability: { marginTop: 12 },
  pressed: { opacity: 0.8 },
});
