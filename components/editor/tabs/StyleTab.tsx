import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { LabelState } from '../../../types/label';
import { SectionHeader } from '../../controls/SectionHeader';
import { LayoutToggle } from '../../controls/LayoutToggle';
import { ColorCardGrid } from '../../controls/ColorCardGrid';

const ASPECT_PRESETS: { label: string; w: number; h: number }[] = [
  { label: '1:1',  w: 220, h: 220 },
  { label: '2:1',  w: 280, h: 140 },
  { label: '3:1',  w: 300, h: 100 },
  { label: '4:3',  w: 280, h: 210 },
  { label: '16:9', w: 320, h: 180 },
];

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

interface StyleTabProps {
  label: LabelState;
  theme: Theme;
  onLayoutChange: (layout: LabelState['layout']) => void;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onIconColorChange: (color: string) => void;
  onPaddingChange: (padding: number) => void;
  onAspectRatioChange: (width: number, height: number) => void;
}

export function StyleTab({
  label,
  theme,
  onLayoutChange,
  onBgColorChange,
  onTextColorChange,
  onIconColorChange,
  onPaddingChange,
  onAspectRatioChange,
}: StyleTabProps) {
  const [customVisible, setCustomVisible] = useState(false);
  const [customW, setCustomW] = useState('');
  const [customH, setCustomH] = useState('');

  const presetActive = ASPECT_PRESETS.some(p => label.width === p.w && label.height === p.h);

  const applyCustom = () => {
    const w = parseInt(customW, 10);
    const h = parseInt(customH, 10);
    if (w > 0 && h > 0) {
      const scale = 280 / Math.max(w, h);
      onAspectRatioChange(Math.round(w * scale), Math.round(h * scale));
    }
    setCustomVisible(false);
  };

  return (
    <View style={styles.container}>

      {/* ── Layout ── */}
      <SectionHeader title="Layout" color={theme.textSecondary} />
      <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <LayoutToggle
          selected={label.layout}
          onSelect={onLayoutChange}
          primary={theme.primary}
          text={theme.text}
          textSecondary={theme.textSecondary}
          border={theme.border}
          surface={theme.surface}
        />
      </View>

      {/* ── Colors ── */}
      <SectionHeader title="Colors" color={theme.textSecondary} />
      <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <ColorCardGrid
          items={[
            { label: 'Background', color: label.backgroundColor, pickerTitle: 'Label Background', onChange: onBgColorChange },
            { label: 'Text',       color: label.textColor,        pickerTitle: 'Text Color',       onChange: onTextColorChange },
            { label: 'Icon',       color: label.iconColor,        pickerTitle: 'Icon Color',        onChange: onIconColorChange },
          ]}
          primary={theme.primary}
          background={theme.background}
          surface={theme.surface}
          textColor={theme.text}
          textSecondary={theme.textSecondary}
          border={theme.border}
        />
      </View>

      {/* ── Shape ── */}
      <SectionHeader title="Shape" color={theme.textSecondary} />
      <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <View style={styles.sliderRow}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Inner Padding</Text>
            <Text style={[styles.sliderValue, { color: theme.text }]}>{label.padding} px</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={48}
            step={1}
            value={label.padding}
            onValueChange={onPaddingChange}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />
        </View>
      </View>

      {/* ── Aspect Ratio ── */}
      <SectionHeader title="Aspect Ratio" color={theme.textSecondary} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ratioScroll}
      >
        {ASPECT_PRESETS.map((p) => {
          const active = label.width === p.w && label.height === p.h;
          const ratio = p.w / p.h;
          const TILE_W = 44;
          const rw = ratio >= 1 ? TILE_W : Math.round(TILE_W * ratio);
          const rh = ratio < 1  ? TILE_W : Math.round(TILE_W / ratio);
          return (
            <TouchableOpacity
              key={p.label}
              onPress={() => onAspectRatioChange(p.w, p.h)}
              activeOpacity={0.75}
              style={[
                styles.ratioTile,
                {
                  borderColor: active ? theme.primary : theme.border,
                  backgroundColor: active ? theme.primary + '14' : theme.surface,
                },
              ]}
            >
              <View style={styles.ratioPreview}>
                <View
                  style={[
                    styles.ratioRect,
                    {
                      width: rw,
                      height: rh,
                      borderColor: active ? theme.primary : theme.textSecondary,
                      backgroundColor: active ? theme.primary + '30' : 'transparent',
                    },
                  ]}
                />
              </View>
              <Text style={[styles.ratioLabel, { color: active ? theme.primary : theme.text }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* Custom tile */}
        <TouchableOpacity
          onPress={() => {
            setCustomW(String(label.width));
            setCustomH(String(label.height));
            setCustomVisible(true);
          }}
          activeOpacity={0.75}
          style={[
            styles.ratioTile,
            {
              borderColor: !presetActive ? theme.primary : theme.border,
              backgroundColor: !presetActive ? theme.primary + '14' : theme.surface,
              borderStyle: presetActive ? 'dashed' : 'solid',
            },
          ]}
        >
          <View style={styles.ratioPreview}>
            <Text style={[styles.ratioCustomIcon, { color: !presetActive ? theme.primary : theme.textSecondary }]}>⊞</Text>
          </View>
          <Text style={[styles.ratioLabel, { color: !presetActive ? theme.primary : theme.textSecondary }]}>
            {presetActive ? 'Custom' : `${label.width}:${label.height}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Custom ratio dialog ── */}
      <Modal
        visible={customVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setCustomVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.dialog, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.dialogTitle, { color: theme.text }]}>Custom Ratio</Text>
            <View style={styles.dialogInputRow}>
              <TextInput
                style={[styles.dialogInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={customW}
                onChangeText={setCustomW}
                keyboardType="number-pad"
                placeholder="W"
                placeholderTextColor={theme.textSecondary}
                maxLength={4}
              />
              <Text style={[styles.dialogColon, { color: theme.textSecondary }]}>:</Text>
              <TextInput
                style={[styles.dialogInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={customH}
                onChangeText={setCustomH}
                keyboardType="number-pad"
                placeholder="H"
                placeholderTextColor={theme.textSecondary}
                maxLength={4}
              />
            </View>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                onPress={() => setCustomVisible(false)}
                style={[styles.dialogBtn, { borderColor: theme.border }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.dialogBtnText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyCustom}
                style={[styles.dialogBtn, { borderColor: theme.primary, backgroundColor: theme.primary }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.dialogBtnText, { color: '#fff' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Shared card */
  card: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: 1.5,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },

  /* Padding slider */
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
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
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

  /* Aspect ratio scroll */
  ratioScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  ratioTile: {
    width: 72,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
  },
  ratioPreview: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioRect: {
    borderWidth: 1.5,
    borderRadius: 3,
  },
  ratioCustomIcon: {
    fontSize: 26,
    lineHeight: 30,
  },
  ratioLabel: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Custom ratio dialog */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    width: 260,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  dialogInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dialogInput: {
    width: 72,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  dialogColon: {
    fontSize: 22,
    fontWeight: '700',
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  dialogBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

