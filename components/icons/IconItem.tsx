import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { fetchIconSvg } from '../../utils/iconify';

interface IconItemProps {
  prefix: string;
  name: string;
  color: string;
  size?: number;
  isSelected: boolean;
  selectionColor: string;
  onPress: (prefix: string, name: string, svg: string) => void;
}

/**
 * Renders a single icon tile. Fetches the SVG on mount/color change.
 */
export function IconItem({
  prefix,
  name,
  color,
  size = 40,
  isSelected,
  selectionColor,
  onPress,
}: IconItemProps) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchIconSvg(prefix, name)
      .then((s) => { if (!cancelled) setSvg(s); })
      .catch(() => { /* ignore individual icon load errors */ });
    return () => { cancelled = true; };
  }, [prefix, name]);

  return (
    <TouchableOpacity
      onPress={() => svg && onPress(prefix, name, svg)}
      style={[
        styles.tile,
        { width: size + 16, height: size + 16 },
        isSelected && { backgroundColor: selectionColor + '22', borderColor: selectionColor },
      ]}
      activeOpacity={0.7}
    >
      {svg ? (
        <SvgXml xml={svg} width={size} height={size} color={color} />
      ) : (
        <ActivityIndicator size="small" color={color} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    margin: 4,
  },
});
