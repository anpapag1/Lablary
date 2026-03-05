import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="85 -3 245 218">
  <path fill="__COLOR__" d="M111.2,112.83v-.95c-5.91-4.41-4.51-9.41.64-13.68-5.84-2.41-8.74-3-10.59-9.57-3.12-11.06-.8-28.42.19-39.89.69-7.94-.55-23.36,7.21-27.93,5.96-3.51,28.68-2.81,35.9-1.51,3.37.61,8.3,2.36,10.6,5.02,3.1,3.59,4.3,16.02,4.86,21.17,4.66,43.57,3.1,85.34,3.94,128.81.17,8.7,1.06,18.47-8.78,21.86-7.6,2.61-30.86,2.69-38.88,1.08-9.14-1.84-12.39-4.87-14.01-13.97-2.37-13.34-2.83-42.86-1.47-56.43.63-6.31,5.32-10.9,10.4-14.01ZM146.85,30.99c-2.15-2.13-25.45-2.55-29.4-2.03-6.49.85-4.51,9.15-4.95,13.92-1.17,12.51-2.93,25.12-1.97,37.77.65,8.53,2.12,5.87,8.35,7.92,9.6,3.16,6.77,10.1,1.54,16.14,11.79,10.06-7.64,16.52-9.08,22.91-.93,4.12.59,12.63.54,17.47-.09,10.45-1.08,20.65-.02,31.19.84,8.36,1.24,10.43,10.16,11.32,7.24.72,18.55.19,25.88-.64,1.53-.17,3.04-.81,4.54-1.17.6-.43.89-2.26.99-3.05,1.26-10.57-2-24.69-.6-35.76,1.68-34.85.23-70.07-3.88-104.73-.21-1.78-1.38-10.55-2.09-11.25Z"/>
  <path fill="__COLOR__" d="M247.07,22.58c6.86-.65,12.28,1.6,18.14,4.9,8.64,4.87,14.14,8.55,17.6,18.19,6.38,17.74,9.92,38.85,15.63,57.26,4.27,13.78,10.07,27.14,14.51,40.8,6.03,18.52,10.49,29.24-10,38.85-6.22,2.92-20.27,8.67-26.75,7.65-5.21-.82-8.18-7.15-9.97-11.5-4.57-11.06-7.84-25.99-11.03-37.77-5.81-21.45-10.61-43.21-16.78-64.56-3.52-12.21-10.72-28.08-12.53-40.17-1.15-7.71,2.61-8.85,8.94-10.92,3.38-1.1,8.73-2.4,12.24-2.73ZM277.96,179.04c1.73,1.69,5.88-.44,7.98-1.12,3.9-1.26,19.42-7.15,20.8-10.44s-.33-8.52-1.15-11.84c-3.9-15.78-11.95-32.89-16.91-48.82-5.46-17.54-9.67-35.49-14.46-53.22-.29-.54-.69-.6-1.25-.62-1.91-.05-7.1,1.72-9.83,1.92-7.99.6-20.49.8-16.62-10.76.82-2.44,7.83-11.14,1.79-11.16-1.42,0-10,1.95-10.91,2.74l-.34,1.01,40.89,142.3ZM269.33,43.2c-1.07-1.09-7.66-5.89-8.45-5.2l-1.96,6.51,10.41-1.31Z"/>
  <path fill="__COLOR__" d="M210.63,60.97c6.2-.29,12.6-1.01,18.16,2.28,11.12,6.58,6,29.53,5.4,40.16-1.46,26.15-1.53,52.35-2.11,78.58-1.5,4.8-2.7,7.63-7.77,9.15-6.11,1.82-31.03.93-38.63.47-11.44-.69-18.55-3.32-19.81-15.98-1.76-17.6,2.05-35.79,2.62-53.33.24-7.39-1.55-13.38-1.36-20.23.23-7.91.63-17.45,1.34-25.34,1.72-19.13,16.86-13.97,30.93-14.62,3.51-.16,7.64-.97,11.23-1.14ZM222.48,148.63c-.3-15.57.49-31,1.31-46.52.32-6.11,3.27-24.83-.07-29.23-2.76-3.65-17.22-.58-21.74-.39-3.88.16-19.42-.73-21.42.7-1.09.78-1.43,2.92-1.59,4.26-1.86,15.04.59,30.96-.05,46.15l-1.91,23.66,45.49,1.37ZM221.83,159.69l-45.55-1.3v16.59c0,.87,1.44,4.23,2.34,4.82,1.02.65,6.18,1.25,7.75,1.36,8.11.58,17.15-.13,25.4-.02,3.27.04,6.98,1.81,10.06-.95v-20.5Z"/>
  <path fill="__COLOR__" d="M195.02,196.98c31.09-1.64,71.14-1.52,101.97,1.12,2.13.18,7.84.52,9.28,1.13,3.22,1.37,3.78,6.3,1.16,8.63-3.27,2.92-17.87.11-22.76-.04-27.87-.85-58.85-1.93-86.6-.65-18.31.85-40.38,5.35-58.54,3.28-9.15-1.04-8.34-11.38,1.96-11.11,18.72.5,35.07-1.4,53.54-2.37Z"/>
  <path fill="__COLOR__" d="M101.96.45c13.37-1.12,29.13.14,42.75.47,22.14.54,44.23,2.3,66.36,3.27,6.26.28,14.36-.84,20.23-.06s6.74,9.67-1.96,10.47c-5.59.51-13.8.2-19.57,0-34.57-1.21-69.53-4.75-104.12-3.96-4.46.1-13.96,3.24-14.03-4.19-.05-5.79,6.08-5.64,10.35-6Z"/>
  <path fill="__COLOR__" d="M267.17,79.21c1.78,1.97,6.13,24.01,7.42,28.7,4.15,15.19,9.76,29.82,15.45,44.47-.62,6.24-7.22,7.6-10.42,1.92-7.02-12.45-14.38-39.43-17.77-53.81-.97-4.11-4.4-16.45-3.43-19.72s6.42-4.16,8.77-1.56Z"/>
  <path fill="__COLOR__" d="M194.33,79.8l21.02.79c5.08,1.89,4.08,9.28-1.05,10.08-3.5.55-17.71.45-20.99-.41-6.32-1.65-5.23-9.82,1.01-10.46Z"/>
  <path fill="__COLOR__" d="M191.08,131.82l21.68,1.49c5.06,2.41,4.2,9.45-1.65,10.13-3.82.44-17.84-.21-21.16-1.64-5.27-2.27-3.65-8.31,1.13-9.98Z"/>
