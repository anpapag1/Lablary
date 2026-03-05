import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

const HANDLE_SIZE = 22;
const HIT_SLOP = 12;

interface ResizeHandlesProps {
  width: number;
  height: number;
  handleColor: string;
  handleBorderColor: string;
  onResize: (width: number, height: number) => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Renders 4 corner handles for resizing the label.
 * Each handle uses a separate Pan gesture.
 * Deltas are accumulated from the gesture's translationX/Y.
 */
export function ResizeHandles({
  width,
  height,
  handleColor,
  handleBorderColor,
  onResize,
  minWidth = 100,
  minHeight = 50,
  maxWidth = 640,
  maxHeight = 400,
}: ResizeHandlesProps) {
  // Each corner tracks start dimensions at gesture start
  const startW = useSharedValue(width);
  const startH = useSharedValue(height);

  const clampW = (w: number) => {
    'worklet';
    return Math.max(minWidth, Math.min(maxWidth, Math.round(w)));
  };
  const clampH = (h: number) => {
    'worklet';
    return Math.max(minHeight, Math.min(maxHeight, Math.round(h)));
  };

  // Bottom-right: drag changes both W and H
  const brGesture = Gesture.Pan()
    .onStart(() => {
      startW.value = width;
      startH.value = height;
    })
    .onUpdate((e) => {
      const newW = clampW(startW.value + e.translationX);
      const newH = clampH(startH.value + e.translationY);
      runOnJS(onResize)(newW, newH);
    })
    .minDistance(1);

  // Bottom-left: drag left decreases W, drag down increases H
  const blGesture = Gesture.Pan()
    .onStart(() => {
      startW.value = width;
      startH.value = height;
    })
    .onUpdate((e) => {
      const newW = clampW(startW.value - e.translationX);
      const newH = clampH(startH.value + e.translationY);
      runOnJS(onResize)(newW, newH);
    })
    .minDistance(1);

  // Top-right: drag right increases W, drag up decreases H
  const trGesture = Gesture.Pan()
    .onStart(() => {
      startW.value = width;
      startH.value = height;
    })
    .onUpdate((e) => {
      const newW = clampW(startW.value + e.translationX);
      const newH = clampH(startH.value - e.translationY);
      runOnJS(onResize)(newW, newH);
    })
    .minDistance(1);

  // Top-left: drag decreases both
  const tlGesture = Gesture.Pan()
    .onStart(() => {
      startW.value = width;
      startH.value = height;
    })
    .onUpdate((e) => {
      const newW = clampW(startW.value - e.translationX);
      const newH = clampH(startH.value - e.translationY);
      runOnJS(onResize)(newW, newH);
    })
    .minDistance(1);

  const handle = (gesture: ReturnType<typeof Gesture.Pan>, style: object) => (
    <GestureDetector gesture={gesture}>
      <Animated.View
        hitSlop={HIT_SLOP}
        style={[
          styles.handle,
          {
            backgroundColor: handleColor,
            borderColor: handleBorderColor,
          },
          style,
        ]}
      />
    </GestureDetector>
  );

  const half = HANDLE_SIZE / 2;

  return (
    <View
      style={[styles.overlay, { width, height }]}
      pointerEvents="box-none"
    >
      {/* Top-left */}
      {handle(tlGesture, { top: -half, left: -half })}
      {/* Top-right */}
      {handle(trGesture, { top: -half, right: -half })}
      {/* Bottom-left */}
      {handle(blGesture, { bottom: -half, left: -half })}
      {/* Bottom-right */}
      {handle(brGesture, { bottom: -half, right: -half })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    borderWidth: 2.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
