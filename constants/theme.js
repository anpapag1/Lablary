export const lightTheme = {
  background: '#f8f9fc',
  surface: '#ffffff',
  card: '#ffffff',
  sheetBackground: '#ffffff',
  primary: '#4f46e5',
  primaryLight: '#eef2ff',
  primaryDark: '#3730a3',
  secondary: '#06b6d4',
  accent: '#f43f5e',
  text: '#0f172a',
  textSecondary: '#64748b',
  textDisabled: '#94a3b8',
  border: '#e2e8f0',
  borderFocus: '#4f46e5',
  checkerLight: '#e5e7eb',
  checkerDark: '#d1d5db',
  handle: '#ffffff',
  handleBorder: '#4f46e5',
  tabBar: '#ffffff',
  tabActive: '#4f46e5',
  tabInactive: '#94a3b8',
  shadow: 'rgba(15,23,42,0.08)',
  error: '#ef4444',
  success: '#22c55e',
};

export const darkTheme = { 
  background: '#0f172a',
  surface: '#1e293b',
  card: '#1e293b',
  sheetBackground: '#1e293b',
  primary: '#818cf8',
  primaryLight: '#1e1b4b',
  primaryDark: '#6366f1',
  secondary: '#22d3ee',
  accent: '#fb7185',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textDisabled: '#475569',
  border: '#334155',
  borderFocus: '#818cf8',
  checkerLight: '#1e293b',
  checkerDark: '#0f172a',
  handle: '#1e293b',
  handleBorder: '#818cf8',
  tabBar: '#1e293b',
  tabActive: '#818cf8',
  tabInactive: '#475569',
  shadow: 'rgba(0,0,0,0.3)',
  error: '#f87171',
  success: '#4ade80',
};

/**
 * Returns the theme based on the color scheme.
 * @param {'light' | 'dark' | null | undefined} colorScheme - from useColorScheme()
 */
export const getTheme = (colorScheme) => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
