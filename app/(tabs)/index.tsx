import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppImages } from '@/constants/app-images';
import { useAppSelector } from '@/store/hooks';
import { Book, OpenLibraryResponse } from '@/types/book';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';

const CATEGORIES = [
  { id: '1', name: 'Programming', query: 'programming' },
  { id: '2', name: 'Science', query: 'science' },
  { id: '3', name: 'Mathematics', query: 'mathematics' },
  { id: '4', name: 'History', query: 'history' },
  { id: '5', name: 'Literature', query: 'literature' },
];

export default function HomeScreen() {
  const username = useAppSelector((state) => state.auth.username);
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchBooks = async (query: string = 'javascript') => {
    try {
      setError(null);
      setLoading(true);
      const url = `${OPEN_LIBRARY_API}?q=${encodeURIComponent(query)}&limit=20`;
      
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedCategory(null);
      fetchBooks(searchQuery);
    }
  };

  const handleCategoryPress = (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category.id);
    setSearchQuery('');
    fetchBooks(category.query);
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

  const handleBookPress = (book: Book) => {
    router.push({
      pathname: '/(tabs)/book-details',
      params: {
        key: book.key,
        title: book.title,
        author_name: book.author_name?.join(', ') || 'Unknown Author',
        cover_i: book.cover_i?.toString() || '',
        first_publish_year: book.first_publish_year?.toString() || '',
      },
    });
  };

  const renderBookCard = ({ item }: { item: Book }) => {
    const coverUrl = getCoverUrl(item.cover_i);
    const authors = item.author_name?.join(', ') || 'Unknown Author';

    return (
      <TouchableOpacity style={styles.bookCard} onPress={() => handleBookPress(item)}>
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
      <View style={styles.topSection}>
        <View>
          <ThemedText style={styles.greeting}>Hello, {username}</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome to StudyShelf</ThemedText>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Image 
            source={AppImages.defaultProfile} 
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIconLeft} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.sectionTitle}>Discover Books</ThemedText>
      
      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <ThemedText
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 20,
    paddingTop: (StatusBar.currentHeight || 0) + 10,
  },
  header: {
    marginBottom: 24,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#000',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIconLeft: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    backgroundColor: '#1a1a1a',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookCard: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  bookCover: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
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
    padding: 12,
    gap: 6,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: '#1a1a1a',
  },
  bookAuthor: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  bookYear: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
});
