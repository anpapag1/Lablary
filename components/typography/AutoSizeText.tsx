import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Text, TextLayoutEventData, NativeSyntheticEvent } from 'react-native';

interface AutoSizeTextProps {
  text: string;
  fontFamily: string;
  color: string;
  maxWidth: number;
  maxHeight: number;
  minFontSize?: number;
  maxFontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Renders text that automatically shrinks to fill the available space.
 * Uses a step-down approach on onTextLayout (converges fast for short label text).
 * Resets and searches upward when the container grows.
 */
export function AutoSizeText({
  text,
  fontFamily,
  color,
  maxWidth,
  maxHeight,
  minFontSize = 6,
  maxFontSize = 200,
  textAlign = 'center',
}: AutoSizeTextProps) {
  const [fontSize, setFontSize] = useState(maxFontSize);
  // Track the "ceiling" so we can binary-search upward too
  const loRef = useRef(minFontSize);
  const hiRef = useRef(maxFontSize);
  const stableRef = useRef(false);

  // Reset when any constraint changes
  useEffect(() => {
    loRef.current = minFontSize;
    hiRef.current = maxFontSize;
    stableRef.current = false;
    setFontSize(maxFontSize);
  }, [text, fontFamily, maxWidth, maxHeight, maxFontSize, minFontSize]);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (stableRef.current) return;

      const lines = e.nativeEvent.lines;
      if (!lines || lines.length === 0) return;

      const totalHeight = lines.reduce((sum, l) => sum + l.height, 0);
      const maxLineWidth = Math.max(...lines.map((l) => l.width));

      const fits = maxLineWidth <= maxWidth + 0.5 && totalHeight <= maxHeight + 0.5;

      // Binary search: update lo/hi and pick midpoint
      if (fits) {
        loRef.current = fontSize;
      } else {
        hiRef.current = fontSize;
      }

      if (hiRef.current - loRef.current <= 1) {
        // Converged – lock at the last fitting size
        setFontSize(loRef.current);
        stableRef.current = true;
        return;
      }

      const next = Math.floor((loRef.current + hiRef.current) / 2);
      setFontSize(next);
    },
    [fontSize, maxWidth, maxHeight]
  );

  return (
    <Text
      style={{
        fontFamily,
        fontSize,
        color,
        textAlign,
        flexShrink: 1,
        // Add padding-bottom to avoid descender clipping during rasterization
        paddingBottom: Math.ceil(fontSize * 0.15),
      }}
      onTextLayout={onTextLayout}
      numberOfLines={0}
    >
      {text}
    </Text>
  );
}
