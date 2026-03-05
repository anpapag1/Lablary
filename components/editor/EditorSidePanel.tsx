import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { LabelState } from '../../types/label';
import { EditorTabBar, EditorTab } from './EditorTabBar';
import { TextTab } from './tabs/TextTab';
import { IconTab } from './tabs/IconTab';
import { StyleTab } from './tabs/StyleTab';

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

interface EditorSidePanelProps {
  width: number;
  label: LabelState;
  theme: Theme;
  onTextChange: (text: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onFontWeightChange: (weight: 'regular' | 'bold') => void;
  onTextColorChange: (color: string) => void;
  onSelectIcon: (prefix: string, name: string, svg: string) => void;
  onClearIcon: () => void;
  onIconColorChange: (color: string) => void;
  enabledIconLibraries: string[];
  onLayoutChange: (layout: LabelState['layout']) => void;
  onBgColorChange: (color: string) => void;
  onPaddingChange: (padding: number) => void;
  onAspectRatioChange: (width: number, height: number) => void;
}

export function EditorSidePanel({
  width,
  label,
  theme,
  onTextChange,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onTextColorChange,
  onSelectIcon,
  onClearIcon,
  onIconColorChange,
  enabledIconLibraries,
  onLayoutChange,
  onBgColorChange,
  onPaddingChange,
  onAspectRatioChange,
}: EditorSidePanelProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('text');

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
    <View
      style={[
        styles.panel,
        { width, backgroundColor: theme.sheetBackground, borderLeftColor: theme.border },
      ]}
    >
      <EditorTabBar
        active={activeTab}
        onSelect={setActiveTab}
        primary={theme.primary}
        tabBar={theme.tabBar}
        tabActive={theme.tabActive}
        tabInactive={theme.tabInactive}
        border={theme.border}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderLeftWidth: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
