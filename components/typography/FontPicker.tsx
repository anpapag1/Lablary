import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { FONTS } from '../../constants/fonts';

interface FontPickerProps {
  selected: string;
  onSelect: (regularFamily: string) => void;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  border: string;
  background: string;
  wrapperStyle?: object;
}

export function FontPicker({
  selected,
  onSelect,
  primary,
  text,
  textSecondary,
  border,
  background,
  wrapperStyle,
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const selectedFont = FONTS.find(f => f.regularFamily === selected);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {/* Trigger button */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
        style={[styles.trigger, { borderColor: border }]}
      >
        <Text style={[styles.triggerText, { fontFamily: selected, color: text }]}>
          {selectedFont?.label ?? 'Select font'}
        </Text>
        <Text style={[styles.caret, { color: textSecondary }]}>▾</Text>
      </TouchableOpacity>

      {/* Dropdown modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { borderColor: border, backgroundColor: background }]} onPress={() => {}}>
            <FlatList
              data={FONTS}
              keyExtractor={f => f.regularFamily}
              renderItem={({ item }) => {
                const isActive = item.regularFamily === selected;
                return (
                  <TouchableOpacity
                    onPress={() => { onSelect(item.regularFamily); setOpen(false); }}
                    style={[
                      styles.item,
                      { borderBottomColor: border },
                      isActive && { backgroundColor: primary + '18' },
                    ]}
                    activeOpacity={0.65}
                  >
                    <Text style={[
                      styles.itemText,
                      { fontFamily: item.regularFamily, color: isActive ? primary : text },
                    ]}>
                      {item.label}
                    </Text>
                    {isActive && (
                      <Text style={[styles.check, { color: primary }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  triggerText: {
    fontSize: 16,
  },
  caret: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: 420,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 18,
  },
  check: {
    fontSize: 16,
    fontWeight: '700',
  },
});
