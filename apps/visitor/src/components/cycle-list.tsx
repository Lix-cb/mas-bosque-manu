import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Card } from '@/components/surfaces';
import { Txt } from '@/components/typography';
import type { StagePresentation } from '@/data/alert-stages';
import { color, iconSize, space } from '@/constants/theme';

/**
 * The three fixed rows of V08: preparation, transmission and reception.
 * A green check means the step finished in the simulation; the amber arc means it
 * is still pending. Neither one implies that real help is on the way.
 */
export function CycleList({ cycle }: { cycle: StagePresentation['cycle'] }) {
  return (
    <Card>
      <CycleRow title="Preparación" {...cycle.preparation} />
      <CycleRow title="Transmisión" {...cycle.transmission} />
      <CycleRow title="Recepción" {...cycle.reception} last />
    </Card>
  );
}

function CycleRow({
  title,
  state,
  detail,
  last = false,
}: {
  title: string;
  state: 'done' | 'pending';
  detail: string;
  last?: boolean;
}) {
  return (
    <View
      style={[styles.row, last && styles.rowLast]}
      accessibilityLabel={`${title}. ${state === 'done' ? 'Completada en la simulación' : 'Pendiente'}. ${detail}`}
    >
      {state === 'done' ? (
        <Feather name="check-circle" size={iconSize.md} color={color.primary} />
      ) : (
        <PendingSpiral />
      )}
      <View style={styles.text}>
        <Txt variant="bodyStrong">{title}</Txt>
        <Txt variant="support">{detail}</Txt>
      </View>
    </View>
  );
}

/** Open arc used as the "in progress" glyph. */
function PendingSpiral() {
  return (
    <Svg width={iconSize.md} height={iconSize.md} viewBox="0 0 24 24">
      <Path
        d="M20 12a8 8 0 1 0-3.2 6.4"
        stroke={color.warning}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: space.md,
  },
  rowLast: { paddingBottom: 0 },
  text: { flex: 1, gap: 2 },
});
