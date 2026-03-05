import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { GroupedIcons } from '../../hooks/useIconSearch';

interface IconFilterPillsProps {
  groups: GroupedIcons[];
  activeFilter: string | null;
  onSelect: (prefix: string | null) => void;
  primary: string;
  textSecondary: string;
  border: string;
  surface: string;
}

export function IconFilterPills({
  groups,
  activeFilter,
  onSelect,
  primary,
  textSecondary,
  border,
  surface,
}: IconFilterPillsProps) {
  if (groups.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* All pill */}
      <TouchableOpacity
        onPress={() => onSelect(null)}
        style={[
          styles.pill,
          {
            backgroundColor: activeFilter === null ? primary : surface,
            borderColor: activeFilter === null ? primary : border,
          },
        ]}
        activeOpacity={0.75}
      >
        <Text style={[styles.pillText, { color: activeFilter === null ? '#fff' : textSecondary }]}>
          All
        </Text>
      </TouchableOpacity>
      {groups.map((group) => {
        const isActive = activeFilter === group.prefix;
        return (
          <TouchableOpacity
            key={group.prefix}
            onPress={() => onSelect(group.prefix)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? primary : surface,
                borderColor: isActive ? primary : border,
              },
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.pillText, { color: isActive ? '#fff' : textSecondary }]}>
              {group.libraryName}
            </Text>
            <View style={[styles.badge, { backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : border }]}>
              <Text style={[styles.badgeText, { color: isActive ? '#fff' : textSecondary }]}>
                {group.icons.length}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
