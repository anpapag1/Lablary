import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { LabelState } from '../../../types/label';
import { FONTS } from '../../../constants/fonts';
import { SectionHeader } from '../../controls/SectionHeader';
import { FontPicker } from '../../typography/FontPicker';
import { ColorRow } from '../../controls/ColorRow';

interface Theme {
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
  background: string;
  card: string;
}

interface TextTabProps {
  label: LabelState;
  theme: Theme;
  onTextChange: (text: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onFontWeightChange: (weight: 'regular' | 'bold') => void;
  onTextColorChange: (color: string) => void;
}

const MAX_CHARS = 120;

export function TextTab({
  label,
  theme,
  onTextChange,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onTextColorChange,
}: TextTabProps) {
  const currentFontEntry = FONTS.find(f => f.regularFamily === label.fontFamily);
  const hasBold = !!currentFontEntry?.boldFamily;

  return (
    <View style={styles.container}>

      {/* ── Content ── */}
      <SectionHeader title="Content" color={theme.textSecondary} />
      <View style={[styles.inputCard, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <TextInput
          style={[styles.input, { color: theme.text, fontFamily: label.fontFamily }]}
          value={label.text}
          onChangeText={(t) => { if (t.length <= MAX_CHARS) onTextChange(t); }}
          placeholder="Label text…"
          placeholderTextColor={theme.textSecondary}
          multiline
          blurOnSubmit
          returnKeyType="done"
          autoCorrect={false}
        />
      </View>

      {/* ── Font ── */}
      <SectionHeader title="Font" color={theme.textSecondary} />
      <FontPicker
        selected={label.fontFamily}
        onSelect={onFontChange}
        primary={theme.primary}
        primaryLight={theme.primaryLight}
        text={theme.text}
        textSecondary={theme.textSecondary}
        border={theme.border}
        background={theme.background}
      />

      {/* ── Size & Weight ── */}
      <SectionHeader title="Size & Weight" color={theme.textSecondary} />
      <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}>

        {/* Size slider */}
        <View style={styles.sliderRow}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Size</Text>
            <Text style={[styles.sliderValue, { color: theme.text }]}>{label.fontSize} px</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={8}
            maximumValue={120}
            step={1}
            value={label.fontSize}
            onValueChange={onFontSizeChange}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Weight segmented */}
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Weight</Text>
          <View style={[styles.segmented, { borderColor: theme.border }]}>
            {(['regular', 'bold'] as const).map((w) => {
              const active = label.fontWeight === w;
              const disabled = w === 'bold' && !hasBold;
              return (
                <TouchableOpacity
                  key={w}
                  onPress={() => { if (!disabled) onFontWeightChange(w); }}
                  activeOpacity={disabled ? 1 : 0.75}
                  style={[
                    styles.segment,
                    { backgroundColor: active && !disabled ? theme.primary : 'transparent' },
                    disabled && styles.segmentDisabled,
                  ]}
                >
                  <Text style={[
                    styles.segmentText,
                    { color: active && !disabled ? '#fff' : theme.text },
                    disabled && { color: theme.textSecondary },
                  ]}>
                    {w === 'regular' ? 'Regular' : 'Bold'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Text input */
  inputCard: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 14,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
    paddingHorizontal: 12,
    paddingBottom: 8,
    letterSpacing: 0.3,
  },

  /* Generic card */
  card: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: 1.5,
  },

  /* Card row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 52,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },

  /* Size slider */
  sliderRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 36,
    marginHorizontal: -6,
  },

  /* Weight segmented */
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  segmentDisabled: {
    opacity: 0.3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

