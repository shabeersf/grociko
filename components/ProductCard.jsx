import { useCart } from '@/providers/CartProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ProductCard = ({ item, onPress }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const handleAddToCart = () => {
    addToCart(item, 1);
  };

  const handleIncrement = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity + 1);
    } else {
      addToCart(item, 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else if (quantity === 1) {
      updateQuantity(item.id, 0);
    }
  };

  const handlePress = () => {
    // Navigate to product detail page
    router.push(`/product/${item.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.productImage}
          resizeMode="cover"
        />
        {item.mrp > item.sellingPrice && (
          <View style={styles.offerTag}>
            <Text style={styles.offerText}>
              {Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
        
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.mrpPrice}>£{item.mrp.toFixed(2)}</Text>
            <Text style={styles.sellingPrice}>£{item.sellingPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {quantity === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <Ionicons name="add" size={16} color={theme.colors.text.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrement}
              >
                <Ionicons name="remove" size={12} color={theme.colors.text.white} />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}
              >
                <Ionicons name="add" size={12} color={theme.colors.text.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 173,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.components.productCard.borderRadius,
    borderWidth: theme.borderWidth[1],
    borderColor: theme.colors.surface.border,
    marginRight: theme.spacing.md,
    marginLeft: theme.spacing.xs,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: theme.colors.surface.light,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    position: 'relative',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  productName: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.tight,
    textAlign: 'left',
  },
  productUnit: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  priceContainer: {
    marginBottom: theme.spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  mrpPrice: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    textDecorationLine: 'line-through',
    marginRight: theme.spacing.sm,
  },
  sellingPrice: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  offerTag: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    zIndex: 2,
  },
  offerText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.main,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.xs,
    height: 32,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.main,
    borderRadius: theme.borderRadius.sm,
  },
  quantityText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
    marginHorizontal: theme.spacing.sm,
    minWidth: 16,
    textAlign: 'center',
  },
});

export default ProductCard;