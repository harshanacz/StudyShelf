import { ThemedText } from '@/components/themed-text';
import { AppImages } from '@/constants/app-images';
import { useTheme } from '@/hooks/use-theme';
import { logout } from '@/store/auth-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/theme-slice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, SafeAreaView, StatusBar, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const username = useAppSelector((state) => state.auth.username);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.input }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image source={AppImages.defaultProfile} style={[styles.profileImage, { borderColor: colors.text }]} />
          <ThemedText style={[styles.username, { color: colors.text }]}>{username}</ThemedText>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Settings</ThemedText>

          <View style={[styles.settingItem, { backgroundColor: colors.input }]}>
            <View style={styles.settingLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.primary} />
              <ThemedText style={[styles.settingText, { color: colors.text }]}>Dark Mode</ThemedText>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                dispatch(toggleTheme());
              }}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.input }]} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={22} color="#ff3b30" />
              <ThemedText style={[styles.settingText, { color: colors.text }]}>Logout</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  settingsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