</svg>`;

// Inline SVG source — viewBox cropped to the actual text paths (~x:40–470, y:175–330)
// Uses inline fill attributes (not CSS classes) so react-native-svg picks up the colors.
const TITLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 175 430 155">
  <g>
    <path fill="__COLOR1__" d="M223.73,274.62c8.15,11.95,27.11-4.34,20.66-16.53-1.99-3.75-7.18-5.06-10.53-3.85-1.81.65-3.86,5.16-6.83,5.77-8.95,1.84-9.59-8.44-3.23-14.95,9.63-9.85,26.6-5.92,31.93,8.3,9.42,25.16-19.09,50.63-37.27,35.11-2.25-1.92-4.7-7.15-5.02-7.43-2.52-2.17-1.95,9.64-9.29,7.82-7.85-1.94-3.27-12.97-2.51-18.62,1.04-7.7,2.44-16.99,2.76-24.66.57-13.77-3.78-46.32,1.73-56.91,4.52-8.68,11.32-1.93,12.19,6.98,2.16,22.15-7.2,60.49,5.42,78.98Z"/>
    <path fill="__COLOR1__" d="M286.97,279.31c5.33,4.72,1.13,13.62-7.42,12.33-31.4-4.73-16.81-55.67-15.39-75.12.42-5.78-1.7-21.55,2.15-25.04,3.06-2.77,10.61-1.89,12.45,1.79,1.62,3.24,1.16,24.28.86,29.3-.82,13.68-6.6,32.63-4.18,45.72,1.7,9.21,7.43,7.37,11.54,11.01Z"/>
    <path fill="__COLOR1__" d="M59.76,210.04c-15.63,4.67-7-27.11,3.03-27.71,11.54-.69,9.11,23.6,8.54,32.2-.71,10.64-6.68,50.88-1.29,57.57,1.35,1.67,5.49,3.01,7.45,2.97l37.86-6.81c7.23,2.25,7.71,11.78-.03,14.51s-27.99,6-36.09,6.3c-35.97,1.37-20.11-52.73-19.46-79.03Z"/>
    <path fill="__COLOR1__" d="M190.93,280.78c-2.85,3.22-14.93,3.37-18.79,1.75-1.4-.59-5.08-4.05-5.77-3.48-.21.17-1.25,3.24-2.94,4.96-6.44,6.56-18.07,10.58-26.2,7.76-24.22-8.4-11.26-57.49,8.69-52.5,5.55,1.39,11.76,11.21,5.52,16.21-6.59,5.28-8.75-8.83-13.9,5.18-9.3,25.31,19.37,20.01,22.01,4.65.95-5.52-3.52-18.74,5.54-18.35,7.35.32,6.09,10.15,7.6,15.91,3.45,13.08,13.39.84,18.46,7.65,2.11,2.84,1.94,7.83-.22,10.26Z"/>
  </g>
  <g>
    <path fill="__COLOR2__" d="M448.91,281.04c-3.28,1.02-4.76,5.14-8.06,6.73-14.22,6.87-21.27-11.6-19.93-26.13.58-6.32,4.55-16.97,10.97-12.49,6.42,4.48.32,11.58.47,17.35.05,1.75,1.67,8.18,2.95,8.54,4.57,1.27,9.54-22.59,14.65-25.25,7.81-4.06,10.02,9.04,10.51,15.76,5.96,80.73-66.61,63.64-110.25,60.44-5.02-.37-13.61,1.44-17.73-1.54-4.74-3.43-2.73-12.38,2.16-13.23,3.9-.68,17.63,3.29,22.97,3.81,11.25,1.08,21.9.31,33.01-.03,22.77-.71,55.87,3.28,58.28-33.95Z"/>
    <path fill="__COLOR2__" d="M307.44,236.29c6.38-.92,12.43,2.71,16.71,8.26,2.94,3.82,6.21,9.08,2.09,13.51-6.59,7.1-10.54-5.48-14.23-6.81-4.48-1.62-8.17.46-9.93,5.56-6.34,18.36,23.75,25.12,31.54,10.19,3.35-6.42-4.23-18.5,2.94-22.43,9.06-4.97,9.12,8.6,10.47,14.3,1.26,5.35,4.47,10.87,8.25,14.02,4.24,3.53,13.97,5.48,9.42,14.73s-18.47-5.26-22.77-9.6c-3.17,2.24-5.22,5.47-8.64,7.57-11.95,7.35-34.16,3.87-41.18-11.23-7.25-15.59.43-35.9,15.35-38.06Z"/>
    <path fill="__COLOR2__" d="M414.83,247.29c1.82,2.32,1.56,8.97-.97,10.81-5.4,3.92-12.52-5.03-21.69,1.75-9.66,7.14-7.35,20.9-11.21,25.94s-9.89,1.62-10.54-5.22-.99-21.22-.87-28.03c.2-11.42,10.91-11.96,11.63-1.49,4.98-2.56,8.75-7.21,14.45-8,4.09-.57,16.34.61,19.21,4.26Z"/>
  </g>
</svg>`;

