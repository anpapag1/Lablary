import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorPickerModal } from './ColorPickerModal';

interface ColorRowProps {
  label: string;
  color: string;
  pickerTitle: string;
  primary: string;
  background: string;
  surface: string;
  textColor: string;
  textSecondary: string;
  border: string;
  onChange: (color: string) => void;
}

export function ColorRow({
  label,
  color,
  pickerTitle,
  primary,
  background,
  surface,
  textColor,
  textSecondary,
  border,
  onChange,
}: ColorRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.row, { borderColor: border }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
      >
        <Text style={[styles.label, { color: textSecondary }]}>{label}</Text>
        <View style={styles.right}>
          <Text style={[styles.hex, { color: textColor }]}>{color.toUpperCase()}</Text>
          <View style={[styles.swatch, { backgroundColor: color, borderColor: border }]} />
        </View>
      </TouchableOpacity>

      <ColorPickerModal
        visible={open}
        initialColor={color}
        title={pickerTitle}
        primary={primary}
        background={background}
        surface={surface}
        text={textColor}
        textSecondary={textSecondary}
        border={border}
        onClose={() => setOpen(false)}
        onSelect={onChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hex: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
});
