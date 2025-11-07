import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppImages } from '@/constants/app-images';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <View style={styles.titleBubble}>
            <ThemedText style={styles.headerTitle}>StudyShelf</ThemedText>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.profileBubble}>
              <Image source={AppImages.defaultProfile} style={styles.profileImage} />
            </View>
          </TouchableOpacity>
        ),
        headerTitle: '',
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="profile" 
        options={{
          headerLeft: undefined,
          headerTitle: 'Profile',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  titleBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 8,
    borderRadius: 30,
    marginRight: 16,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
