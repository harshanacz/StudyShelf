import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/store/hooks';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const username = useAppSelector((state) => state.auth.username);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText type="title">StudyShelf</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your digital library for academic success
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Welcome back, {username}!</ThemedText>
          <ThemedText style={styles.description}>
            Browse and discover reference books for your subjects. Build your personal study collection.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Quick Stats
          </ThemedText>
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statCard}>
              <ThemedText type="title">0</ThemedText>
              <ThemedText>Books Saved</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText type="title">0</ThemedText>
              <ThemedText>Subjects</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Getting Started
          </ThemedText>
          <ThemedText style={styles.description}>
            • Browse books by subject{'\n'}
            • Save books to your collection{'\n'}
            • Access your saved books anytime{'\n'}
            • Discover new study materials
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    opacity: 0.8,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
});
