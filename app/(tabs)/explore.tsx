import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Explore Books</ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover reference books by subject
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Popular Subjects
          </ThemedText>
          <ThemedView style={styles.subjectGrid}>
            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature'].map(
              (subject) => (
                <ThemedView key={subject} style={styles.subjectCard}>
                  <ThemedText style={styles.subjectText}>{subject}</ThemedText>
                </ThemedView>
              )
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Coming Soon
          </ThemedText>
          <ThemedText style={styles.description}>
            • Search books by title or author{'\n'}
            • Filter by subject and level{'\n'}
            • View book details and reviews{'\n'}
            • Save books to your collection
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
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
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
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    minWidth: 100,
  },
  subjectText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
