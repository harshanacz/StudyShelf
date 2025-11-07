import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppImages } from '@/constants/app-images';
import { logout } from '@/store/auth-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const username = useAppSelector((state) => state.auth.username);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    <ThemedView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={AppImages.defaultProfile} style={styles.profileImage} />
        <ThemedText type="title" style={styles.username}>
          {username}
        </ThemedText>
      </View>

      <View style={styles.settingsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Settings
        </ThemedText>

        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <ThemedText style={styles.settingText}>Logout</ThemedText>
          <ThemedText style={styles.settingArrow}>›</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  username: {
    marginTop: 8,
  },
  settingsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 24,
    opacity: 0.3,
  },
});
