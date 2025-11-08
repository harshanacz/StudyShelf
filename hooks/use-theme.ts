import { Colors } from '@/constants/colors';
import { useAppSelector } from '@/store/hooks';

export function useTheme() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colors = Colors[themeMode];

  return {
    colors,
    isDark: themeMode === 'dark',
  };
}
