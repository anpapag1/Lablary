import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LabelState } from '../../types/label';

interface LayoutToggleProps {
  selected: LabelState['layout'];
  onSelect: (layout: LabelState['layout']) => void;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
  // kept for API compat
  primaryLight?: string;
}

type LayoutKey = LabelState['layout'];

const OPTIONS: { key: LayoutKey; label: string }[] = [
  { key: 'ICON_LEFT',  label: 'Icon Left'  },
  { key: 'ICON_RIGHT', label: 'Icon Right' },
  { key: 'ICON_TOP',   label: 'Icon Top'   },
  { key: 'TEXT_ONLY',  label: 'Text Only'  },
];

function Diagram({ type, color }: { type: LayoutKey; color: string }) {
  const dot  = <View style={[d.dot,  { backgroundColor: color }]} />;
  const bar  = <View style={[d.bar,  { backgroundColor: color + 'aa' }]} />;
  const barS = <View style={[d.barS, { backgroundColor: color + 'aa' }]} />;
  const bars = <View style={d.barGroup}>{bar}{barS}</View>;

  if (type === 'ICON_LEFT')  return <View style={d.row}>{dot}{bars}</View>;
  if (type === 'ICON_RIGHT') return <View style={d.row}>{bars}{dot}</View>;
  if (type === 'ICON_TOP')   return <View style={d.col}>{dot}{bar}</View>;
  // TEXT_ONLY
  return <View style={d.col}>{bar}{barS}</View>;
}

const d = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  col:      { alignItems: 'center', gap: 3 },
  barGroup: { gap: 2 },
  dot:      { width: 10, height: 10, borderRadius: 3 },
  bar:      { width: 20, height: 4,  borderRadius: 2 },
  barS:     { width: 14, height: 4,  borderRadius: 2 },
});

export function LayoutToggle({
  selected,
  onSelect,
  primary,
  text,
  textSecondary,
  border,
  surface,
}: LayoutToggleProps) {
  return (
    <View style={styles.grid}>
      {OPTIONS.map((opt) => {
        const active = selected === opt.key;
        const fg = active ? primary : textSecondary;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.75}
            style={[
              styles.tile,
              {
                borderColor: active ? primary : border,
                backgroundColor: active ? primary + '14' : surface,
              },
            ]}
          >
            <Diagram type={opt.key} color={fg} />
            <Text style={[styles.tileLabel, { color: active ? primary : text }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 6,
    padding: 10,
  },
  tile: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
