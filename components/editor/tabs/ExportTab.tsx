import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Theme {
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
  background: string;
}

interface ExportTabProps {
  theme: Theme;
  labelWidth: number;
  labelHeight: number;
  onShare: () => Promise<void>;
  onSaveToGallery: () => Promise<void>;
}

export function ExportTab({
  theme,
  labelWidth,
  labelHeight,
  onShare,
  onSaveToGallery,
}: ExportTabProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.size, { color: theme.textSecondary }]}>
        {labelWidth} × {labelHeight} px
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onShare}
        activeOpacity={0.75}
      >
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
        onPress={onSaveToGallery}
        activeOpacity={0.75}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Save to Gallery</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  size: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
