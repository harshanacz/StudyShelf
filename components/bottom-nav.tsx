import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, isActive('/(tabs)') && styles.navItemActive]}
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons
            name={isActive('/(tabs)') ? 'home' : 'home-outline'}
            size={24}
            color={isActive('/(tabs)') ? '#000' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="list-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/favorites')}
        >
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="grid-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: '#fff',
  },
});
