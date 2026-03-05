import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { IconSearchResult } from '../../utils/iconify';
import { IconItem } from './IconItem';

interface IconGridProps {
  icons: IconSearchResult[];
  selectedIcon: string | null;
  iconColor: string;
  isLoading: boolean;
  error: string | null;
  primary: string;
  textSecondary: string;
  onSelectIcon: (prefix: string, name: string, svg: string) => void;
}

const TILE_SIZE = 48;

export function IconGrid({
  icons,
  selectedIcon,
  iconColor,
  isLoading,
  error,
  primary,
  textSecondary,
  onSelectIcon,
}: IconGridProps) {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.emptyText, { color: textSecondary }]}>{error}</Text>
      </View>
    );
  }

  if (icons.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.emptyText, { color: textSecondary }]}>
          Search for an icon above
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {icons.map((item) => (
        <IconItem
          key={item.fullName}
          prefix={item.prefix}
          name={item.name}
          color={iconColor}
          size={TILE_SIZE}
          isSelected={selectedIcon === item.fullName}
          selectionColor={primary}
          onPress={onSelectIcon}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
