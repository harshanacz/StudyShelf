import BottomNav from '@/components/bottom-nav';
import { ThemedText } from '@/components/themed-text';
import { useAppSelector } from '@/store/hooks';
import { Book } from '@/types/book';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const router = useRouter();

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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ccc" />
      <ThemedText style={styles.emptyTitle}>No Favorites Yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Start adding books to your favorites!
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>My Favorites</ThemedText>
          <ThemedText style={styles.count}>{favorites.length} books</ThemedText>
        </View>

        <FlatList
          data={favorites}
          renderItem={renderBookCard}
          keyExtractor={(item) => item.key}
          numColumns={2}
          columnWrapperStyle={favorites.length > 0 ? styles.row : undefined}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomNav />
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
  count: {
    fontSize: 14,
    color: '#999',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
