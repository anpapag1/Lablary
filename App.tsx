import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  useColorScheme,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  LogBox,
} from 'react-native';

// NativeWind (react-native-css-interop) accesses SafeAreaView from react-native at startup
// to register it for CSS interop, which triggers RN's deprecation warnOnce. Suppress it.
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import './global.css';

import { getTheme } from './constants/theme';
import { useLabel } from './hooks/useLabel';
import { useAdaptiveLayout } from './hooks/useAdaptiveLayout';
import { useAppFonts } from './hooks/useAppFonts';
import { useSettings } from './hooks/useSettings';

import { LabelCanvas, LabelCanvasRef } from './components/canvas/LabelCanvas';
import { EditorBottomSheet } from './components/editor/EditorBottomSheet';
import { EditorSidePanel } from './components/editor/EditorSidePanel';
import { TopBar, DownloadState } from './components/TopBar';
import { SettingsScreen } from './components/settings/SettingsScreen';

import {
  captureLabel,
  shareLabel,
  saveLabelToGallery,
} from './utils/exportLabel';

export default function App() {
  const colorScheme = useColorScheme();
  const { settings, setTheme, setDefaultFont, setDefaultFontSize, setDefaultFontWeight, setDefaultLayout, setDefaultAspectRatio, setExportQuality, toggleIconLibrary, resetAll } = useSettings();
  const resolvedScheme = settings.theme === 'system' ? colorScheme : settings.theme;
  const theme = getTheme(resolvedScheme);
  const { fontsLoaded, fontError } = useAppFonts();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');

  const { label, setText, setFont, setFontSize, setFontWeight, setTextColor,
    setIcon, clearIcon, setIconColor, setLayout, setBackgroundColor, setPadding, resize, resetStyle } = useLabel();

  const { isTablet, canvasWidth, canvasHeight, sidePanelWidth } = useAdaptiveLayout();

  const canvasRef = useRef<LabelCanvasRef>(null);
  const [measuredCanvasHeight, setMeasuredCanvasHeight] = useState(0);

  // ─── Export handlers ───────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const uri = await captureLabel(canvasRef.current);
    await shareLabel(uri);
  }, []);

  const handleSaveToGallery = useCallback(async () => {
    setDownloadState('saving');
    try {
      const uri = await captureLabel(canvasRef.current);
      await saveLabelToGallery(uri);
      setDownloadState('done');
      setTimeout(() => setDownloadState('idle'), 1500);
    } catch (e) {
      setDownloadState('idle');
    }
  }, []);

  // ─── Font loading gate ─────────────────────────────────────────────────
  if (!fontsLoaded && !fontError) {
    return (
      <View style={[styles.splash, { backgroundColor: theme.background }]}>
        <Text style={[styles.splashLogo, { color: theme.primary }]}>
          Labl<Text style={{ color: theme.text }}>ary</Text>
        </Text>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  const editorProps = {
    label,
    theme,
    onTextChange: setText,
    onFontChange: setFont,
    onFontSizeChange: setFontSize,
    onFontWeightChange: setFontWeight,
    onTextColorChange: setTextColor,
    onSelectIcon: setIcon,
    onClearIcon: clearIcon,
    onIconColorChange: setIconColor,
    onLayoutChange: setLayout,
    onBgColorChange: setBackgroundColor,
    onPaddingChange: setPadding,
    onAspectRatioChange: resize,
    enabledIconLibraries: settings.enabledIconLibraries,
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: theme.background }]}
          edges={['top', 'left', 'right']}
        >
          <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />

          {/* ─── Top bar ─────────────────────────────── */}
          <TopBar
            primary={theme.primary}
            text={theme.text}
            surface={theme.surface}
            border={theme.border}
            isSettingsOpen={settingsVisible}
            downloadState={downloadState}
            onShare={handleShare}
            onSaveToGallery={handleSaveToGallery}
            onOpenSettings={() => setSettingsVisible(true)}
          />

          {/* ─── Main layout ─────────────────────────── */}
          <View
            style={[
              styles.content,
              isTablet && styles.contentRow,
              { backgroundColor: theme.background },
            ]}
          >
            {/* Canvas */}
            <View
              style={{ flex: 1 }}
              onLayout={e => !isTablet && setMeasuredCanvasHeight(e.nativeEvent.layout.height)}
            >
              {(isTablet || measuredCanvasHeight > 0) && (
                <LabelCanvas
                  ref={canvasRef}
                  label={label}
                  canvasWidth={canvasWidth}
                  canvasHeight={isTablet ? canvasHeight : measuredCanvasHeight}
                  handleColor={theme.handle}
                  handleBorderColor={theme.handleBorder}
                  checkerLight={theme.checkerLight}
                  checkerDark={theme.checkerDark}
                  onResize={resize}
                />
              )}
              <TouchableOpacity
                onPress={resetStyle}
                activeOpacity={0.8}
                style={[styles.fab, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Ionicons name="refresh-outline" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Editor: side panel on tablets, bottom sheet on phones */}
            {isTablet ? (
              <EditorSidePanel width={sidePanelWidth} {...editorProps} />
            ) : (
              <EditorBottomSheet {...editorProps} />
            )}
          </View>
        </SafeAreaView>

        <SettingsScreen
          visible={settingsVisible}
          settings={settings}
          theme={theme}
          onClose={() => setSettingsVisible(false)}
          onSetTheme={setTheme}
          onSetDefaultFont={setDefaultFont}
          onSetDefaultFontSize={setDefaultFontSize}
          onSetDefaultFontWeight={setDefaultFontWeight}
          onSetDefaultLayout={setDefaultLayout}
          onSetDefaultAspectRatio={setDefaultAspectRatio}
          onSetExportQuality={setExportQuality}
          onToggleIconLibrary={toggleIconLibrary}
          onResetAll={resetAll}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  content: {
    flex: 1,
  },
  contentRow: {
    flexDirection: 'row',
  },
});
