import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, makeShadow, makeShadowSoft } from './index';

const STORAGE_KEY = 'catfolio.themeMode';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() =>
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setModeState(saved);
    });
  }, []);

  const setMode = useCallback((next) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setModeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => {
    const isDark = mode === 'dark';
    return {
      mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      shadow: makeShadow(isDark),
      shadowSoft: makeShadowSoft(isDark),
      toggle,
      setMode,
    };
  }, [mode, toggle, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const DEFAULT_THEME = {
  mode: 'light',
  isDark: false,
  colors: lightColors,
  shadow: makeShadow(false),
  shadowSoft: makeShadowSoft(false),
  toggle: () => {},
  setMode: () => {},
};

export function useTheme() {
  return useContext(ThemeContext) ?? DEFAULT_THEME;
}

export function useThemedStyles(factory) {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
