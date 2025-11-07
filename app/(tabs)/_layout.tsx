import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="profile" 
        options={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitle: 'Profile',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});
