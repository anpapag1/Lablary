import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  primary: string;
  textColor: string;
  textSecondary: string;
  onChange: (value: number) => void;
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  formatValue,
  primary,
  textColor,
  textSecondary,
  onChange,
}: LabeledSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: textColor }]}>
          {formatValue ? formatValue(value) : `${Math.round(value)}${unit}`}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={primary}
        maximumTrackTintColor={primary + '33'}
        thumbTintColor={primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 36,
  },
});

