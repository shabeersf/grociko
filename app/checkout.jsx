import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useCart } from '@/providers/CartProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Checkout = () => {
  const { items, getCartSummary, clearCart } = useCart();
  const { formattedPrice, totalItems } = getCartSummary();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoSuggestions, setShowPromoSuggestions] = useState(false);

  const deliveryFee = 2.99;
  const vatRate = 0.20; // 20% VAT
  const subtotal = parseFloat(formattedPrice.replace(/[£$,]/g, '')) || 0;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) : 0;
  const discountedSubtotal = subtotal - promoDiscount;
  const vatAmount = discountedSubtotal * vatRate;
  const totalAmount = discountedSubtotal + deliveryFee + vatAmount;

  // Available promo codes
  const promoCodes = [
    {
      code: 'WELCOME10',
      discount: 0.10,
      description: '10% off on first order',
      minOrder: 15.00,
    },
    {
      code: 'SAVE20',
      discount: 0.20,
      description: '20% off on orders over £30',
      minOrder: 30.00,
    },
    {
      code: 'FRESH15',
      discount: 0.15,
      description: '15% off on fresh products',
      minOrder: 20.00,
    },
    {
      code: 'NEWUSER',
      discount: 0.25,
      description: '25% off for new customers',
      minOrder: 25.00,
    },
  ];

  // Get suggested promo codes based on subtotal
  const getSuggestedPromos = () => {
    return promoCodes.filter(promo => subtotal >= promo.minOrder && !appliedPromo);
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'card-outline',
      details: 'Secure payment via card',
      description: 'Pay securely with your credit or debit card',
    },
    {
      id: 'cod',
      name: 'Click & Collect',
      icon: 'storefront-outline',
      details: 'Pay when you collect',
      description: 'Collect from store and pay in cash',
    },
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method.id);
  };

  const handleApplyPromo = () => {
    const foundPromo = promoCodes.find(
      p => p.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (!foundPromo) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }

    if (subtotal < foundPromo.minOrder) {
      Alert.alert(
        'Minimum Order Not Met',
        `This promo code requires a minimum order of £${foundPromo.minOrder.toFixed(2)}.`
      );
      return;
    }

    setAppliedPromo(foundPromo);
    setPromoCode('');
    setShowPromoSuggestions(false);
    Alert.alert(
      'Promo Applied!',
      `You saved £${(subtotal * foundPromo.discount).toFixed(2)} with ${foundPromo.code}!`
    );
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handlePromoSuggestion = (promo) => {
    setPromoCode(promo.code);
    setShowPromoSuggestions(false);
  };

  const handlePlaceOrder = () => {
    // Clear cart and navigate to success page
    clearCart();
    router.push('/success');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
        <View style={styles.quantityPrice}>
          <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>
            £{((item.sellingPrice || item.price || 0) * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
        method.id === 'cod' && styles.codPaymentMethod
      ]}
      onPress={() => handlePaymentMethodSelect(method)}
    >
      <View style={styles.paymentMethodContent}>
        <View style={[
          styles.paymentMethodIcon,
          method.id === 'cod' && styles.codIcon
        ]}>
          <Ionicons
            name={method.icon}
            size={24}
            color={method.id === 'cod' ? theme.colors.status.success : theme.colors.text.primary}
          />
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodName}>{method.name}</Text>
          <Text style={styles.paymentMethodDetails}>{method.details}</Text>
          {method.description && (
            <Text style={styles.paymentMethodDescription}>{method.description}</Text>
          )}
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentMethod === method.id && styles.selectedRadioButton
      ]}>
        {selectedPaymentMethod === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Ionicons name="location" size={20} color={theme.colors.secondary.main} />
                <Text style={styles.addressType}>Home</Text>
              </View>
              <Text style={styles.addressText}>
                123 Main Street, Apartment 4B{'\n'}
                Dhaka, Bangladesh 1207
              </Text>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items ({totalItems})</Text>
            {items.map((item, index) => (
              <View key={item.id}>
                {renderCartItem({ item })}
              </View>
            ))}
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {paymentMethods.map(renderPaymentMethod)}
          </View>

          {/* Promo Code Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Promo Code</Text>
            {!appliedPromo ? (
              <View style={styles.promoContainer}>
                <View style={styles.promoInputContainer}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter promo code"
                    placeholderTextColor={theme.colors.text.placeholder}
                    value={promoCode}
                    onChangeText={setPromoCode}
                    autoCapitalize="characters"
                    onFocus={() => setShowPromoSuggestions(true)}
                  />
                  <TouchableOpacity
                    style={[
                      styles.applyButton,
                      !promoCode.trim() && styles.applyButtonDisabled
                    ]}
                    onPress={handleApplyPromo}
                    disabled={!promoCode.trim()}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {/* Promo Suggestions */}
                {showPromoSuggestions && getSuggestedPromos().length > 0 && (
                  <View style={styles.promoSuggestions}>
                    <Text style={styles.suggestionsTitle}>Suggested for you:</Text>
                    {getSuggestedPromos().map((promo) => (
                      <TouchableOpacity
                        key={promo.code}
                        style={styles.promoSuggestion}
                        onPress={() => handlePromoSuggestion(promo)}
                      >
                        <View style={styles.promoSuggestionContent}>
                          <Text style={styles.promoSuggestionCode}>{promo.code}</Text>
                          <Text style={styles.promoSuggestionDesc}>{promo.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.appliedPromoContainer}>
                <View style={styles.appliedPromoContent}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.status.success} />
                  <View style={styles.appliedPromoInfo}>
                    <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                    <Text style={styles.appliedPromoDesc}>{appliedPromo.description}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.removePromoButton} onPress={handleRemovePromo}>
                  <Ionicons name="close" size={16} color={theme.colors.status.error} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formattedPrice}</Text>
              </View>
              {appliedPromo && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount ({appliedPromo.code})</Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>-£{promoDiscount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>£{deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (20%)</Text>
                <Text style={styles.summaryValue}>£{vatAmount.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>£{totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
            <Text style={styles.placeOrderPrice}>£{totalAmount.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
    height: 40,
  },

  // Section Styles
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },

  // Address Styles
  addressCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addressType: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  addressText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.md,
  },
  changeButton: {
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.main,
  },

  // Cart Item Styles
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface.light,
  },
  itemDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  productUnit: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  quantityPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  // Payment Method Styles
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  selectedPaymentMethod: {
    borderColor: theme.colors.secondary.main,
    backgroundColor: theme.colors.primary[50],
  },
  codPaymentMethod: {
    borderColor: theme.colors.status.success,
  },
  paymentMethodIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codIcon: {
    backgroundColor: theme.colors.status.success + '20',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  paymentMethodDetails: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.secondary.main,
    marginBottom: theme.spacing.xs / 2,
  },
  paymentMethodDescription: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: theme.colors.primary.main,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.main,
  },

  // Summary Styles
  summaryCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  totalRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.main,
  },

  // Bottom Section Styles
  bottomSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
  },
  placeOrderButton: {
    backgroundColor: theme.colors.primary.main,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    height: 56,
  },
  placeOrderText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  placeOrderPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },

  // Promo Code Styles
  promoContainer: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  promoInput: {
    flex: 1,
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  applyButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  applyButtonDisabled: {
    backgroundColor: theme.colors.surface.border,
  },
  applyButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  promoSuggestions: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.divider,
    paddingTop: theme.spacing.md,
  },
  suggestionsTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  promoSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  promoSuggestionContent: {
    flex: 1,
  },
  promoSuggestionCode: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.secondary.main,
    marginBottom: theme.spacing.xs / 2,
  },
  promoSuggestionDesc: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  appliedPromoContainer: {
    backgroundColor: theme.colors.status.success + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.status.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliedPromoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedPromoInfo: {
    marginLeft: theme.spacing.sm,
  },
  appliedPromoCode: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.status.success,
    marginBottom: theme.spacing.xs / 2,
  },
  appliedPromoDesc: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  removePromoButton: {
    padding: theme.spacing.xs,
  },
  discountLabel: {
    color: theme.colors.status.success,
  },
  discountValue: {
    color: theme.colors.status.success,
    fontFamily: 'Outfit-SemiBold',
  },
});

export default Checkout;