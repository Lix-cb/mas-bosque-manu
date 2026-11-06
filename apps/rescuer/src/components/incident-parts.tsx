import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Card, Tag, Txt, type ChipTone } from '@/components/ui';
import { STATUS_LABEL } from '@/constants/incident-status';
import type { DemoIncident, IncidentEvent, IncidentPriority, IncidentStatus } from '@/types/models';
import { color, iconSize, radius, space } from '@/constants/theme';

export const priorityTone: Record<IncidentPriority, ChipTone> = {
  alta: 'danger',
  media: 'warning',
  baja: 'info',
};

export const statusTone: Record<IncidentStatus, ChipTone> = {
  nueva: 'info',
  recibido: 'info',
  despachado: 'warning',
  en_sitio: 'warning',
  evacuado: 'success',
  cerrado: 'neutral',
};

/** Inbox card (R02). */
export function IncidentCard({ incident, onPress }: { incident: DemoIncident; onPress: () => void }) {
  const badgeLabel = incident.status === 'nueva' ? 'Nueva' : incident.priority;
  const badgeTone = incident.status === 'nueva' ? 'info' : priorityTone[incident.priority];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${incident.id}. ${incident.summary}. Prioridad ${incident.priority}.`}
      accessibilityHint="Abre el detalle del incidente"
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Card>
        <View style={styles.cardHead}>
          <Feather name="alert-triangle" size={iconSize.md} color={color.danger} />
          <Txt variant="section" tone="textPrimary" style={styles.cardId}>
            {incident.id}
          </Txt>
          <Tag label={badgeLabel} tone={badgeTone} />
        </View>

        <Txt variant="body" style={styles.cardSummary}>
          {incident.summary}
        </Txt>

        <View style={styles.cardFoot}>
          <Feather name="map-pin" size={15} color={color.textSecondary} />
          <Txt variant="support" tone="primary">
            {incident.ageLabel}
          </Txt>
          <Txt variant="support" tone="textMuted">
            ·
          </Txt>
          <Txt variant="support" tone="primary">
            Ver detalle →
          </Txt>
        </View>
      </Card>
    </Pressable>
  );
}

/** Response cycle list in R05. Only the allowed next step can be selected. */
export function ResponseCycle({
  incident,
  allowed,
  selected,
  onSelect,
}: {
  incident: DemoIncident;
  allowed: IncidentStatus[];
  selected: IncidentStatus | null;
  onSelect: (status: IncidentStatus) => void;
}) {
  const shown: IncidentStatus[] = ['recibido', 'despachado', 'en_sitio', 'evacuado', 'cerrado'];
  const currentIndex = shown.indexOf(incident.status);

  return (
    <Card>
      <Txt variant="section" tone="textPrimary">
        Ciclo de respuesta
      </Txt>
      <View style={styles.cycleList}>
        {shown.map((status, index) => {
          const done = currentIndex >= index && currentIndex >= 0;
          const selectable = allowed.includes(status);
          const isSelected = selected === status;
          const time = timeOf(incident.history, status);
          const detail = done
            ? time
              ? `Confirmado · ${time}`
              : 'Sin registro en la bitácora'
            : selectable
              ? 'Siguiente etapa disponible'
              : `Pendiente de ${STATUS_LABEL[shown[Math.max(index - 1, 0)]].toLocaleLowerCase('es-MX')}`;

          const row = (
            <View style={[styles.cycleRow, isSelected && styles.cycleRowSelected]}>
              <View
                style={[
                  styles.cycleIcon,
                  done && styles.cycleIconDone,
                  selectable && styles.cycleIconNext,
                ]}
              >
                <Feather
                  name={done ? 'check-circle' : selectable ? 'corner-down-right' : 'map-pin'}
                  size={iconSize.sm}
                  color={done ? color.primary : selectable ? color.primary : color.textMuted}
                />
              </View>
              <View style={styles.cycleText}>
                <Txt variant="bodyStrong" tone="textPrimary">
                  {STATUS_LABEL[status]}
                </Txt>
                <Txt variant="support">{detail}</Txt>
              </View>
            </View>
          );

          if (!selectable) return <View key={status}>{row}</View>;

          return (
            <Pressable
              key={status}
              onPress={() => onSelect(status)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Marcar como ${STATUS_LABEL[status]}`}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              {row}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

