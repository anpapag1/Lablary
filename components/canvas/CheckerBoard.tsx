import React from 'react';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

interface CheckerBoardProps {
  width: number;
  height: number;
  lightColor: string;
  darkColor: string;
  cellSize?: number;
}

export function CheckerBoard({
  width,
  height,
  lightColor,
  darkColor,
  cellSize = 12,
}: CheckerBoardProps) {
  const cell = cellSize;
  const double = cell * 2;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Pattern
          id="checker"
          x="0"
          y="0"
          width={double}
          height={double}
          patternUnits="userSpaceOnUse"
        >
          {/* top-left: light */}
          <Rect x="0" y="0" width={cell} height={cell} fill={lightColor} />
          {/* top-right: dark */}
          <Rect x={cell} y="0" width={cell} height={cell} fill={darkColor} />
          {/* bottom-left: dark */}
          <Rect x="0" y={cell} width={cell} height={cell} fill={darkColor} />
          {/* bottom-right: light */}
          <Rect x={cell} y={cell} width={cell} height={cell} fill={lightColor} />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#checker)" />
    </Svg>
  );
}
