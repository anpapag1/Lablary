import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import {
  Settings,
  ThemeSetting,
  ExportQuality,
  ALL_ICON_PREFIXES,
  ICON_PREFIX_NAMES,
  ASPECT_RATIO_PRESETS,
} from '../../hooks/useSettings';
import { FONTS } from '../../constants/fonts';
import { LayoutToggle } from '../controls/LayoutToggle';
import { FontPicker } from '../typography/FontPicker';

interface Theme {
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
  background: string;
  card: string;
  error: string;
}

interface SettingsScreenProps {
  visible: boolean;
  settings: Settings;
  theme: Theme;
  onClose: () => void;
  onSetTheme: (t: ThemeSetting) => void;
  onSetDefaultFont: (f: string) => void;
  onSetDefaultFontSize: (s: number) => void;
  onSetDefaultFontWeight: (w: 'regular' | 'bold') => void;
  onSetDefaultLayout: (l: 'ICON_LEFT' | 'ICON_RIGHT' | 'ICON_TOP' | 'TEXT_ONLY') => void;
  onSetDefaultAspectRatio: (k: string) => void;
  onSetExportQuality: (q: ExportQuality) => void;
  onToggleIconLibrary: (prefix: string) => void;
  onResetAll: () => void;
}

// ─── Reusable inner components ──────────────────────────────────────────────

function SectionLabel({ title, color }: { title: string; color: string }) {
  return <Text style={[styles.sectionLabel, { color }]}>{title.toUpperCase()}</Text>;
}