function LogoSvg({ color }: { color: string }) {
  const xml = LOGO_SVG.replace(/__COLOR__/g, color);
  // viewBox ratio: 245/218 ≈ 1.124 (cropped to actual art bounds)
  return <SvgXml xml={xml} height={30} width={30 * (245 / 218)} />;
}

function TitleSvg({ primary, textColor }: { primary: string; textColor: string }) {
  const xml = TITLE_SVG
    .replace(/__COLOR1__/g, primary)
    .replace(/__COLOR2__/g, textColor);
  // viewBox ratio: 430/155 ≈ 2.77 — render at a comfortable height
  return <SvgXml xml={xml} height={30} width={30 * (430 / 155)} />;
}

interface TopBarProps {
  primary: string;
  text: string;
  surface: string;
  border: string;
  isSettingsOpen: boolean;
  onShare: () => void;
  onSaveToGallery: () => void;
  onPrint: () => void;
  onOpenSettings: () => void;
}

// Animated action button: entrance slide-in from right, spring press, haptic feedback
function AnimatedBtn({
  onPress,
  borderColor,
  backgroundColor,
  extraAnimStyle,
  entranceDelay = 0,
  children,
}: {
  onPress: () => void;
  borderColor: string;
  backgroundColor?: string;
  extraAnimStyle?: object;
  entranceDelay?: number;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(16);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    opacity.value = withDelay(entranceDelay, withTiming(1, { duration: 300, easing }));
    translateX.value = withDelay(entranceDelay, withTiming(0, { duration: 300, easing }));
  }, []);

  const pressAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPressIn={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSpring(0.82, { damping: 12, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 6, stiffness: 220, mass: 0.6 });
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.btn,
          { borderColor, backgroundColor: backgroundColor ?? 'transparent' },
          pressAnimStyle,
          extraAnimStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function TopBar({
  primary,
  text,
  surface,
  border,
  isSettingsOpen,
  onShare,
  onSaveToGallery,
  onPrint,
  onOpenSettings,
}: TopBarProps) {
  // ── Brand entrance: logo + title stagger slide in from left ──────────────
  const logoOpacity = useSharedValue(0);
  const logoX = useSharedValue(-16);
  const titleOpacity = useSharedValue(0);
  const titleX = useSharedValue(-16);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    logoOpacity.value = withTiming(1, { duration: 380, easing });
    logoX.value = withTiming(0, { duration: 380, easing });
    titleOpacity.value = withDelay(120, withTiming(1, { duration: 380, easing }));
    titleX.value = withDelay(120, withTiming(0, { duration: 380, easing }));
  }, []);

  const logoEntranceStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateX: logoX.value }],
  }));
  const titleEntranceStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateX: titleX.value }],
  }));

  // ── Logo long-press wiggle ───────────────────────────────────────────────
  const wiggle = useSharedValue(0);
  const handleLogoLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    wiggle.value = withSequence(
      withTiming(-10, { duration: 55 }),
      withTiming(10, { duration: 80 }),
      withTiming(-7, { duration: 70 }),
      withTiming(7, { duration: 70 }),
      withTiming(-3, { duration: 60 }),
      withTiming(0, { duration: 55 }),
    );
  };
  const wiggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wiggle.value }],
  }));

  // ── Settings gear rotation on open/close ────────────────────────────────
  const gearRotation = useSharedValue(0);
  useEffect(() => {
    gearRotation.value = withSpring(isSettingsOpen ? 45 : 0, { damping: 12, stiffness: 200 });
  }, [isSettingsOpen]);
  const gearStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${gearRotation.value}deg` }],
  }));

  // ── Theme color transitions (dark ↔ light) ───────────────────────────────
  const prevColors = useRef({ surface, border, primary });
  const colorProgress = useSharedValue(1);
  const fromSurface = useSharedValue(surface);
  const toSurface = useSharedValue(surface);
  const fromBorder = useSharedValue(border);
  const toBorder = useSharedValue(border);
  const fromPrimary = useSharedValue(primary);
  const toPrimary = useSharedValue(primary);

  useEffect(() => {
    const prev = prevColors.current;
    if (prev.surface !== surface || prev.border !== border || prev.primary !== primary) {
      fromSurface.value = prev.surface;
      fromBorder.value = prev.border;
      fromPrimary.value = prev.primary;
      toSurface.value = surface;
      toBorder.value = border;
      toPrimary.value = primary;
      colorProgress.value = 0;
      colorProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
      prevColors.current = { surface, border, primary };
    }
  }, [surface, border, primary]);

  const barAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], [fromSurface.value, toSurface.value]),
    borderBottomColor: interpolateColor(colorProgress.value, [0, 1], [fromBorder.value, toBorder.value]),
  }));
  const separatorAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], [fromBorder.value, toBorder.value]),
  }));
  const settingsBtnColorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], [fromPrimary.value, toPrimary.value]),
    borderColor: interpolateColor(colorProgress.value, [0, 1], [fromPrimary.value, toPrimary.value]),
  }));

  return (
    <Animated.View style={[styles.bar, barAnimStyle]}>
      <View style={styles.brand}>
        <Pressable onLongPress={handleLogoLongPress} delayLongPress={400}>
          <Animated.View style={wiggleStyle}>
            <Animated.View style={logoEntranceStyle}>
              <LogoSvg color={text} />
            </Animated.View>
          </Animated.View>
        </Pressable>
        <Animated.View style={[{ marginTop: 7 }, titleEntranceStyle]}>
          <TitleSvg primary={primary} textColor={text} />
        </Animated.View>
      </View>
      <View style={styles.actions}>
        <AnimatedBtn onPress={onSaveToGallery} borderColor={border} entranceDelay={200}>
          <Ionicons name="download-outline" size={20} color={text} />
        </AnimatedBtn>
        <AnimatedBtn onPress={onShare} borderColor={border} entranceDelay={260}>
          <Ionicons name="share-social-outline" size={20} color={text} />
        </AnimatedBtn>
        <AnimatedBtn onPress={onPrint} borderColor={border} entranceDelay={320}>
          <Ionicons name="print-outline" size={20} color={text} />
        </AnimatedBtn>
        <Animated.View style={[styles.separator, separatorAnimStyle]} />
        <AnimatedBtn
          onPress={onOpenSettings}
          borderColor={primary}
          backgroundColor={primary}
          extraAnimStyle={settingsBtnColorStyle}
          entranceDelay={400}
        >
          <Animated.View style={gearStyle}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </Animated.View>
        </AnimatedBtn>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: 1,
    height: 24,
    alignSelf: 'center',
    marginHorizontal: 2,
  },
  icon: {
    fontSize: 18,
    lineHeight: 20,
  },
});
