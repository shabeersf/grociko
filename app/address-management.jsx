import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
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
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      address: '123 Main Street, Apartment 4B',
      city: 'Dhaka',
      area: 'Banasree',
      phone: '+880 1234567890',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      address: '456 Business District',
      city: 'Dhaka',
      area: 'Gulshan',
      phone: '+880 1987654321',
      isDefault: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    area: '',
    phone: '',
  });

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({ name: '', address: '', city: '', area: '', phone: '' });
    setModalVisible(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      area: address.area,
      phone: address.phone,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.area || !formData.phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, ...formData }
          : addr
      ));
    } else {
      // Add new address
      const newAddress = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
    }

    setModalVisible(false);
    setFormData({ name: '', address: '', city: '', area: '', phone: '' });
    setEditingAddress(null);
  };

  const handleDelete = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

            // If deleted address was default and there are other addresses, make the first one default
            if (addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
              updatedAddresses[0].isDefault = true;
            }

            setAddresses(updatedAddresses);
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    })));
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressNameContainer}>
          <Text style={styles.addressName}>{item.name}</Text>
          {item.isDefault && (
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
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressLocation}>{item.area}, {item.city}</Text>
      <Text style={styles.addressPhone}>{item.phone}</Text>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(item.id)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
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
          <Text style={styles.headerTitle}>Delivery Address</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Address List */}
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          style={styles.addressList}
          contentContainerStyle={styles.addressListContent}
          showsVerticalScrollIndicator={false}
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
          onRequestClose={() => setModalVisible(false)}
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
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Address Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholder="e.g., Home, Office"
                      placeholderTextColor={theme.colors.text.placeholder}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Address</Text>
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      value={formData.address}
                      onChangeText={(text) => setFormData({ ...formData, address: text })}
                      placeholder="House/Flat no., Street name"
                      placeholderTextColor={theme.colors.text.placeholder}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.city}
                        onChangeText={(text) => setFormData({ ...formData, city: text })}
                        placeholder="City"
                        placeholderTextColor={theme.colors.text.placeholder}
                      />
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>Area</Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.area}
                        onChangeText={(text) => setFormData({ ...formData, area: text })}
                        placeholder="Area"
                        placeholderTextColor={theme.colors.text.placeholder}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.phone}
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      placeholder="+880 1234567890"
                      placeholderTextColor={theme.colors.text.placeholder}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Text>
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  addressNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressName: {
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
  addressText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
  },
  addressLocation: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  addressPhone: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
  },
  setDefaultText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.secondary.main,
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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
  saveButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
});

export default AddressManagement;