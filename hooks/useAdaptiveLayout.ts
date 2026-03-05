import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 768;

export function useAdaptiveLayout() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const isLandscape = width > height;

  // On phones: canvas takes upper portion, bottom sheet for tools
  // On tablets: side panel (320px) + expandable canvas
  const sidePanelWidth = 320;
  const canvasWidth = isTablet ? width - sidePanelWidth : width;
  const canvasHeight = isTablet ? height : height * 0.5;

  return {
    isTablet,
    isLandscape,
    screenWidth: width,
    screenHeight: height,
    sidePanelWidth,
    canvasWidth,
    canvasHeight,
  };
}
