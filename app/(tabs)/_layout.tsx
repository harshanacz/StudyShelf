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
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="favorites" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="book-details" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});