/** Incident log (R06). */
export function IncidentTimeline({
  events,
  nextStep,
  style,
}: {
  events: IncidentEvent[];
  nextStep?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Card style={style}>
      <Txt variant="section" tone="textPrimary">
        Historial de atención
      </Txt>
      <View style={styles.timeline}>
        {events.map((event) => (
          <View key={event.id} style={styles.timelineRow}>
            <View style={styles.timelineIcon}>
              <Feather name="check-circle" size={iconSize.sm} color={color.primary} />
            </View>
            <View style={styles.timelineText}>
              <Txt variant="bodyStrong" tone="textPrimary">
                {event.time} · {event.title}
              </Txt>
              <Txt variant="support">{event.detail}</Txt>
            </View>
          </View>
        ))}
        {nextStep ? (
          <View style={styles.timelineRow}>
            <View style={styles.timelineIcon}>
              <Feather name="circle" size={iconSize.sm} color={color.textMuted} />
            </View>
            <View style={styles.timelineText}>
              <Txt variant="bodyStrong" tone="textPrimary">
                Siguiente paso
              </Txt>
              <Txt variant="support">{nextStep}</Txt>
            </View>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

/**
 * Schematic map for R04: a suggested path from the start point to the incident.
 * It is an illustration, not cartography or turn-by-turn navigation.
 */
export function IncidentMap({ height = 260, style }: { height?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[styles.map, { height }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mapa ilustrativo con la ruta sugerida hacia el incidente"
    >
      <Svg width="100%" height="100%" viewBox="0 0 340 260" preserveAspectRatio="xMidYMid slice">
        <Path d="M0 0 H340 V104 C 250 128, 140 76, 0 112 Z" fill={color.mapFillSoft} opacity={0.6} />
        <Path d="M0 164 C 110 140, 230 190, 340 158 V260 H0 Z" fill={color.mapFillSoft} opacity={0.5} />
        <Path
          d="M10 92 C 90 70, 150 128, 214 108 S 318 76, 338 96"
          stroke={color.mapPath}
          strokeWidth={5}
          strokeDasharray="12 10"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M26 206 C 120 190, 180 220, 250 196 S 320 168, 336 176"
          stroke={color.mapPath}
          strokeWidth={5}
          strokeDasharray="12 10"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M44 224 C 92 206, 120 160, 160 142 C 206 122, 250 110, 288 62"
          stroke={color.mapTrack}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={160} cy={142} r={9} fill={color.mapTrack} />
        <Circle cx={44} cy={224} r={9} fill={color.mapStart} />
        <Circle cx={44} cy={224} r={13} stroke={color.mapPath} strokeWidth={3} fill="none" />
        <Path
          d="M288 44 c-7 0-12 5-12 12 0 9 12 22 12 22s12-13 12-22c0-7-5-12-12-12Z"
          fill={color.mapEnd}
        />
        <Circle cx={288} cy={56} r={4.4} fill={color.mapPath} />
      </Svg>
    </View>
  );
}

function timeOf(history: IncidentEvent[], status: IncidentStatus): string | undefined {
  return history.find((event) => event.status === status)?.time;
}

const styles = StyleSheet.create({
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardId: { flex: 1 },
  cardSummary: { marginTop: 12 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },

  cycleList: { marginTop: 12 },
  cycleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 6, borderRadius: radius.sm },
  cycleRowSelected: { backgroundColor: color.surfaceSoft },
  cycleIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: color.neutralSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleIconDone: { backgroundColor: color.surfaceSoft },
  cycleIconNext: { backgroundColor: color.surfaceSoft },
  cycleText: { flex: 1 },

  timeline: { marginTop: 12, gap: space.sm },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: color.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineText: { flex: 1, paddingTop: 4 },

  map: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: color.mapFill },
  pressed: { opacity: 0.8 },
});
