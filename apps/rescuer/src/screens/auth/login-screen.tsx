import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OperationHeader, ShieldGlyph } from '@/components/shell';
import { Button, Card, Txt } from '@/components/ui';
import { useDemo } from '@/hooks/use-demo';
import { color, iconSize, minTouchTarget, radius, screenPadding, space, typography } from '@/constants/theme';

/**
 * R01 · Sign in. There is no real authentication: any input opens the demo
 * session, and nothing is stored or sent.
 */
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useDemo();
  const [user, setUser] = useState('equipo.alfa@demo.mx');
  const [password, setPassword] = useState('demostracion');

  const enter = () => {
    signIn();
    router.replace('/(tabs)/alertas');
  };

  return (
    <View style={styles.screen}>
      <OperationHeader title="Acceso del equipo" showActions={false} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space.xl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card tone="soft" style={styles.intro}>
          <View style={styles.introHead}>
            <ShieldGlyph size={24} tint={color.primary} />
            <Txt variant="section" tone="textPrimary">
              Acceso seguro al sistema
            </Txt>
          </View>
          <Txt variant="support" style={styles.introBody}>
            Ingresa para consultar y atender emergencias registradas.
          </Txt>
        </Card>

        <Card style={styles.form}>
          <Txt variant="title" tone="textPrimary">
            Iniciar sesión
          </Txt>

          <Field
            icon="user"
            label="Usuario"
            hint="Correo del personal autorizado"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
          <Field
            icon="lock"
            label="Contraseña"
            hint="Credencial de demostración"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            label="Ingresar a la central"
            onPress={enter}
            accessibilityHint="Entra al entorno de demostración. No valida credenciales."
            style={styles.submit}
          />
        </Card>

        <Card tone="soft" style={styles.restricted}>
          <View style={styles.restrictedHead}>
            <ShieldGlyph size={20} tint={color.primary} />
            <Txt variant="bodyStrong" tone="textPrimary">
              Acceso restringido
            </Txt>
          </View>
          <Txt variant="caption" style={styles.restrictedBody}>
            Solo personal de emergencias.
          </Txt>
        </Card>

        <Txt variant="overline" tone="textMuted" style={styles.footer}>
          MÁS BOSQUE MANU · ENTORNO DEMOSTRATIVO
        </Txt>
      </ScrollView>
    </View>
  );
}

function Field({
  icon,
  label,
  hint,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  hint: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>
        <Feather name={icon} size={iconSize.sm} color={color.primary} />
      </View>
      <View style={styles.fieldBody}>
        <Txt variant="bodyStrong" tone="textPrimary">
          {label}
        </Txt>
        <Txt variant="caption" style={styles.fieldHint}>
          {hint}
        </Txt>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          accessibilityLabel={label}
          placeholderTextColor={color.textMuted}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.background },
  content: { paddingHorizontal: screenPadding, paddingTop: space.lg },
  intro: {},
  introHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  introBody: { marginTop: 10 },
  form: { marginTop: space.lg },
  field: { flexDirection: 'row', gap: 12, marginTop: space.md },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: color.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldBody: { flex: 1 },
  fieldHint: { marginTop: 2 },
  input: {
    marginTop: 8,
    minHeight: minTouchTarget,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 12,
    color: color.textBody,
    ...typography.body,
  },
  submit: { marginTop: space.lg },
  restricted: { marginTop: space.lg },
  restrictedHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  restrictedBody: { marginTop: 6 },
  footer: { marginTop: space.xl },
});
