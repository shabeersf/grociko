import ProductCard from "@/components/ProductCard";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { useCart } from "@/providers/CartProvider";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  // Sample product data - in real app, this would come from API
  const productData = {
    1: {
      id: 1,
      name: "Natural Red Apple",
      unit: "1kg, Price per kg",
      mrp: 6.49,
      sellingPrice: 4.99,
      images: [
        require("../../assets/images/products/large/01.png"),
        require("../../assets/images/products/large/02.png"),
        require("../../assets/images/products/large/03.png"),
      ],
      category: "fruits",
      description:
        "Apples Are Nutritious. Apples May Be Good For Weight Loss. Apples May Be Good For Your Heart. As Part Of A Healthful And Varied Diet.",
      nutritions: {
        calories: "52 per 100g",
        protein: "0.3g",
        carbs: "14g",
        fiber: "2.4g",
        sugar: "10g",
        fat: "0.2g",
      },
    },
    2: {
      id: 2,
      name: "Organic Bananas",
      unit: "7pcs, Price per kg",
      mrp: 5.99,
      sellingPrice: 4.99,
      images: [
        require("../../assets/images/products/large/04.png"),
        require("../../assets/images/products/large/05.png"),
        require("../../assets/images/products/large/06.png"),
      ],
      category: "fruits",
      description:
        "Fresh organic bananas rich in potassium and vitamins. Perfect for smoothies, snacks, or baking. Naturally sweet and nutritious.",
      nutritions: {
        calories: "89 per 100g",
        protein: "1.1g",
        carbs: "23g",
        fiber: "2.6g",
        sugar: "12g",
        fat: "0.3g",
      },
    },
  };

  // Related products data
  const relatedProducts = [
    {
      id: 3,
      name: "Bell Pepper Red",
      unit: "1kg, Price per kg",
      mrp: 6.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/07.png"),
      category: "vegetables",
    },
    {
      id: 4,
      name: "Ginger",
      unit: "250gm, Price per 250g",
      mrp: 5.49,
      sellingPrice: 3.99,
      image: require("../../assets/images/products/large/08.png"),
      category: "vegetables",
    },
  ];

  const product = productData[id] || productData[1];
  const quantity = getItemQuantity(product.id);

  const handleImageScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    // Add the first image as the main image for cart display
    const productWithImage = {
      ...product,
      image: product.images[0], // Use first image for cart
    };
    addToCart(productWithImage, 1);
  };

  const handleViewCart = () => {
    router.push("/(tabs)/cart");
  };

  const handleIncrement = () => {
    if (quantity > 0) {
      updateQuantity(product.id, quantity + 1);
    } else {
      const productWithImage = {
        ...product,
        image: product.images[0],
      };
      addToCart(productWithImage, 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else if (quantity === 1) {
      updateQuantity(product.id, 0);
    }
  };

  const renderImage = ({ item }) => (
    <View style={styles.imageSlide}>
      <Image
        source={typeof item === "string" ? { uri: item } : item}
        style={styles.productImage}
        resizeMode="cover"
      />
    </View>
  );

  const renderRelatedProduct = ({ item }) => <ProductCard item={item} />;

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons
              name="share-outline"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            data={product.images}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            snapToAlignment="center"
            decelerationRate="fast"
          />

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.activePaginationDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.titleContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productUnit}>{product.unit}</Text>
          </View>

          {/* Quantity and Price Row */}
          <View style={styles.quantityPriceRow}>
            <View style={styles.quantitySection}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrement}
                disabled={quantity === 0}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity || 1}</Text>
              </View>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={theme.colors.primary.main}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.price}>£{product.sellingPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Product Detail Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setIsDetailExpanded(!isDetailExpanded)}
          >
            <Text style={styles.sectionTitle}>Product Detail</Text>
            <Ionicons
              name={isDetailExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          {isDetailExpanded && (
            <View style={styles.sectionContent}>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}
        </View>

        {/* Nutritions Section */}
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nutritions</Text>
            <View style={styles.nutritionInfo}>
              <View style={styles.nutritionBadge}>
                <Text style={styles.nutritionText}>100gr</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text.secondary}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Add To Basket Button */}
        <View style={styles.addToBasketContainer}>
          <TouchableOpacity
            style={[
              styles.addToBasketButton,
              quantity > 0 && styles.viewCartButton,
            ]}
            onPress={quantity > 0 ? handleViewCart : handleAddToCart}
          >
            <Text
              style={styles.addToBasketText}
            >
              {quantity > 0 ? "View Cart" : "Add To Basket"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Related Products */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Products</Text>
          <FlatList
            data={relatedProducts}
            renderItem={renderRelatedProduct}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedList}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },

  // Image Carousel Styles
  imageContainer: {
    height: 350,
    backgroundColor: theme.colors.surface.light,
    marginBottom: theme.spacing.xl,
  },
  imageSlide: {
    width: width,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: width * 0.8,
    height: 280,
    borderRadius: theme.borderRadius.lg,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginHorizontal: theme.spacing.xs / 2,
  },
  activePaginationDot: {
    backgroundColor: theme.colors.primary.main,
    width: 20,
  },

  // Product Info Styles
  productInfo: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  titleContainer: {
    marginBottom: theme.spacing.lg,
  },
  productName: {
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  productUnit: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },

  // Quantity and Price Styles
  quantityPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface.input,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityDisplay: {
    width: 60,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    borderRadius: theme.borderRadius.lg,
  },
  quantityText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },
  price: {
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },

  // Section Styles
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },
  sectionContent: {
    paddingTop: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },

  // Nutrition Styles
  nutritionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionBadge: {
    backgroundColor: theme.colors.surface.input,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  nutritionText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
  },

  // Add To Basket Styles
  addToBasketContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  addToBasketButton: {
    backgroundColor: theme.colors.primary.main,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  addToBasketText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },
  viewCartButton: {
    backgroundColor: theme.colors.secondary.main,
  },

  // Related Products Styles
  relatedSection: {
    marginBottom: theme.spacing["6xl"],
  },
  relatedTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  relatedList: {
    paddingLeft: theme.spacing.lg,
  },
});
