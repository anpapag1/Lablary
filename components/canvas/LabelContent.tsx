import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LabelState } from '../../types/label';
import { FONTS } from '../../constants/fonts';

interface LabelContentProps {
  label: LabelState;
}

export function LabelContent({ label }: LabelContentProps) {
  const {
    width, height, text,
    fontFamily, fontSize, fontWeight,
    textColor, iconSvg, iconColor,
    layout, backgroundColor, padding, borderRadius,
  } = label;

  // Resolve actual loaded font family by weight
  const fontEntry = FONTS.find(f => f.regularFamily === fontFamily);
  const resolvedFamily =
    fontWeight === 'bold' && fontEntry?.boldFamily ? fontEntry.boldFamily : fontFamily;

  const hasIcon = !!iconSvg && layout !== 'TEXT_ONLY';
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const gap = 8;

  const isVertical = layout === 'ICON_TOP';

  // For ICON_TOP: icon fills whatever vertical space remains after the text line.
  // Approximate text line height from fontSize so we can compute this statically.
  const textLineH = Math.ceil(fontSize * 1.25);
  const iconTopSize = Math.max(0, Math.min(innerW, innerH - gap - textLineH));

  // For row layouts the icon height matches the full inner height (square).
  const iconRowSize = Math.round(innerH);

  const iconSize = isVertical ? iconTopSize : iconRowSize;

  const iconEl = hasIcon ? (
    <View style={[styles.iconWrapper, { width: iconSize, height: iconSize }]}>
      <SvgXml xml={iconSvg!} width={iconSize} height={iconSize} color={iconColor} />
    </View>
  ) : null;

  const gapEl = hasIcon
    ? (isVertical ? <View style={{ height: gap }} /> : <View style={{ width: gap }} />)
    : null;

  const textEl = (
    <View style={isVertical ? styles.textWrapperVertical : styles.textWrapperRow}>
      <Text style={{ fontFamily: resolvedFamily, fontSize, color: textColor, textAlign: 'center' }}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={[
      styles.container,
      { width, height, backgroundColor, borderRadius, padding },
      isVertical ? styles.containerColumn : styles.containerRow,
    ]}>
      {layout === 'ICON_RIGHT' ? (
        <>{textEl}{gapEl}{iconEl}</>
      ) : (
        <>{iconEl}{gapEl}{textEl}</>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  containerRow: {
    flexDirection: 'row',
  },
  containerColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrapperRow: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textWrapperVertical: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

