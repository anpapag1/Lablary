import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LabelState } from '../../../types/label';
import { useIconSearch } from '../../../hooks/useIconSearch';
import { IconFilterPills } from '../../icons/IconFilterPills';
import { IconGrid } from '../../icons/IconGrid';
import { ColorRow } from '../../controls/ColorRow';
import { SectionHeader } from '../../controls/SectionHeader';

interface Theme {
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
  background: string;
  accent: string;
}

interface IconTabProps {
  label: LabelState;
  theme: Theme;
  enabledIconLibraries: string[];
  onSelectIcon: (prefix: string, name: string, svg: string) => void;
  onClearIcon: () => void;
  onIconColorChange: (color: string) => void;
}

export function IconTab({
  label,
  theme,
  enabledIconLibraries,
  onSelectIcon,
  onClearIcon,
  onIconColorChange,
}: IconTabProps) {
  const { query, setQuery, groups, activeFilter, setActiveFilter, visibleIcons, isLoading, error } =
    useIconSearch(enabledIconLibraries);

  const selectedFullName =
    label.iconPrefix && label.iconName
      ? `${label.iconPrefix}:${label.iconName}`
      : null;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={[styles.searchRow, { borderBottomColor: theme.border }]}>
        <View
          style={[
            styles.searchInput,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <TextInput
            style={[styles.searchText, { color: theme.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search icons (e.g. home, coffee, star…)"
            placeholderTextColor={theme.textSecondary}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={[styles.clearX, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {selectedFullName && (
          <TouchableOpacity
            onPress={onClearIcon}
            style={[styles.clearIconBtn, { backgroundColor: theme.accent + '22', borderColor: theme.accent }]}
          >
            <Text style={[styles.clearIconText, { color: theme.accent }]}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Source filter pills */}
      <IconFilterPills
        groups={groups}
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
        primary={theme.primary}
        textSecondary={theme.textSecondary}
        border={theme.border}
        surface={theme.surface}
      />

      {/* Icon grid or current icon preview */}
      <View style={styles.gridContainer}>
        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            {label.iconSvg ? (
              <>
                <View style={[styles.previewBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <SvgXml xml={label.iconSvg} width={64} height={64} color={label.iconColor} />
                </View>
                <Text style={[styles.previewName, { color: theme.text }]}>
                  {label.iconName}
                </Text>
                <Text style={[styles.previewHint, { color: theme.textSecondary }]}>
                  Search above to change icon
                </Text>
              </>
            ) : (
              <Text style={[styles.previewHint, { color: theme.textSecondary }]}>
                Search above to pick an icon
              </Text>
            )}
          </View>
        ) : (
          <IconGrid
            icons={visibleIcons}
            selectedIcon={selectedFullName}
            iconColor={label.iconColor}
            isLoading={isLoading}
            error={error}
            primary={theme.primary}
            textSecondary={theme.textSecondary}
            onSelectIcon={onSelectIcon}
          />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 42,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
  },
  clearBtn: {
    padding: 4,
  },
  clearX: {
    fontSize: 12,
    fontWeight: '700',
  },
  clearIconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  clearIconText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridContainer: {
    flex: 1,
    minHeight: 160,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  previewBox: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewName: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  previewHint: {
    fontSize: 13,
  },
});
