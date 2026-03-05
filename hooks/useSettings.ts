import { useState, useCallback } from 'react';
import { LabelState } from '../types/label';

export type ThemeSetting = 'system' | 'light' | 'dark';
export type ExportQuality = 'low' | 'medium' | 'high';

export const ALL_ICON_PREFIXES = [
  'mdi',
  'material-symbols',
  'lucide',
  'ph',
  'ri',
  'bi',
  'fa',
  'fa6',
  'tabler',
  'ion',
  'heroicons',
  'octicon',
  'feather',
  'ant-design',
  'carbon',
  'clarity',
  'majesticons',
  'bx',
];

export const ICON_PREFIX_NAMES: Record<string, string> = {
  mdi: 'Material Design',
  'material-symbols': 'Material Symbols',
  lucide: 'Lucide',
  ph: 'Phosphor',
  ri: 'Remix Icons',
  bi: 'Bootstrap',
  fa: 'Font Awesome',
  fa6: 'Font Awesome 6',
  tabler: 'Tabler',
  ion: 'Ionicons',
  heroicons: 'Heroicons',
  octicon: 'Octicons',
  feather: 'Feather',
  'ant-design': 'Ant Design',
  carbon: 'Carbon',
  clarity: 'Clarity',
  majesticons: 'Majesticons',
  bx: 'Boxicons',
};

export interface AspectRatioPreset {
  key: string;
  label: string;
  width: number;
  height: number;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { key: '1:1', label: '1:1', width: 1, height: 1 },
  { key: '2:1', label: '2:1', width: 2, height: 1 },
  { key: '3:1', label: '3:1', width: 3, height: 1 },
  { key: '4:3', label: '4:3', width: 4, height: 3 },
  { key: '16:9', label: '16:9', width: 16, height: 9 },
];

export interface Settings {
  theme: ThemeSetting;
  defaultFont: string;
  defaultFontSize: number;
  defaultFontWeight: 'regular' | 'bold';
  defaultLayout: LabelState['layout'];
  defaultAspectRatioKey: string;
  exportQuality: ExportQuality;
  enabledIconLibraries: string[];
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  defaultFont: 'Inter',
  defaultFontSize: 35,
  defaultFontWeight: 'bold',
  defaultLayout: 'ICON_LEFT',
  defaultAspectRatioKey: '2:1',
  exportQuality: 'high',
  enabledIconLibraries: [...ALL_ICON_PREFIXES],
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const setTheme = useCallback((theme: ThemeSetting) => {
    setSettings(s => ({ ...s, theme }));
  }, []);

  const setDefaultFont = useCallback((font: string) => {
    setSettings(s => ({ ...s, defaultFont: font }));
  }, []);

  const setDefaultFontSize = useCallback((size: number) => {
    setSettings(s => ({ ...s, defaultFontSize: size }));
  }, []);

  const setDefaultFontWeight = useCallback((weight: 'regular' | 'bold') => {
    setSettings(s => ({ ...s, defaultFontWeight: weight }));
  }, []);

  const setDefaultLayout = useCallback((layout: LabelState['layout']) => {
    setSettings(s => ({ ...s, defaultLayout: layout }));
  }, []);

  const setDefaultAspectRatio = useCallback((key: string) => {
    setSettings(s => ({ ...s, defaultAspectRatioKey: key }));
  }, []);

  const setExportQuality = useCallback((quality: ExportQuality) => {
    setSettings(s => ({ ...s, exportQuality: quality }));
  }, []);

  const toggleIconLibrary = useCallback((prefix: string) => {
    setSettings(s => {
      const enabled = s.enabledIconLibraries;
      if (enabled.includes(prefix)) {
        if (enabled.length === 1) return s; // keep at least one enabled
        return { ...s, enabledIconLibraries: enabled.filter(p => p !== prefix) };
      }
      return { ...s, enabledIconLibraries: [...enabled, prefix] };
    });
  }, []);

  const resetAll = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    setTheme,
    setDefaultFont,
    setDefaultFontSize,
    setDefaultFontWeight,
    setDefaultLayout,
    setDefaultAspectRatio,
    setExportQuality,
    toggleIconLibrary,
    resetAll,
  };
}
