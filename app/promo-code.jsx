import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { getOfferCodes2 } from "@/services/apiService";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PromoCode = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [expiredPromos, setExpiredPromos] = useState([]);

  // Load promo codes when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadPromoCodes();
    }, [])
  );

  const loadPromoCodes = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      // Fetch all active offer codes from API
      const response = await getOfferCodes2({ status: "active" });

      if (response.success) {
        const codes = response.data || [];
        
        // Separate into available and expired
        const available = codes.filter(code => !code.is_expired);
        const expired = codes.filter(code => code.is_expired);

        setAvailablePromos(available);
        setExpiredPromos(expired);
      } else {
        Alert.alert("Error", response.error || "Failed to load promo codes");
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
      Alert.alert("Error", "Failed to load promo codes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPromoCodes(false);
  };

  const handleCopyCode = (code) => {
    // In a real app, you'd use Clipboard.setString()
    Alert.alert("Code Copied!", `${code} copied to clipboard`, [
      { text: "OK" }
    ]);
  };

  const getExpiryStatus = (daysUntilExpiry) => {
    if (daysUntilExpiry === 0) {
      return { text: "Expires today", color: theme.colors.status.error };
    } else if (daysUntilExpiry <= 3) {
      return { text: `Expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`, color: theme.colors.status.warning };
    } else if (daysUntilExpiry <= 7) {
      return { text: `${daysUntilExpiry} days left`, color: theme.colors.primary.main };
    } else {
      return { text: `Valid until ${daysUntilExpiry} days`, color: theme.colors.status.success };
    }
  };

  const renderPromoItem = ({ item }) => {
    const isExpired = item.is_expired;
    const expiryStatus = !isExpired ? getExpiryStatus(item.days_until_expiry) : null;

    return (
      <View style={[styles.promoCard, isExpired && styles.expiredCard]}>
        {/* Promo Image (if available) */}
        {item.image_url && (
          <View style={styles.promoImageContainer}>
            <Image
              source={{ uri: item.image_url }}
              style={styles.promoImage}
              resizeMode="cover"
            />
            {isExpired && (
              <View style={styles.expiredImageOverlay}>
                <Text style={styles.expiredImageText}>EXPIRED</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.promoContent}>
          {/* Promo Header */}
          <View style={styles.promoHeader}>
            <View style={styles.promoTitleContainer}>
              <View style={styles.codeContainer}>
                <Ionicons
                  name="pricetag"
                  size={20}
                  color={isExpired ? theme.colors.text.tertiary : theme.colors.primary.main}
                />
                <Text style={[styles.promoCode, isExpired && styles.expiredText]}>
                  {item.offer_code}
                </Text>
              </View>
              
              {!isExpired && (
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => handleCopyCode(item.offer_code)}
                >
                  <Ionicons name="copy-outline" size={16} color={theme.colors.primary.main} />
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[
              styles.discountBadge,
              isExpired && styles.expiredBadge,
            ]}>
              <Text style={[
                styles.discountText,
                isExpired && styles.expiredDiscountText,
              ]}>
                {item.discount_text}
              </Text>
            </View>
          </View>

          {/* Description */}
          {item.description && (
            <Text style={[
              styles.promoDescription,
              isExpired && styles.expiredText,
            ]}>
              {item.description}
            </Text>
          )}

          {/* Promo Details */}
          <View style={styles.promoDetails}>
            <View style={styles.detailItem}>
              <Ionicons
                name="cart-outline"
                size={16}
                color={isExpired ? theme.colors.text.tertiary : theme.colors.text.secondary}
              />
              <Text style={[styles.detailText, isExpired && styles.expiredText]}>
                Min. order: £{item.minimum_order}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={isExpired ? theme.colors.text.tertiary : theme.colors.text.secondary}
              />
              <Text style={[
                styles.detailText,
                isExpired && styles.expiredText,
              ]}>
                {item.formatted_expiry}
              </Text>
            </View>
          </View>

          {/* Expiry Status Badge */}
          {!isExpired && expiryStatus && (
            <View style={[styles.expiryBadge, { backgroundColor: expiryStatus.color + '20' }]}>
              <Ionicons name="time-outline" size={14} color={expiryStatus.color} />
              <Text style={[styles.expiryText, { color: expiryStatus.color }]}>
                {expiryStatus.text}
              </Text>
            </View>
          )}

          {/* Expired Overlay */}
          {isExpired && (
            <View style={styles.expiredBanner}>
              <Ionicons name="close-circle" size={16} color={theme.colors.text.white} />
              <Text style={styles.expiredBannerText}>EXPIRED</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="pricetag-outline" size={80} color={theme.colors.text.tertiary} />
      <Text style={styles.emptyStateTitle}>No Promo Codes Available</Text>
      <Text style={styles.emptyStateText}>
        Check back later for exciting offers!
      </Text>
    </View>
  );

  const renderSectionHeader = (title, count) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Promo Codes</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading promo codes...</Text>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Promo Codes</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Ionicons
              name="refresh"
              size={24}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        {availablePromos.length > 0 && (
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary.main} />
            <Text style={styles.infoBannerText}>
              Apply these codes at checkout to save on your order
            </Text>
          </View>
        )}

        {/* Promo Codes List */}
        <FlatList
          data={[...availablePromos, ...expiredPromos]}
          renderItem={renderPromoItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            availablePromos.length === 0 && expiredPromos.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            availablePromos.length > 0 ? renderSectionHeader("Available Offers", availablePromos.length) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
            />
          }
        />

        {/* Expired Section */}
        {expiredPromos.length > 0 && availablePromos.length > 0 && (
          <View style={styles.expiredSection}>
            {renderSectionHeader("Expired Offers", expiredPromos.length)}
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },

  // Info Banner
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary[50],
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.primary.main,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },
  countBadge: {
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },

  // List Styles
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing["6xl"],
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // Promo Card Styles
  promoCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: "hidden",
  },
  expiredCard: {
    opacity: 0.7,
  },
  promoImageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  promoImage: {
    width: "100%",
    height: "100%",
  },
  expiredImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  expiredImageText: {
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.white,
    letterSpacing: 2,
  },
  promoContent: {
    padding: theme.spacing.lg,
  },
  promoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  promoTitleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  promoCode: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
    letterSpacing: 1,
  },
  expiredText: {
    color: theme.colors.text.tertiary,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs / 2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    borderStyle: "dashed",
    marginTop: theme.spacing.xs / 2,
  },
  copyButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.primary.main,
  },
  discountBadge: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  expiredBadge: {
    backgroundColor: theme.colors.text.tertiary,
  },
  discountText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.white,
  },
  expiredDiscountText: {
    color: theme.colors.text.white,
  },
  promoDescription: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
  },
  promoDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },
  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs / 2,
  },
  expiryText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: "Outfit-SemiBold",
  },
  expiredBanner: {
    position: "absolute",
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.status.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs / 2,
  },
  expiredBannerText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.white,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing["6xl"],
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    textAlign: "center",
  },

  // Expired Section
  expiredSection: {
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.divider,
  },
});

export default PromoCode;