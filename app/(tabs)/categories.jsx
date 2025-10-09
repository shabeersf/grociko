import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Fresh Fruits\n& Vegetables',
      backgroundColor: theme.colors.category.fruits.background,
      borderColor: theme.colors.category.fruits.border,
      image: require('../../assets/images/category/vegetables.png'),
      cat_id: 'fruits_vegetables',
    },
    {
      id: 2,
      name: 'Cooking Oil\n& Ghee',
      backgroundColor: theme.colors.category.oil.background,
      borderColor: theme.colors.category.oil.border,
      image: require('../../assets/images/category/staples.png'),
      cat_id: 'cooking_oil_ghee',
    },
    {
      id: 3,
      name: 'Meat & Fish',
      backgroundColor: theme.colors.category.meat.background,
      borderColor: theme.colors.category.meat.border,
      image: require('../../assets/images/category/fish_and_meat.png'),
      cat_id: 'meat_fish',
    },
    {
      id: 4,
      name: 'Bakery & Snacks',
      backgroundColor: theme.colors.category.bakery.background,
      borderColor: theme.colors.category.bakery.border,
      image: require('../../assets/images/category/snacks.png'),
      cat_id: 'bakery_snacks',
    },
    {
      id: 5,
      name: 'Dairy & Eggs',
      backgroundColor: theme.colors.category.dairy.background,
      borderColor: theme.colors.category.dairy.border,
      image: require('../../assets/images/category/diary-bakery.png'),
      cat_id: 'dairy_eggs',
    },
    {
      id: 6,
      name: 'Beverages',
      backgroundColor: theme.colors.category.beverages.background,
      borderColor: theme.colors.category.beverages.border,
      image: require('../../assets/images/category/snacks.png'),
      cat_id: 'beverages',
    },
    {
      id: 7,
      name: 'Personal Care',
      backgroundColor: '#FFF8E1',
      borderColor: '#FFD54F',
      image: require('../../assets/images/category/personal-care.png'),
      cat_id: 'personal_care',
    },
    {
      id: 8,
      name: 'Baby Care',
      backgroundColor: '#F0E8FF',
      borderColor: '#9C6ADE',
      image: require('../../assets/images/category/baby-care.png'),
      cat_id: 'baby_care',
    },
  ];

  // Responsive dimensions - Always 3 columns
  const getCardDimensions = () => {
    const padding = theme.spacing.lg * 2; // Left and right padding
    const numColumns = 3; // Always 3 columns
    const totalGaps = theme.spacing.md * (numColumns - 1); // Gaps between cards
    const availableWidth = screenWidth - padding - totalGaps;
    const cardWidth = availableWidth / numColumns;
    
    // Adaptive height based on card width to maintain proportions
    const cardHeight = Math.max(cardWidth * 1.2, 140); // Minimum height of 140
    
    return {
      numColumns,
      cardWidth: Math.floor(cardWidth),
      cardHeight: Math.floor(cardHeight),
    };
  };

  const { numColumns, cardWidth, cardHeight } = getCardDimensions();

  const handleCategoryPress = (item) => {
    router.push(`/search?cat_id=${item.cat_id}`);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          width: cardWidth,
          height: cardHeight,
          backgroundColor: item.backgroundColor,
          borderColor: item.borderColor,
        },
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.categoryImage}
          resizeMode="contain"
        />
      </View>

      {/* Category Name */}
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Find Products</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/search')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.text.secondary}
            style={styles.searchIcon}
          />
          <Text style={styles.searchPlaceholder}>Search Store</Text>
        </TouchableOpacity>

        {/* Categories Grid */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={`${numColumns}-${screenWidth}`} // Force re-render when screen changes
          contentContainerStyle={styles.categoriesContainer}
          columnWrapperStyle={styles.categoryRow}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
  },

  // Header Styles
  headerSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Search Bar Styles
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.input,
    borderColor: theme.colors.secondary.main,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
  },
  searchIcon: {
    marginRight: theme.spacing.md,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.placeholder,
  },

  // Categories Styles
  categoriesContainer: {
    paddingBottom: theme.spacing['6xl'],
  },
  categoryRow: {
    justifyContent: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  categoryCard: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },

  // Image Styles
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    marginBottom: theme.spacing.sm,
  },
  categoryImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    maxWidth: 70,
    maxHeight: 70,
  },

  // Text Styles
  categoryName: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.xs * 1.3,
  },
});

export default Categories;