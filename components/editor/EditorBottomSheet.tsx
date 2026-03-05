import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LabelState } from '../../types/label';
import { EditorTabBar, EditorTab } from './EditorTabBar';
import { TextTab } from './tabs/TextTab';
import { IconTab } from './tabs/IconTab';
import { StyleTab } from './tabs/StyleTab';

const TAB_BAR_HEIGHT = 72;
const SPRING = { damping: 20, stiffness: 200, mass: 0.6 };
const CONTENT_HEIGHT_PCT = 0.5;

interface Theme {
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  border: string;
  borderFocus: string;
  surface: string;
  background: string;
  card: string;
  sheetBackground: string;
  tabBar: string;
  tabActive: string;
  tabInactive: string;
  accent: string;
  error: string;
  success: string;
}

interface EditorBottomSheetProps {
  label: LabelState;
  theme: Theme;
  onTextChange: (text: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onFontWeightChange: (weight: 'regular' | 'bold') => void;
  onSelectIcon: (prefix: string, name: string, svg: string) => void;
  onClearIcon: () => void;
  onIconColorChange: (color: string) => void;
  enabledIconLibraries: string[];
  onLayoutChange: (layout: LabelState['layout']) => void;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onPaddingChange: (padding: number) => void;
  onAspectRatioChange: (width: number, height: number) => void;
}

export function EditorBottomSheet({
  label,
  theme,
  onTextChange,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onSelectIcon,
  onClearIcon,
  onIconColorChange,
  enabledIconLibraries,
  onLayoutChange,
  onBgColorChange,
  onTextColorChange,
  onPaddingChange,
  onAspectRatioChange,
}: EditorBottomSheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<EditorTab>('text');
  const [isOpen, setIsOpen] = useState(false);

  const closedHeight = TAB_BAR_HEIGHT + bottomInset;
  const contentHeight = windowHeight * CONTENT_HEIGHT_PCT;
  const openHeight = closedHeight + contentHeight;
  const heightSV = useSharedValue(closedHeight);

  const open = useCallback(
    (tab: EditorTab) => {
      setActiveTab(tab);
      setIsOpen(true);
      heightSV.value = withSpring(openHeight, SPRING);
    },
    [heightSV, openHeight],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    heightSV.value = withSpring(closedHeight, SPRING);
  }, [heightSV, closedHeight]);

  const handleTabSelect = useCallback(
    (tab: EditorTab) => {
      if (isOpen && tab === activeTab) {
        close();
      } else {
        open(tab);
      }
    },
    [isOpen, activeTab, open, close],
  );

  const animStyle = useAnimatedStyle(() => ({
    height: heightSV.value,
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <TextTab
            label={label}
            theme={theme}
            onTextChange={onTextChange}
            onFontChange={onFontChange}
            onFontSizeChange={onFontSizeChange}
            onFontWeightChange={onFontWeightChange}
            onTextColorChange={onTextColorChange}
          />
        );
      case 'icon':
        return (
          <IconTab
            label={label}
            theme={theme}
            enabledIconLibraries={enabledIconLibraries}
            onSelectIcon={onSelectIcon}
            onClearIcon={onClearIcon}
            onIconColorChange={onIconColorChange}
          />
        );
      case 'style':
        return (
          <StyleTab
            label={label}
            theme={theme}
            onLayoutChange={onLayoutChange}
            onBgColorChange={onBgColorChange}
            onTextColorChange={onTextColorChange}
            onIconColorChange={onIconColorChange}
            onPaddingChange={onPaddingChange}
            onAspectRatioChange={onAspectRatioChange}
          />
        );
    }
  };

  return (
    <Animated.View
      style={[
        styles.sheet,
        { backgroundColor: theme.sheetBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
        animStyle,
      ]}
    >
      <EditorTabBar
        active={activeTab}
        onSelect={handleTabSelect}
        primary={theme.primary}
        tabBar={theme.tabBar}
        tabActive={theme.tabActive}
        tabInactive={theme.tabInactive}
        border={theme.border}
        includedTabs={['text', 'icon', 'style']}
      />
      {isOpen && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

