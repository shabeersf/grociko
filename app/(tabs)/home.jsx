import BannerCarousel from "@/components/BannerCarousel";
import ProductCard from "@/components/ProductCard";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {

  // Banner data using local slider images
  const bannerData = [
    {
      id: 1,
      title: "Fresh Vegetables",
      subtitle: "Get Up To 40% OFF",
      image: require("../../assets/images/slider/slider_1.png"),
      backgroundColor: theme.colors.category.fruits.background,
    },
    {
      id: 2,
      title: "Organic Fruits",
      subtitle: "Fresh & Healthy 30% OFF",
      image: require("../../assets/images/slider/slider_2.png"),
      backgroundColor: theme.colors.category.dairy.background,
    },
    {
      id: 3,
      title: "Daily Essentials",
      subtitle: "Save 25% Today",
      image: require("../../assets/images/slider/slider_3.png"),
      backgroundColor: theme.colors.category.beverages.background,
    },
  ];

  const exclusiveOffers = [
    {
      id: 1,
      name: "Organic Bananas",
      unit: "7pcs, Price per kg",
      mrp: 5.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "fruits",
    },
    {
      id: 2,
      name: "Red Apple",
      unit: "1kg, Price per kg",
      mrp: 6.49,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/02.png"),
      category: "fruits",
    },
    {
      id: 3,
      name: "Fresh Avocado",
      unit: "2pcs, Price per pack",
      mrp: 7.99,
      sellingPrice: 6.49,
      image: require("../../assets/images/products/large/03.png"),
      category: "fruits",
    },
    {
      id: 4,
      name: "Organic Lemon",
      unit: "500g, Price per pack",
      mrp: 3.49,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "fruits",
    },
    {
      id: 5,
      name: "Sweet Orange",
      unit: "1kg, Price per kg",
      mrp: 5.49,
      sellingPrice: 4.49,
      image: require("../../assets/images/products/large/02.png"),
      category: "fruits",
    },
  ];

  const bestSelling = [
    {
      id: 6,
      name: "Bell Pepper Red",
      unit: "1kg, Price per kg",
      mrp: 6.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/03.png"),
      category: "vegetables",
    },
    {
      id: 7,
      name: "Ginger",
      unit: "250gm, Price per 250g",
      mrp: 5.49,
      sellingPrice: 3.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "vegetables",
    },
    {
      id: 8,
      name: "Fresh Tomatoes",
      unit: "1kg, Price per kg",
      mrp: 4.99,
      sellingPrice: 3.49,
      image: require("../../assets/images/products/large/01.png"),
      category: "vegetables",
    },
    {
      id: 9,
      name: "Green Cucumber",
      unit: "500g, Price per pack",
      mrp: 3.99,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/02.png"),
      category: "vegetables",
    },
    {
      id: 10,
      name: "Fresh Spinach",
      unit: "250g, Price per bunch",
      mrp: 2.99,
      sellingPrice: 2.49,
      image: require("../../assets/images/products/large/03.png"),
      category: "vegetables",
    },
    {
      id: 11,
      name: "White Onions",
      unit: "1kg, Price per kg",
      mrp: 3.49,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "vegetables",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Fresh Fruits & Vegetable",
      backgroundColor: theme.colors.category.fruits.background,
      borderColor: theme.colors.category.fruits.border,
      image: require("../../assets/images/category/vegetables.png"),
      cat_id: 'fruits_vegetables',
    },
    {
      id: 2,
      name: "Cooking Oil & Ghee",
      backgroundColor: theme.colors.category.oil.background,
      borderColor: theme.colors.category.oil.border,
      image: require("../../assets/images/category/staples.png"),
      cat_id: 'cooking_oil_ghee',
    },
    {
      id: 3,
      name: "Meat & Fish",
      backgroundColor: theme.colors.category.meat.background,
      borderColor: theme.colors.category.meat.border,
      image: require("../../assets/images/category/fish_and_meat.png"),
      cat_id: 'meat_fish',
    },
    {
      id: 4,
      name: "Bakery & Snacks",
      backgroundColor: theme.colors.category.bakery.background,
      borderColor: theme.colors.category.bakery.border,
      image: require("../../assets/images/category/snacks.png"),
      cat_id: 'bakery_snacks',
    },
    {
      id: 5,
      name: "Dairy & Eggs",
      backgroundColor: theme.colors.category.dairy.background,
      borderColor: theme.colors.category.dairy.border,
      image: require("../../assets/images/category/diary-bakery.png"),
      cat_id: 'dairy_eggs',
    },
    {
      id: 6,
      name: "Beverages",
      backgroundColor: theme.colors.category.beverages.background,
      borderColor: theme.colors.category.beverages.border,
      image: require("../../assets/images/category/snacks.png"),
      cat_id: 'beverages',
    },
    {
      id: 7,
      name: "Personal Care",
      backgroundColor: "#FFF8E1",
      borderColor: "#FFD54F",
      image: require("../../assets/images/category/personal-care.png"),
      cat_id: 'personal_care',
    },
    {
      id: 8,
      name: "Baby Care",
      backgroundColor: "#F0E8FF",
      borderColor: "#9C6ADE",
      image: require("../../assets/images/category/baby-care.png"),
      cat_id: 'baby_care',
    },
  ];

  const meatProducts = [
    {
      id: 12,
      name: "Beef Bone",
      unit: "1kg, Price per kg",
      mrp: 12.99,
      sellingPrice: 9.99,
      image: require("../../assets/images/products/large/07.png"),
      category: "meat",
    },
    {
      id: 13,
      name: "Broiler Chicken",
      unit: "1kg, Price per kg",
      mrp: 8.99,
      sellingPrice: 6.99,
      image: require("../../assets/images/products/large/08.png"),
      category: "meat",
    },
    {
      id: 14,
      name: "Fresh Salmon",
      unit: "500g, Price per pack",
      mrp: 15.99,
      sellingPrice: 12.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "fish",
    },
    {
      id: 15,
      name: "Lamb Chops",
      unit: "1kg, Price per kg",
      mrp: 18.99,
      sellingPrice: 15.99,
      image: require("../../assets/images/products/large/02.png"),
      category: "meat",
    },
    {
      id: 16,
      name: "Ground Turkey",
      unit: "500g, Price per pack",
      mrp: 7.99,
      sellingPrice: 6.49,
      image: require("../../assets/images/products/large/03.png"),
      category: "meat",
    },
  ];

  const brands = [
    {
      id: 1,
      name: "Fresh Farm",
      image: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Organic Plus",
      image: "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Green Valley",
      image: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Pure Nature",
      image: "https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 5,
      name: "Golden Harvest",
      image: "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 6,
      name: "Local Mart",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
  ];

  const handleProductPress = (item) => {
    // Navigate to product details
    console.log("Product pressed:", item.name);
  };

  const handleBannerPress = (item) => {
    // Navigate to category or promotion page
    console.log("Banner pressed:", item.title);
  };

  const handleCategoryPress = (item) => {
    // Navigate to search page with category ID
    router.push(`/(tabs)/search?cat_id=${item.cat_id}`);
  };

  const handleSeeAll = (section) => {
    switch(section) {
      case "categories":
        router.push("/(tabs)/categories");
        break;
      case "exclusive":
      case "best-selling":
      case "meat":
      case "brands":
        router.push("/(tabs)/search");
        break;
      default:
        router.push("/(tabs)/search");
        break;
    }
  };

  const handleBrandPress = (brand) => {
    // Navigate to search page with brand filter
    router.push(`/(tabs)/search?brand=${brand.name.toLowerCase()}`);
  };

  const renderProductCard = ({ item }) => (
    <ProductCard item={item} onPress={handleProductPress} />
  );

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
      <View style={[styles.categoryImageContainer, {
        backgroundColor: item.backgroundColor,
        borderColor: item.borderColor || 'transparent'
      }]}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.categoryImage}
          resizeMode="contain"
        />
        <Text style={styles.categoryNameInside} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );


  const renderBrandItem = ({ item }) => (
    <TouchableOpacity style={styles.brandItem} onPress={() => handleBrandPress(item)}>
      <View style={styles.brandImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.brandImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.brandName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {/* Company Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/company/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Profile Section */}
            <TouchableOpacity style={styles.profileSection} onPress={() => router.push("/my-details")}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/search')}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.searchPlaceholder}>Search Store</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <BannerCarousel
          data={bannerData}
          onPress={handleBannerPress}
        />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => handleSeeAll("categories")}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Exclusive Offer */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exclusive Offer</Text>
            <TouchableOpacity onPress={() => handleSeeAll("exclusive")}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={exclusiveOffers}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Best Selling */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Selling</Text>
            <TouchableOpacity onPress={() => handleSeeAll("best-selling")}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bestSelling}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Brands */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Brand</Text>
            <TouchableOpacity onPress={() => handleSeeAll("brands")}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={brands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandsList}
          />
        </View>

        {/* Meat & Fish */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meat & Fish</Text>
            <TouchableOpacity onPress={() => handleSeeAll("meat")}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={meatProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>
      </ScrollView>
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
  header: {
    // paddingTop: theme.spacing.md,
    // marginBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  logo: {
    width: 140,
    height: 70,
  },
  profileSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },

  // Search Styles
  searchContainer: {
    // paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.components.searchBar.borderRadius,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.components.searchBar.padding,
    height: theme.components.searchBar.height,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
    paddingBottom:10
  },
  searchPlaceholder: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.placeholder,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },


  // Section Styles
  section: {
    marginBottom: theme.spacing.xl,
  },
  lastSection: {
    marginBottom: theme.spacing["4xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },
  seeAllText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Medium",
    color: theme.colors.secondary.main,
  },

  // List Styles
  productList: {
    paddingLeft: theme.spacing.xs,
  },
  categoriesList: {
    paddingLeft: theme.spacing.xs,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    width: 120,
  },
  categoryImageContainer: {
    width: 120,
    height: 140,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  categoryImage: {
    width: 90,
    height: 90,
  },
  categoryNameInside: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.tight,
    marginTop: -theme.spacing.sm,
  },

  // Brand Styles
  brandsList: {
    paddingLeft: theme.spacing.xs,
  },
  brandItem: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    width: 80,
  },
  brandImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export default Home;
