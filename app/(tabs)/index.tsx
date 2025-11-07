import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/store/hooks';
import { Book, OpenLibraryResponse } from '@/types/book';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';

export default function HomeScreen() {
  const username = useAppSelector((state) => state.auth.username);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setError(null);
      // Search for programming and computer science books
      const url = `${OPEN_LIBRARY_API}?q=javascript&limit=20`;
      
      console.log('Fetching books from Open Library...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: OpenLibraryResponse = await response.json();
      console.log('Books received:', data.docs?.length || 0);
      
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
      } else {
        setBooks([]);
        setError('No books found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch books';
      console.error('Error:', errorMessage);
      setError(errorMessage);
      setBooks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  const getCoverUrl = (coverId?: number) => {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const renderBookCard = ({ item }: { item: Book }) => {
    const coverUrl = getCoverUrl(item.cover_i);
    const authors = item.author_name?.join(', ') || 'Unknown Author';

    return (
      <TouchableOpacity style={styles.bookCard}>
        <View style={styles.bookCover}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderCover}>
              <ThemedText style={styles.placeholderText}>No Cover</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.bookInfo}>
          <ThemedText style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.bookAuthor} numberOfLines={1}>
            {authors}
          </ThemedText>
          {item.first_publish_year && (
            <ThemedText style={styles.bookYear}>{item.first_publish_year}</ThemedText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText type="title">StudyShelf</ThemedText>
      <ThemedText style={styles.subtitle}>Your digital library for academic success</ThemedText>
      <ThemedText style={styles.welcomeText}>Welcome back, {username}!</ThemedText>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>
        {error || 'No books found'}
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>Pull down to refresh</ThemedText>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading books...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={(item, index) => item.key || `book-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={books.length > 0 ? styles.row : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
  welcomeText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookCard: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    width: '100%',
    height: 180,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.5,
    fontSize: 12,
  },
  bookInfo: {
    gap: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 12,
    opacity: 0.7,
  },
  bookYear: {
    fontSize: 11,
    opacity: 0.5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    opacity: 0.6,
  },
});