function Card({ children, bg, border }: { children: React.ReactNode; bg: string; border: string }) {
  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
      {children}
    </View>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  primary,
  surface,
  text,
  textSecondary,
  border,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  primary: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}) {
  return (
    <View style={[styles.segmented, { backgroundColor: surface, borderColor: border }]}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.segment, active && { backgroundColor: primary }]}
            activeOpacity={0.75}
          >
            <Text style={[styles.segmentText, { color: active ? '#fff' : textSecondary }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Chips<T extends string>({
  options,
  value,
  onChange,
  primary,
  surface,
  textSecondary,
  border,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  primary: string;
  surface: string;
  textSecondary: string;
  border: string;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[
              styles.chip,
              { borderColor: active ? primary : border, backgroundColor: active ? primary : surface },
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, { color: active ? '#fff' : textSecondary }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function RowDivider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

function SettingRow({
  label,
  sublabel,
  right,
  textColor,
  secondaryColor,
}: {
  label: string;
  sublabel?: string;
  right: React.ReactNode;
  textColor: string;
  secondaryColor: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLabels}>
        <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
        {sublabel && <Text style={[styles.rowSublabel, { color: secondaryColor }]}>{sublabel}</Text>}
      </View>
      {right}
    </View>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function SettingsScreen({
  visible,
  settings,
  theme,
  onClose,
  onSetTheme,
  onSetDefaultFont,
  onSetDefaultFontSize,
  onSetDefaultFontWeight,
  onSetDefaultLayout,
  onSetDefaultAspectRatio,
  onSetExportQuality,
  onToggleIconLibrary,
  onResetAll,
}: SettingsScreenProps) {
  const themeOptions: { key: ThemeSetting; label: string }[] = [
    { key: 'system', label: 'System' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  const weightOptions: { key: 'regular' | 'bold'; label: string }[] = [
    { key: 'regular', label: 'Regular' },
    { key: 'bold', label: 'Bold' },
  ];

  const { width: screenWidth } = useWindowDimensions();
  const tileWidth = (screenWidth - 32 - 10) / 2; // 2 cols, 16px side padding each, 10px gap

  const qualityOptions: { key: ExportQuality; label: string }[] = [
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
  ];

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Defaults',
      'This will reset all settings back to their defaults. Your current label will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: onResetAll },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Appearance ─────────────────────────────── */}
          <SectionLabel title="Appearance" color={theme.textSecondary} />
          <Card bg={theme.card} border={theme.border}>
            <SettingRow
              label="Theme"
              textColor={theme.text}
              secondaryColor={theme.textSecondary}
              right={
                <SegmentedControl
                  options={themeOptions}
                  value={settings.theme}
                  onChange={onSetTheme}
                  primary={theme.primary}
                  surface={theme.surface}
                  text={theme.text}
                  textSecondary={theme.textSecondary}
                  border={theme.border}
                />
              }
            />
          </Card>

          {/* ── Defaults ───────────────────────────────── */}
          <SectionLabel title="Defaults" color={theme.textSecondary} />
          <Card bg={theme.card} border={theme.border}>
            <View style={styles.defaultsPad}>

              {/* Font */}
              <Text style={[styles.subLabel, { color: theme.textSecondary }]}>FONT</Text>
                <FontPicker
                  selected={settings.defaultFont}
                  onSelect={onSetDefaultFont}
                  primary={theme.primary}
                  primaryLight={theme.primary + '33'}
                  text={theme.text}
                  textSecondary={theme.textSecondary}
                  border={theme.border}
                  background={theme.background}
                  wrapperStyle={styles.fontPickerWrapper}
                />

              {/* Size & Weight */}
              <Text style={[styles.subLabel, { color: theme.textSecondary }]}>SIZE &amp; WEIGHT</Text>
              <View style={[styles.tabCard, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <View style={styles.tabSliderRow}>
                  <View style={styles.tabSliderHeader}>
                    <Text style={[styles.tabRowLabel, { color: theme.textSecondary }]}>Size</Text>
                    <Text style={[styles.tabSliderValue, { color: theme.text }]}>{settings.defaultFontSize} px</Text>
                  </View>
                  <Slider
                    style={styles.tabSlider}
                    minimumValue={8}
                    maximumValue={120}
                    step={1}
                    value={settings.defaultFontSize}
                    onValueChange={onSetDefaultFontSize}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={theme.primary}
                  />
                </View>
                <View style={[styles.tabDivider, { backgroundColor: theme.border }]} />
                <View style={styles.tabRow}>
                  <Text style={[styles.tabRowLabel, { color: theme.textSecondary }]}>Weight</Text>
                  <View style={[styles.tabSegmented, { borderColor: theme.border }]}>
                    {weightOptions.map((w) => {
                      const active = settings.defaultFontWeight === w.key;
                      return (
                        <TouchableOpacity
                          key={w.key}
                          onPress={() => onSetDefaultFontWeight(w.key)}
                          activeOpacity={0.75}
                          style={[styles.tabSegment, { backgroundColor: active ? theme.primary : 'transparent' }]}
                        >
                          <Text style={[styles.tabSegmentText, { color: active ? '#fff' : theme.text }]}>
                            {w.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Layout */}
              <Text style={[styles.subLabel, { color: theme.textSecondary }]}>LAYOUT</Text>
              <View style={[styles.tabCard, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <LayoutToggle
                  selected={settings.defaultLayout}
                  onSelect={onSetDefaultLayout}
                  primary={theme.primary}
                  text={theme.text}
                  textSecondary={theme.textSecondary}
                  border={theme.border}
                  surface={theme.surface}
                />
              </View>

              {/* Aspect Ratio */}
              <Text style={[styles.subLabel, { color: theme.textSecondary }]}>ASPECT RATIO</Text>

            </View>

            {/* Ratio scroll bleeds to card edges */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ratioScroll}
              style={styles.ratioScrollOuter}
            >
              {ASPECT_RATIO_PRESETS.map((p) => {
                const active = settings.defaultAspectRatioKey === p.key;
                const ratio = p.width / p.height;
                const TILE_W = 44;
                const rw = ratio >= 1 ? TILE_W : Math.round(TILE_W * ratio);
                const rh = ratio <  1 ? TILE_W : Math.round(TILE_W / ratio);
                return (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => onSetDefaultAspectRatio(p.key)}
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
                      <View style={[
                        styles.ratioRect,
                        {
                          width: rw,
                          height: rh,
                          borderColor: active ? theme.primary : theme.textSecondary,
                          backgroundColor: active ? theme.primary + '30' : 'transparent',
                        },
                      ]} />
                    </View>
                    <Text style={[styles.ratioLabel, { color: active ? theme.primary : theme.text }]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Card>

          {/* ── Export ─────────────────────────────────── */}
          <SectionLabel title="Export" color={theme.textSecondary} />
          <Card bg={theme.card} border={theme.border}>
            <SettingRow
              label="Save Quality"
              sublabel="Image quality when saving to gallery"
              textColor={theme.text}
              secondaryColor={theme.textSecondary}
              right={
                <SegmentedControl
                  options={qualityOptions}
                  value={settings.exportQuality}
                  onChange={onSetExportQuality}
                  primary={theme.primary}
                  surface={theme.surface}
                  text={theme.text}
                  textSecondary={theme.textSecondary}
                  border={theme.border}
                />
              }
            />
          </Card>

          {/* ── Icon Libraries ─────────────────────────── */}
          <SectionLabel title="Icon Libraries" color={theme.textSecondary} />
          <View style={styles.tileGrid}>
            {ALL_ICON_PREFIXES.map((prefix) => {
              const enabled = settings.enabledIconLibraries.includes(prefix);
              return (
                <TouchableOpacity
                  key={prefix}
                  onPress={() => onToggleIconLibrary(prefix)}
                  activeOpacity={0.75}
                  style={[
                    styles.tile,
                    { width: tileWidth },
                    enabled
                      ? { backgroundColor: theme.primary + '18', borderColor: theme.primary }
                      : { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.tileRow}>
                    <Text
                      style={[styles.tileText, { color: enabled ? theme.primary : theme.text }]}
                      numberOfLines={1}
                    >
                      {ICON_PREFIX_NAMES[prefix] ?? prefix}
                    </Text>
                    {enabled && (
                      <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                    )}
                  </View>
                  <Text style={[styles.tilePrefix, { color: theme.textSecondary }]}>{prefix}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── App ────────────────────────────────────── */}
          <SectionLabel title="App" color={theme.textSecondary} />
          <Card bg={theme.card} border={theme.border}>
            <TouchableOpacity style={styles.row} onPress={handleResetAll} activeOpacity={0.7}>
              <Text style={[styles.rowLabel, { color: theme.error }]}>Reset All Defaults</Text>
            </TouchableOpacity>
            <RowDivider color={theme.border} />
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Lablary</Text>
              <Text style={[styles.rowSublabelRight, { color: theme.textSecondary }]}>v1.0.0</Text>
            </View>
          </Card>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 52,
  },
  rowLabels: {
    flex: 1,
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowSublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  rowSublabelRight: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginLeft: 16,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  tile: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  tileText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  tilePrefix: {
    fontSize: 11,
    fontWeight: '400',
  },
  sliderBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sliderBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sliderBlockValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 36,
    marginHorizontal: -6,
  },

  /* ── Tab-matched Defaults styles ── */
  fontPickerWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  defaultsPad: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 2,
    marginTop: 14,
  },
  tabCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 52,
  },
  tabRowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
  tabSliderRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  tabSliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabSliderValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabSlider: {
    width: '100%',
    height: 36,
    marginHorizontal: -6,
  },
  tabSegmented: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  tabSegment: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  tabSegmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ratioScrollOuter: {
    marginBottom: 0,
  },
  ratioScroll: {
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  ratioLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    flexShrink: 1,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
