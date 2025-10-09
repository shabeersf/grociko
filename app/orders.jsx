import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const ongoingOrders = [
    {
      id: 'ORD001',
      items: [
        { name: 'Organic Bananas', quantity: 2, price: 4.99, image: require('../assets/images/products/medium/01.png') },
        { name: 'Red Apple', quantity: 1, price: 4.99, image: require('../assets/images/products/medium/02.png') },
        { name: 'Bell Pepper Red', quantity: 1, price: 4.99, image: require('../assets/images/products/medium/03.png') },
      ],
      totalAmount: 15.97,
      subtotal: 14.97,
      deliveryFee: 2.00,
      vat: 0.00,
      paymentMethod: 'Credit Card (**** 4521)',
      orderTime: '10:30 AM',
      status: 'On the way',
      statusColor: theme.colors.status.warning,
      orderDate: '2024-01-15',
      estimatedDelivery: 'Today, 2:30 PM',
      trackingSteps: [
        { title: 'Order Placed', completed: true, time: '10:30 AM' },
        { title: 'Order Confirmed', completed: true, time: '10:45 AM' },
        { title: 'Order Packed', completed: true, time: '12:15 PM' },
        { title: 'Out for Delivery', completed: true, time: '1:30 PM' },
        { title: 'Delivered', completed: false, time: '2:30 PM (Est.)' },
      ],
    },
    {
      id: 'ORD002',
      items: [
        { name: 'Ginger', quantity: 1, price: 3.99, image: require('../assets/images/products/medium/04.png') },
        { name: 'Beef Bone', quantity: 1, price: 9.99, image: require('../assets/images/products/medium/07.png') },
      ],
      totalAmount: 15.98,
      subtotal: 13.98,
      deliveryFee: 2.00,
      vat: 0.00,
      paymentMethod: 'PayPal',
      orderTime: '9:15 AM',
      status: 'Processing',
      statusColor: theme.colors.status.info,
      orderDate: '2024-01-15',
      estimatedDelivery: 'Tomorrow, 11:00 AM',
      trackingSteps: [
        { title: 'Order Placed', completed: true, time: '9:15 AM' },
        { title: 'Order Confirmed', completed: true, time: '9:30 AM' },
        { title: 'Order Packed', completed: false, time: 'Processing...' },
        { title: 'Out for Delivery', completed: false, time: 'Pending' },
        { title: 'Delivered', completed: false, time: 'Pending' },
      ],
    },
  ];

  const completedOrders = [
    {
      id: 'ORD000',
      items: [
        { name: 'Broiler Chicken', quantity: 1, price: 6.99, image: require('../assets/images/products/medium/08.png') },
        { name: 'Organic Bananas', quantity: 1, price: 4.99, image: require('../assets/images/products/medium/01.png') },
      ],
      totalAmount: 13.98,
      subtotal: 11.98,
      deliveryFee: 2.00,
      vat: 0.00,
      paymentMethod: 'Debit Card (**** 1234)',
      orderTime: '2:15 PM',
      status: 'Delivered',
      statusColor: theme.colors.status.success,
      orderDate: '2024-01-10',
      deliveredDate: '2024-01-10',
      deliveryTime: '3:45 PM',
    },
    {
      id: 'ORD-001',
      items: [
        { name: 'Red Apple', quantity: 2, price: 4.99, image: require('../assets/images/products/medium/02.png') },
        { name: 'Bell Pepper Red', quantity: 1, price: 4.99, image: require('../assets/images/products/medium/03.png') },
      ],
      totalAmount: 16.97,
      subtotal: 14.97,
      deliveryFee: 2.00,
      vat: 0.00,
      paymentMethod: 'Cash on Delivery',
      orderTime: '4:20 PM',
      status: 'Delivered',
      statusColor: theme.colors.status.success,
      orderDate: '2024-01-08',
      deliveredDate: '2024-01-08',
      deliveryTime: '5:20 PM',
    },
  ];

  const getCurrentOrders = () => {
    return activeTab === 'ongoing' ? ongoingOrders : completedOrders;
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleReorder = (order) => {
    Alert.alert(
      'Add to Cart',
      `Add all ${order.items.length} items from this order to your cart?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add to Cart',
          onPress: () => {
            Alert.alert(
              'Items Added!',
              `${order.items.length} items have been added to your cart.`,
              [
                {
                  text: 'Continue Shopping',
                  style: 'default',
                },
                {
                  text: 'View Cart',
                  onPress: () => router.push('/(tabs)/cart'),
                },
              ]
            );
          },
        },
      ]
    );
  };


  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{item.orderDate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${item.statusColor}20` }]}>
          <Text style={[styles.statusText, { color: item.statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsContainer}>
        <View style={styles.itemsPreview}>
          {item.items.slice(0, 3).map((product, index) => (
            <View key={index} style={styles.itemPreview}>
              <Image source={product.image} style={styles.itemImage} resizeMode="contain" />
              <Text style={styles.itemQuantity}>{product.quantity}</Text>
            </View>
          ))}
          {item.items.length > 3 && (
            <View style={styles.moreItems}>
              <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.itemCount}>{item.items.length} items</Text>
          <Text style={styles.totalAmount}>£{item.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Order Status/Actions */}
      {activeTab === 'ongoing' ? (
        <View style={styles.ongoingActions}>
          <Text style={styles.estimatedDelivery}>
            Estimated delivery: {item.estimatedDelivery}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleOrderPress(item)}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.completedActions}>
          <Text style={styles.deliveredInfo}>
            Delivered on {item.deliveredDate} at {item.deliveryTime}
          </Text>
          <TouchableOpacity
            style={styles.reorderButton}
            onPress={() => handleReorder(item)}
          >
            <Ionicons name="refresh-outline" size={16} color={theme.colors.secondary.main} />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={activeTab === 'ongoing' ? 'time-outline' : 'checkmark-circle-outline'}
        size={64}
        color={theme.colors.text.tertiary}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'ongoing' ? 'No Ongoing Orders' : 'No Order History'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'ongoing'
          ? 'You have no orders in progress at the moment'
          : 'You haven\'t completed any orders yet'}
      </Text>
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
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
            onPress={() => setActiveTab('ongoing')}
          >
            <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
              Ongoing Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Order History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <FlatList
          data={getCurrentOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          style={styles.ordersList}
          contentContainerStyle={styles.ordersListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />

        {/* Order Details Modal */}
        <Modal
          visible={showOrderDetails}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaWrapper>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowOrderDetails(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  Order #{selectedOrder?.id}
                </Text>
                <View style={styles.placeholder} />
              </View>

              <ScrollView style={styles.modalContent}>
                {selectedOrder && (
                  <>
                    {/* Order Status */}
                    <View style={styles.orderStatusSection}>
                      <View style={[styles.statusBadge, { backgroundColor: `${selectedOrder.statusColor}20` }]}>
                        <Text style={[styles.statusText, { color: selectedOrder.statusColor }]}>
                          {selectedOrder.status}
                        </Text>
                      </View>
                      <Text style={styles.orderDateText}>
                        Ordered on {selectedOrder.orderDate} {selectedOrder.orderTime ? `at ${selectedOrder.orderTime}` : ''}
                      </Text>
                    </View>

                    {/* Items List */}
                    <View style={styles.itemsSection}>
                      <Text style={styles.sectionTitle}>Items Ordered</Text>
                      {selectedOrder.items.map((item, index) => (
                        <View key={index} style={styles.modalOrderItem}>
                          <Image
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.modalItemImage}
                            resizeMode="cover"
                          />
                          <View style={styles.modalItemDetails}>
                            <Text style={styles.modalItemName}>{item.name}</Text>
                            <Text style={styles.modalItemQuantity}>Quantity: {item.quantity}</Text>
                          </View>
                          <Text style={styles.modalItemPrice}>£{(item.price || 0).toFixed(2)}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Billing Details */}
                    <View style={styles.billingSection}>
                      <Text style={styles.sectionTitle}>Billing Details</Text>
                      <View style={styles.billingCard}>
                        <View style={styles.billingRow}>
                          <Text style={styles.billingLabel}>Subtotal</Text>
                          <Text style={styles.billingValue}>£{(selectedOrder.subtotal || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.billingRow}>
                          <Text style={styles.billingLabel}>Delivery Charge</Text>
                          <Text style={styles.billingValue}>£{(selectedOrder.deliveryFee || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.billingRow}>
                          <Text style={styles.billingLabel}>VAT (20%)</Text>
                          <Text style={styles.billingValue}>£{(selectedOrder.vat || 0).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.billingRow, styles.totalBillingRow]}>
                          <Text style={styles.billingTotalLabel}>Total Paid</Text>
                          <Text style={styles.billingTotalValue}>£{(selectedOrder.totalAmount || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.billingRow}>
                          <Text style={styles.billingLabel}>Payment Method</Text>
                          <Text style={styles.billingValue}>{selectedOrder.paymentMethod || 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.reorderModalButton}
                  onPress={() => {
                    setShowOrderDetails(false);
                    handleReorder(selectedOrder);
                  }}
                >
                  <Ionicons name="refresh-outline" size={20} color={theme.colors.text.white} />
                  <Text style={styles.reorderModalButtonText}>Reorder Items</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaWrapper>
        </Modal>
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
    backgroundColor: theme.colors.background.primary,
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

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.background.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.tertiary,
  },
  activeTabText: {
    color: theme.colors.text.primary,
  },

  // Orders List Styles
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['6xl'],
  },

  // Order Card Styles
  orderCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  orderDate: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
  },

  // Items Styles
  itemsContainer: {
    marginBottom: theme.spacing.lg,
  },
  itemsPreview: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  itemPreview: {
    marginRight: theme.spacing.sm,
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.borderRadius.sm,
  },
  itemQuantity: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.secondary.main,
    color: theme.colors.text.white,
    fontSize: 10,
    fontFamily: 'Outfit-Medium',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  moreItems: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  totalAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  // Actions Styles
  ongoingActions: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.divider,
    paddingTop: theme.spacing.lg,
  },

  // Progress Styles
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.surface.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDot: {
    backgroundColor: theme.colors.status.success,
  },
  currentDot: {
    backgroundColor: theme.colors.secondary.main,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.surface.border,
    marginHorizontal: theme.spacing.xs,
  },
  completedLine: {
    backgroundColor: theme.colors.status.success,
  },
  stageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    flex: 1,
    textAlign: 'center',
  },
  activeStageLabel: {
    color: theme.colors.text.primary,
    fontFamily: 'Outfit-SemiBold',
  },
  estimatedDelivery: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  detailsButton: {
    backgroundColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  detailsButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  detailsButtonSmall: {
    backgroundColor: theme.colors.surface.light,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  detailsButtonSmallText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },
  completedActions: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.divider,
    paddingTop: theme.spacing.lg,
  },
  completedInfo: {
    marginBottom: theme.spacing.sm,
  },
  completedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  deliveredInfo: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  paymentInfo: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.tertiary,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
    gap: theme.spacing.xs,
  },
  reorderButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.secondary.main,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing['3xl'],
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  orderStatusSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.divider,
    marginBottom: theme.spacing.xl,
  },
  orderDateText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  itemsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  modalOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  modalItemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface.light,
  },
  modalItemDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  modalItemName: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  modalItemQuantity: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  modalItemPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  billingSection: {
    marginBottom: theme.spacing.xl,
  },
  billingCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  billingLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  billingValue: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  totalBillingRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
    marginBottom: 0,
  },
  billingTotalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  billingTotalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.main,
  },
  modalActions: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
  },
  reorderModalButton: {
    backgroundColor: theme.colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  reorderModalButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
});

export default Orders;