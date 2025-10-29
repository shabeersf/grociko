import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  getUserData,
  setDefaultAddress,
  updateUserAddress,
} from '@/services/apiService';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    address1: '',
    address2: '',
    address3: '',
    city: '',
    pincode: '',
    landmark: '',
  });

  // Load addresses when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadUserAddresses();
    }, [])
  );

  const loadUserAddresses = async () => {
    try {
      setLoading(true);
      
      // Get user data
      const user = await getUserData();
      if (!user) {
        router.replace('/signin');
        return;
      }
      setUserData(user);

      // Fetch addresses
      const response = await getUserAddresses(user.id);
      
      if (response.success) {
        setAddresses(response.data);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      address1: '',
      address2: '',
      address3: '',
      city: '',
      pincode: '',
      landmark: '',
    });
    setModalVisible(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      address1: address.address1 || '',
      address2: address.address2 || '',
      address3: address.address3 || '',
      city: address.city || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.address1 || !formData.city || !formData.pincode) {
      Alert.alert('Error', 'Please fill all required fields (Address Line 1, City, Pincode)');
      return;
    }

    // Pincode validation (6 digits)
    if (!/^\d{6}$/.test(formData.pincode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return;
    }

    try {
      setSaving(true);

      const addressData = {
        user_id: userData.id,
        ...formData,
      };

      let response;
      if (editingAddress) {
        // Update existing address
        addressData.id = editingAddress.id;
        response = await updateUserAddress(addressData);
      } else {
        // Create new address
        response = await createUserAddress(addressData);
      }

      if (response.success) {
        Alert.alert('Success', response.message || 'Address saved successfully', [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              setFormData({
                address1: '',
                address2: '',
                address3: '',
                city: '',
                pincode: '',
                landmark: '',
              });
              setEditingAddress(null);
              loadUserAddresses();
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteUserAddress(address.id, userData.id);
              
              if (response.success) {
                Alert.alert('Success', 'Address deleted successfully', [
                  { text: 'OK', onPress: () => loadUserAddresses() },
                ]);
              } else {
                Alert.alert('Error', response.error || 'Failed to delete address');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (address) => {
    try {
      const response = await setDefaultAddress(address.id, userData.id);
      
      if (response.success) {
        // Update local state immediately for better UX
        setAddresses(prevAddresses =>
          prevAddresses.map(addr => ({
            ...addr,
            is_default: addr.id === address.id ? 'yes' : 'no',
          }))
        );
        Alert.alert('Success', 'Default address updated');
      } else {
        Alert.alert('Error', response.error || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Set default error:', error);
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleContainer}>
          <Text style={styles.addressTitle}>Delivery Address</Text>
          {item.is_default === 'yes' && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil-outline" size={18} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressContent}>
        <View style={styles.addressRow}>
          <Ionicons name="location" size={20} color={theme.colors.secondary.main} />
          <View style={styles.addressTextContainer}>
            {item.address1 && <Text style={styles.addressText}>{item.address1}</Text>}
            {item.address2 && <Text style={styles.addressText}>{item.address2}</Text>}
            {item.address3 && <Text style={styles.addressText}>{item.address3}</Text>}
            <Text style={styles.addressLocation}>
              {item.city}, {item.pincode}
            </Text>
            {item.landmark && (
              <Text style={styles.addressLandmark}>Landmark: {item.landmark}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Set as Default Button */}
      {item.is_default !== 'yes' && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(item)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="location-outline" size={80} color={theme.colors.text.tertiary} />
      <Text style={styles.emptyStateTitle}>No Addresses Yet</Text>
      <Text style={styles.emptyStateText}>
        Add your delivery address to get started
      </Text>
    </View>
  );

  // Show loading indicator
  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading addresses...</Text>
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
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Address</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Address List */}
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.addressList}
          contentContainerStyle={[
            styles.addressListContent,
            addresses.length === 0 && styles.addressListEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />

        {/* Add New Address Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color={theme.colors.text.white} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        {/* Add/Edit Address Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => !saving && setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => !saving && setModalVisible(false)}
                    disabled={saving}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>

               {/* Form Fields */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Address Line 1 <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.address1}
                      onChangeText={(text) => setFormData({ ...formData, address1: text })}
                      placeholder="House/Flat no., Building name"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Address Line 2</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.address2}
                      onChangeText={(text) => setFormData({ ...formData, address2: text })}
                      placeholder="Street name, Area"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Address Line 3</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.address3}
                      onChangeText={(text) => setFormData({ ...formData, address3: text })}
                      placeholder="Additional details"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>
                        City <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.city}
                        onChangeText={(text) => setFormData({ ...formData, city: text })}
                        placeholder="City"
                        placeholderTextColor={theme.colors.text.placeholder}
                        editable={!saving}
                      />
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>
                        Pincode <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.pincode}
                        onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                        placeholder="123456"
                        placeholderTextColor={theme.colors.text.placeholder}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!saving}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Landmark</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.landmark}
                      onChangeText={(text) => setFormData({ ...formData, landmark: text })}
                      placeholder="Nearby landmark"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={theme.colors.text.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
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

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
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

  // Address List Styles
  addressList: {
    flex: 1,
  },
  addressListContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['8xl'],
  },
  addressListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  addressCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  defaultBadge: {
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  defaultText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.white,
  },
  addressActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContent: {
    marginBottom: theme.spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  addressText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    marginBottom: 2,
  },
  addressLocation: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  addressLandmark: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
    marginTop: theme.spacing.sm,
  },
  setDefaultText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.secondary.main,
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Add Button Styles
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.main,
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius['2xl'],
    borderTopRightRadius: theme.borderRadius['2xl'],
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Form Styles
  formContainer: {
    gap: theme.spacing.lg,
  },
  inputGroup: {
    gap: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },
  required: {
    color: theme.colors.status.error,
  },
  textInput: {
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
  rowInputs: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
});

export default AddressManagement;