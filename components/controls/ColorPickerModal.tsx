import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPicker, {
  Panel1,
  HueSlider,
  OpacitySlider,
  ColorFormatsObject,
} from 'reanimated-color-picker';

interface ColorPickerModalProps {
  visible: boolean;
  initialColor: string;
  title: string;
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  onClose: () => void;
  onSelect: (color: string) => void;
}

export function ColorPickerModal({
  visible,
  initialColor,
  title,
  primary,
  background,
  surface,
  text,
  textSecondary,
  border,
  onClose,
  onSelect,
}: ColorPickerModalProps) {
  const [pending, setPending] = useState(initialColor);

  const onColorChange = (colors: ColorFormatsObject) => {
    setPending(colors.hex);
  };

  const handleConfirm = () => {
    onSelect(pending);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={[styles.sheet, { backgroundColor: background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: border }]}>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <Text style={[styles.headerBtnText, { color: textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: text }]}>{title}</Text>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.headerBtn, styles.confirmBtn, { backgroundColor: primary }]}
            >
              <Text style={styles.confirmBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Color Picker */}
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={initialColor}
              onCompleteJS={onColorChange}
              style={styles.picker}
            >
              <Panel1 style={styles.panel} />
              <HueSlider style={styles.hueSlider} />
              <OpacitySlider style={styles.opacitySlider} />
            </ColorPicker>
          </View>

          {/* Preview swatch */}
          <View style={[styles.previewRow, { borderTopColor: border }]}>
            <Text style={[styles.previewLabel, { color: textSecondary }]}>Preview</Text>
            <View
              style={[
                styles.swatch,
                { backgroundColor: pending, borderColor: border },
              ]}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerBtn: {
    minWidth: 70,
    paddingHorizontal: 4,
  },
  headerBtnText: {
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  confirmBtn: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  pickerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  picker: {
    gap: 12,
  },
  panel: {
    height: 200,
    borderRadius: 12,
  },
  hueSlider: {
    height: 28,
    borderRadius: 14,
  },
  opacitySlider: {
    height: 28,
    borderRadius: 14,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 13,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
});
