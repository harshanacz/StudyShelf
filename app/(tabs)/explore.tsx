import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { toggleFavorite } from '@/store/favorites-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Book, OpenLibraryResponse } from '@/types/book';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';

interface CategorySection {
  title: string;
  query: string;
  books: Book[];
  loading: boolean;
}

export default function ExploreScreen() {
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [categories, setCategories] = useState<CategorySection[]>([
    { title: 'New Releases', query: 'new', books: [], loading: true },
    { title: 'Novels', query: 'novel fiction', books: [], loading: true },
    { title: 'Education', query: 'education textbook', books: [], loading: true },
    { title: 'Science', query: 'science', books: [], loading: true },
    { title: 'Technology', query: 'technology computer', books: [], loading: true },
  ]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        try {
          const response = await fetch(
            `${OPEN_LIBRARY_API}?q=${encodeURIComponent(category.query)}&limit=4`
          );
          const data: OpenLibraryResponse = await response.json();
          return {
            ...category,
            books: data.docs || [],
            loading: false,
          };
        } catch (error) {
          console.error(`Error fetching ${category.title}:`, error);
          return { ...category, loading: false };
        }
      })
    );
    setCategories(updatedCategories);
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

  const handleFavoritePress = (e: any, book: Book) => {
    e.stopPropagation();
    dispatch(toggleFavorite(book));
  };

  const renderBookItem = (book: Book) => {
    const coverUrl = getCoverUrl(book.cover_i);
    const authors = book.author_name?.join(', ') || 'Unknown Author';
    const isFavorite = favorites.some((fav) => fav.key === book.key);

    return (
      <TouchableOpacity
        key={book.key}
        style={styles.bookItem}
        onPress={() => handleBookPress(book)}
      >
        <View style={[styles.bookCover, { backgroundColor: colors.input }]}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderCover}>
              <Ionicons name="book" size={30} color="#ccc" />
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => handleFavoritePress(e, book)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#ff3b30' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.bookTitle} numberOfLines={2}>
          {book.title}
        </ThemedText>
        <ThemedText style={styles.bookAuthor} numberOfLines={1}>
          {authors}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderCategory = (category: CategorySection) => {
    if (category.loading) {
      return (
        <View key={category.title} style={styles.categorySection}>
          <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        </View>
      );
    }

    if (category.books.length === 0) {
      return null;
    }

    return (
      <View key={category.title} style={styles.categorySection}>
        <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksRow}
        >
          {category.books.map((book) => renderBookItem(book))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Explore</ThemedText>
          <ThemedText style={styles.subtitle}>Discover new books</ThemedText>
        </View>

        {categories.map((category) => renderCategory(category))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: (StatusBar.currentHeight || 0) + 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
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
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  booksRow: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bookItem: {
    width: 140,
  },
  bookCover: {
    width: 140,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    lineHeight: 18,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
  },
});
