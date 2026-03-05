import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { LabelState } from '../../types/label';
import { CheckerBoard } from './CheckerBoard';
import { LabelContent } from './LabelContent';
import { ResizeHandles } from './ResizeHandles';

export interface LabelCanvasRef {
  capture: () => Promise<string>;
  resetView: () => void;
}

interface LabelCanvasProps {
  label: LabelState;
  canvasWidth: number;
  canvasHeight: number;
  handleColor: string;
  handleBorderColor: string;
  checkerLight: string;
  checkerDark: string;
  onResize: (width: number, height: number) => void;
}

export const LabelCanvas = forwardRef<LabelCanvasRef, LabelCanvasProps>(
  (
    {
      label,
      canvasWidth,
      canvasHeight,
      handleColor,
      handleBorderColor,
      checkerLight,
      checkerDark,
      onResize,
    },
    ref
  ) => {
    const shotRef = useRef<ViewShot>(null);

    // Workspace zoom / pan state (visual only, doesn't affect export)
    const scale = useSharedValue(1);
    const lastScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTX = useSharedValue(0);
    const lastTY = useSharedValue(0);

    useImperativeHandle(ref, () => ({
      capture: () => {
        if (!shotRef.current?.capture) return Promise.reject(new Error('ViewShot not ready'));
        return shotRef.current.capture();
      },
      resetView: () => {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        lastScale.value = 1;
        lastTX.value = 0;
        lastTY.value = 0;
      },
    }));

    // Pinch to zoom the workspace
    const pinchGesture = Gesture.Pinch()
      .onUpdate((e) => {
        scale.value = Math.max(0.25, Math.min(4, lastScale.value * e.scale));
      })
      .onEnd(() => {
        lastScale.value = scale.value;
      });

    // Two-finger pan to move the workspace
    const panGesture = Gesture.Pan()
      .minPointers(2)
      .onUpdate((e) => {
        translateX.value = lastTX.value + e.translationX;
        translateY.value = lastTY.value + e.translationY;
      })
      .onEnd(() => {
        lastTX.value = translateX.value;
        lastTY.value = translateY.value;
      });

    const workspaceGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedWorkspace = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    return (
      <View style={[styles.canvasContainer, { width: canvasWidth, height: canvasHeight }]}>
        {/* Checkered background fills the entire canvas area */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <CheckerBoard
            width={canvasWidth}
            height={canvasHeight}
            lightColor={checkerLight}
            darkColor={checkerDark}
          />
        </View>

        {/* Workspace: pinch/pan gestures apply to this container */}
        <GestureDetector gesture={workspaceGesture}>
          <Animated.View style={[styles.workspaceInner, animatedWorkspace]}>
            {/* The label shadow / elevation layer */}
            <View
              style={[
                styles.labelWrapper,
                {
                  width: label.width,
                  height: label.height,
                  borderRadius: label.borderRadius,
                  // Soft shadow
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8,
                },
              ]}
            >
              {/* ViewShot wraps the exportable surface */}
              <ViewShot
                ref={shotRef}
                options={{ format: 'png', quality: 1.0 }}
                style={{ borderRadius: label.borderRadius, overflow: 'hidden' }}
              >
                <LabelContent label={label} />
              </ViewShot>
            </View>

            {/* Corner resize handles – rendered outside ViewShot so they don't export */}
            <ResizeHandles
              width={label.width}
              height={label.height}
              handleColor={handleColor}
              handleBorderColor={handleBorderColor}
              onResize={onResize}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

LabelCanvas.displayName = 'LabelCanvas';

const styles = StyleSheet.create({
  canvasContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workspaceInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrapper: {
    alignSelf: 'center',
  },
});
