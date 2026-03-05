import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorPickerModal } from './ColorPickerModal';

interface ColorCardItem {
  label: string;
  color: string;
  pickerTitle: string;
  onChange: (color: string) => void;
}

interface ColorCardGridProps {
  items: ColorCardItem[];
  primary: string;
  background: string;
  surface: string;
  textColor: string;
  textSecondary: string;
  border: string;
}

function luminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ColorCardGrid({
  items,
  primary,
  background,
  surface,
  textColor,
  textSecondary,
  border,
}: ColorCardGridProps) {
  const [pickerItem, setPickerItem] = useState<ColorCardItem | null>(null);

  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const lum = luminance(item.color);
        const labelColor = lum > 0.35 ? '#000000' : '#ffffff';
        return (
          <TouchableOpacity
            key={item.label}
            style={[styles.card, { backgroundColor: item.color, borderColor: border }]}
            onPress={() => setPickerItem(item)}
            activeOpacity={0.75}
          >
            <Text style={[styles.cardLabel, { color: labelColor }]}>{item.label}</Text>
            <Text style={[styles.cardHex, { color: labelColor + 'cc' }]}>
              {item.color.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}

      {pickerItem && (
        <ColorPickerModal
          visible
          title={pickerItem.pickerTitle}
          initialColor={pickerItem.color}
          primary={primary}
          background={background}
          surface={surface}
          text={textColor}
          textSecondary={textSecondary}
          border={border}
          onClose={() => setPickerItem(null)}
          onSelect={(color) => {
            pickerItem.onChange(color);
            setPickerItem(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  card: {
    flex: 1,
    minWidth: '28%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardHex: {
    fontSize: 11,
    fontWeight: '400',
  },
});
