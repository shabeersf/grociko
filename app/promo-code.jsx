import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PromoCode = () => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromos, setAppliedPromos] = useState([
    {
      id: '1',
      code: 'WELCOME20',
      discount: '20% off',
      description: 'Welcome discount on your first order',
      minOrder: 25,
      expiryDate: '2024-02-15',
      status: 'active',
    },
    {
      id: '2',
      code: 'FRESH15',
      discount: '$15 off',
      description: 'Fresh produce discount',
      minOrder: 50,
      expiryDate: '2024-02-10',
      status: 'expired',
    },
  ]);

  const [availablePromos] = useState([
    {
      id: '3',
      code: 'SAVE25',
      discount: '25% off',
      description: 'Save big on groceries',
      minOrder: 75,
      expiryDate: '2024-03-01',
      status: 'available',
    },
    {
      id: '4',
      code: 'DELIVERY5',
      discount: '$5 off delivery',
      description: 'Free delivery on orders over $30',
      minOrder: 30,
      expiryDate: '2024-02-20',
      status: 'available',
    },
    {
      id: '5',
      code: 'WEEKEND30',
      discount: '30% off',
      description: 'Weekend special discount',
      minOrder: 40,
      expiryDate: '2024-01-28',
      status: 'available',
    },
  ]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    // Check if code exists in available promos
    const foundPromo = availablePromos.find(
      promo => promo.code.toLowerCase() === promoCode.trim().toLowerCase()
    );

    if (foundPromo) {
      // Check if already applied
      const alreadyApplied = appliedPromos.find(
        promo => promo.code.toLowerCase() === promoCode.trim().toLowerCase()
      );

      if (alreadyApplied) {
        Alert.alert('Already Applied', 'This promo code is already in your account');
        return;
      }

      // Add to applied promos
      setAppliedPromos([...appliedPromos, { ...foundPromo, status: 'active' }]);
      setPromoCode('');
      Alert.alert('Success', `Promo code ${foundPromo.code} added successfully!`);
    } else {
      Alert.alert('Invalid Code', 'The promo code you entered is not valid or has expired');
    }
  };

  const handleRemovePromo = (id) => {
    Alert.alert(
      'Remove Promo Code',
      'Are you sure you want to remove this promo code?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setAppliedPromos(appliedPromos.filter(promo => promo.id !== id));
          },
        },
      ]
    );
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPromoItem = ({ item, section }) => (
    <View style={[
      styles.promoCard,
      item.status === 'expired' && styles.expiredCard
    ]}>
      <View style={styles.promoContent}>
        {/* Promo Info */}
        <View style={styles.promoInfo}>
          <View style={styles.promoHeader}>
            <Text style={[
              styles.promoCode,
              item.status === 'expired' && styles.expiredText
            ]}>
              {item.code}
            </Text>
            <View style={[
              styles.discountBadge,
              item.status === 'expired' && styles.expiredBadge
            ]}>
              <Text style={[
                styles.discountText,
                item.status === 'expired' && styles.expiredDiscountText
              ]}>
                {item.discount}
              </Text>
            </View>
          </View>

          <Text style={[
            styles.promoDescription,
            item.status === 'expired' && styles.expiredText
          ]}>
            {item.description}
          </Text>

          <View style={styles.promoDetails}>
            <Text style={[
              styles.minOrder,
              item.status === 'expired' && styles.expiredText
            ]}>
              Min. order: ${item.minOrder}
            </Text>
            <Text style={[
              styles.expiryDate,
              item.status === 'expired' && styles.expiredText,
              isExpired(item.expiryDate) && styles.expiredDateText
            ]}>
              Expires: {formatExpiryDate(item.expiryDate)}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {section === 'applied' && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemovePromo(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.status.error} />
          </TouchableOpacity>
        )}

        {item.status === 'expired' && (
          <View style={styles.expiredOverlay}>
            <Text style={styles.expiredLabel}>EXPIRED</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Promo Code</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Add Promo Code Section */}
        <View style={styles.addPromoSection}>
          <Text style={styles.sectionTitle}>Add Promo Code</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.promoInput}
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Enter promo code"
              placeholderTextColor={theme.colors.text.placeholder}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyPromo}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Applied Promo Codes */}
        {appliedPromos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Promo Codes</Text>
            <FlatList
              data={appliedPromos}
              renderItem={({ item }) => renderPromoItem({ item, section: 'applied' })}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Available Promo Codes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Offers</Text>
          <FlatList
            data={availablePromos}
            renderItem={({ item }) => renderPromoItem({ item, section: 'available' })}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
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
    paddingVertical: theme.spacing.lg,
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },

  // Add Promo Section
  addPromoSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  applyButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },

  // Section Styles
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    paddingBottom: theme.spacing['6xl'],
  },

  // Promo Card Styles
  promoCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  expiredCard: {
    opacity: 0.6,
  },
  promoContent: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  promoInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  promoCode: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    letterSpacing: 1,
  },
  expiredText: {
    color: theme.colors.text.tertiary,
  },
  discountBadge: {
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  expiredBadge: {
    backgroundColor: theme.colors.text.tertiary,
  },
  discountText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  expiredDiscountText: {
    color: theme.colors.text.white,
  },
  promoDescription: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
  },
  promoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minOrder: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  expiryDate: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  expiredDateText: {
    color: theme.colors.status.error,
  },

  // Remove Button
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: `${theme.colors.status.error}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Expired Overlay
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.status.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  expiredLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.white,
  },
});

export default PromoCode;