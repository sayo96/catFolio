const accents = {
  primary: '#7A6FF0',
  primaryDark: '#6155D6',
  success: '#22C55E',
  danger: '#FF5A66',
  heart: '#FF4D67',
  star: '#F5B400',
  warning: '#FDCB6E',
  info: '#3B82F6',
  onPrimary: '#FFFFFF',
  upvote: '#22C55E',
  downvote: '#FF5A66',
};

export const lightColors = {
  ...accents,
  background: '#F4F3FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F1F8',
  border: '#ECECF3',
  text: '#16161D',
  textMuted: '#6B7280',
  primarySoft: '#ECEAFD',
  header: '#F4F3FB',
  tabBar: '#FFFFFF',
  overlay: 'rgba(20,20,40,0.35)',
};

export const darkColors = {
  ...accents,
  background: '#0B0B10',
  surface: '#16161E',
  surfaceMuted: '#20202A',
  border: '#23232C',
  text: '#F5F6FA',
  textMuted: '#9AA0AE',
  primarySoft: '#241F3D',
  header: '#0B0B10',
  tabBar: '#111119',
  overlay: 'rgba(0,0,0,0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  card: 20,
  pill: 999,
};

export const typography = {
  heading: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, fontWeight: '500' },
  metadata: { fontSize: 15, fontWeight: '500' },
  body: { fontSize: 15, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
};

export function makeShadow(isDark) {
  return isDark
    ? { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 }
    : { shadowColor: '#6C5CE7', shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 };
}

export function makeShadowSoft(isDark) {
  return isDark
    ? { shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5 }
    : { shadowColor: '#1A1A2E', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 };
}
