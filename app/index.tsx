import { useAppSelector } from '@/store/hooks';
import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasSeenOnboarding = useAppSelector((state) => state.onboarding.hasSeenOnboarding);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
