import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type EditorTab = 'text' | 'icon' | 'style' | 'export';

const TABS: { key: EditorTab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'text', label: 'Text', icon: 'text-outline' },
  { key: 'icon', label: 'Icon', icon: 'shapes-outline' },
  { key: 'style', label: 'Style', icon: 'color-palette-outline' },
  { key: 'export', label: 'Export', icon: 'share-outline' },
];

interface EditorTabBarProps {
  active: EditorTab;
  onSelect: (tab: EditorTab) => void;
  primary: string;
  tabBar: string;
  tabActive: string;
  tabInactive: string;
  border: string;
  includedTabs?: EditorTab[];
}

export function EditorTabBar({
  active,
  onSelect,
  primary,
  tabBar,
  tabActive,
  tabInactive,
  border,
  includedTabs,
}: EditorTabBarProps) {
  const visibleTabs = includedTabs ? TABS.filter(t => includedTabs.includes(t.key)) : TABS;
  return (
    <View style={[styles.bar, { backgroundColor: tabBar, borderBottomColor: border }]}>
      {visibleTabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[
              styles.tab,
              isActive && { borderBottomColor: primary, borderBottomWidth: 2.5 },
            ]}
            activeOpacity={0.75}
          >
            <Ionicons name={tab.icon} size={20} color={isActive ? tabActive : tabInactive} />
            <Text style={[styles.tabLabel, { color: isActive ? tabActive : tabInactive }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 17,
    gap: 4,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
