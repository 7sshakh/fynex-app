// Fynex 3.0 Design System — "The Neon Academic"
// Based on Google Stitch design output

export const colors = {
  background: '#0e0e0e',
  surface: '#0e0e0e',
  surfaceDim: '#0e0e0e',
  surfaceContainerLowest: '#000000',
  surfaceContainerLow: '#131313',
  surfaceContainer: '#1a1919',
  surfaceContainerHigh: '#201f1f',
  surfaceContainerHighest: '#262626',
  surfaceBright: '#2c2c2c',
  surfaceVariant: '#262626',

  primary: '#c3ff2d',
  primaryDim: '#b5f018',
  primaryContainer: '#b2ed12',
  onPrimary: '#455f00',
  onPrimaryContainer: '#3d5400',

  secondary: '#dde8b7',
  secondaryDim: '#cfd9aa',
  secondaryContainer: '#424a26',
  onSecondaryContainer: '#cbd5a6',

  tertiary: '#ff734a',
  tertiaryDim: '#ff734a',
  tertiaryContainer: '#ff5722',
  onTertiary: '#430c00',

  error: '#ff7351',
  errorDim: '#d53d18',
  errorContainer: '#b92902',

  onSurface: '#ffffff',
  onSurfaceVariant: '#adaaaa',
  onBackground: '#ffffff',

  outline: '#777575',
  outlineVariant: '#494847',
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #c3ff2d, #b2ed12)',
  tertiary: 'linear-gradient(135deg, #ff734a, #ff5722)',
  streakGlow: '0 0 40px rgba(255, 115, 74, 0.2)',
  primaryGlow: '0 0 40px rgba(195, 255, 46, 0.12)',
  primaryShadow: '0 10px 40px rgba(195, 255, 46, 0.2)',
  neonGlow: '0 0 30px rgba(195, 255, 46, 0.4)',
} as const;
