import { ThemedText } from '@/components/themed-text';
import { toggleFavorite } from '@/store/favorites-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Book } from '@/types/book';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

interface BookDetails extends Book {
  description?: string | { value: string };
  number_of_pages?: number;
  publishers?: string[];
  subjects?: string[];
}

export default function BookDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const currentBook: Book = {
    key: params.key as string,
    title: params.title as string,
    author_name: (params.author_name as string)?.split(','),
    cover_i: params.cover_i ? parseInt(params.cover_i as string) : undefined,
    first_publish_year: params.first_publish_year ? parseInt(params.first_publish_year as string) : undefined,
  };

  const isFavorite = favorites.some((fav) => fav.key === currentBook.key);

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(currentBook));
  };

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const bookKey = params.key as string;
      const response = await fetch(`https://openlibrary.org${bookKey}.json`);
      const data = await response.json();
      setBookDetails(data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoverUrl = (coverId?: string) => {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  };

  const getDescription = () => {
    if (!bookDetails?.description) return 'No description available.';
    if (typeof bookDetails.description === 'string') return bookDetails.description;
    return bookDetails.description.value || 'No description available.';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  const coverUrl = getCoverUrl(params.cover_i as string);
  const authors = params.author_name ? (params.author_name as string).split(',') : ['Unknown Author'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButtonLarge} onPress={handleFavoritePress}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#ff3b30' : '#000'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.coverContainer}>
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderCover}>
                <Ionicons name="book" size={60} color="#ccc" />
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <ThemedText style={styles.title}>{params.title as string}</ThemedText>
            <ThemedText style={styles.author}>{authors.join(', ')}</ThemedText>

            <View style={styles.metaContainer}>
              {params.first_publish_year && (
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={18} color="#666" />
                  <ThemedText style={styles.metaText}>
                    Published: {params.first_publish_year}
                  </ThemedText>
                </View>
              )}
              {bookDetails?.number_of_pages && (
                <View style={styles.metaItem}>
                  <Ionicons name="document-text-outline" size={18} color="#666" />
                  <ThemedText style={styles.metaText}>
                    {bookDetails.number_of_pages} pages
                  </ThemedText>
                </View>
              )}
              {bookDetails?.publishers && bookDetails.publishers.length > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons name="business-outline" size={18} color="#666" />
                  <ThemedText style={styles.metaText}>
                    {bookDetails.publishers[0]}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.descriptionSection}>
              <ThemedText style={styles.sectionTitle}>Description</ThemedText>
              <ThemedText style={styles.description}>{getDescription()}</ThemedText>
            </View>

            {bookDetails?.subjects && bookDetails.subjects.length > 0 && (
              <View style={styles.subjectsSection}>
                <ThemedText style={styles.sectionTitle}>Subjects</ThemedText>
                <View style={styles.subjectsContainer}>
                  {bookDetails.subjects.slice(0, 10).map((subject, index) => (
                    <View key={index} style={styles.subjectChip}>
                      <ThemedText style={styles.subjectText}>{subject}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: (StatusBar.currentHeight || 0) + 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  coverImage: {
    width: 200,
    height: 300,
    borderRadius: 12,
  },
  placeholderCover: {
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    lineHeight: 34,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  metaContainer: {
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 15,
    color: '#666',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  subjectsSection: {
    marginBottom: 24,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subjectText: {
    fontSize: 13,
    color: '#666',
  },
});
