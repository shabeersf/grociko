import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  getUserData,
  lookupPostcode,
  setDefaultAddress,
  updateUserAddress,
} from "@/services/apiService";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
} from "react-native";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [postcodeInput, setPostcodeInput] = useState("");
  const [foundAddresses, setFoundAddresses] = useState([]);
  const [selectedFoundAddress, setSelectedFoundAddress] = useState(null);
  const [formData, setFormData] = useState({
    line_1: "",
    line_2: "",
    line_3: "",
    post_town: "",
    city: "",
    pincode: "",
    county: "",
    district: "",
    ward: "",
    dependant_locality: "",
    landmark: "",
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

      const user = await getUserData();
      if (!user) {
        router.replace("/signin");
        return;
      }
      setUserData(user);

      const response = await getUserAddresses(user.id);

      if (response.success) {
        setAddresses(response.data);
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      Alert.alert("Error", "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setPostcodeInput("");
    setFoundAddresses([]);
    setSelectedFoundAddress(null);
    setFormData({
      line_1: "",
      line_2: "",
      line_3: "",
      post_town: "",
      city: "",
      pincode: "",
      county: "",
      district: "",
      ward: "",
      dependant_locality: "",
      landmark: "",
    });
    setModalVisible(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setPostcodeInput(address.pincode || "");
    setFoundAddresses([]);
    setSelectedFoundAddress(null);
    setFormData({
      line_1: address.line_1 || address.address1 || "",
      line_2: address.line_2 || address.address2 || "",
      line_3: address.line_3 || address.address3 || "",
      post_town: address.post_town || "",
      city: address.city || "",
      pincode: address.pincode || "",
      county: address.county || "",
      district: address.district || "",
      ward: address.ward || "",
      landmark: address.landmark || "",
    });
    setModalVisible(true);
  };

  const handlePostcodeLookup = async () => {
    if (!postcodeInput.trim()) {
      Alert.alert("Error", "Please enter a postcode");
      return;
    }

    // Add format validation
    const postcodePattern = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    if (!postcodePattern.test(postcodeInput.trim())) {
      Alert.alert(
        "Invalid Format",
        "Please enter a valid UK postcode format (e.g., SW1A 1AA, M1 1AE, B33 8TH)"
      );
      return;
    }

    try {
      setLookingUp(true);
      const response = await lookupPostcode(postcodeInput);

      if (response.success && response.data.length > 0) {
        setFoundAddresses(response.data);
        setAddressListModalVisible(true);
      } else {
        Alert.alert("Not Found", "No addresses found for this postcode");
        setFoundAddresses([]);
      }
    } catch (error) {
      console.error("Postcode lookup error:", error);
      Alert.alert("Error", "Failed to lookup postcode. Please try again.");
    } finally {
      setLookingUp(false);
    }
  };

  const handleSelectFoundAddress = (address) => {
    setSelectedFoundAddress(address);

    // Auto-fill form with selected address
    setFormData({
      line_1: address.line_1 || "",
      line_2: address.line_2 || "",
      line_3: address.line_3 || "",
      post_town: address.post_town || "",
      city: address.post_town || address.city || "",
      pincode: address.postcode || postcodeInput,
      county: address.county || "",
      district: address.district || "",
      ward: address.ward || "",
      landmark: formData.landmark || "",
    });

    setAddressListModalVisible(false);
    Alert.alert(
      "Success",
      "Address loaded! You can now edit or add additional details."
    );
  };

  const handleSave = async () => {
    // Validation
    if (
      !formData.line_1 ||
      !formData.city ||
      !formData.pincode ||
      !formData.landmark
    ) {
      Alert.alert(
        "Error",
        "Please fill all required fields (Address Line 1, City, Postcode, Landmark)"
      );
      return;
    }

    // UK Postcode validation (basic pattern)
    const postcodePattern = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    if (!postcodePattern.test(formData.pincode)) {
      Alert.alert("Error", "Please enter a valid UK postcode");
      return;
    }

    try {
      setSaving(true);

      const addressData = {
        user_id: userData.id,

        post_town: formData.post_town,
        city: formData.post_town || formData.city,
        pincode: formData.pincode.toUpperCase().replace(/\s/g, ""), // Normalize postcode
        landmark: formData.landmark,

        address1: formData.line_1,
        address2: formData.line_2,
        address3: formData.line_3,
      };

      let response;
      if (editingAddress) {
        addressData.id = editingAddress.id;
        response = await updateUserAddress(addressData);
      } else {
        response = await createUserAddress(addressData);
      }

      if (response.success) {
        Alert.alert(
          "Success",
          response.message || "Address saved successfully",
          [
            {
              text: "OK",
              onPress: () => {
                setModalVisible(false);
                resetForm();
                loadUserAddresses();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", response.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setPostcodeInput("");
    setFoundAddresses([]);
    setSelectedFoundAddress(null);
    setFormData({
      line_1: "",
      line_2: "",
      line_3: "",
      post_town: "",
      city: "",
      pincode: "",
      county: "",
      district: "",
      ward: "",
      landmark: "",
    });
    setEditingAddress(null);
  };

  const handleDelete = (address) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await deleteUserAddress(address.id, userData.id);

              if (response.success) {
                Alert.alert("Success", "Address deleted successfully", [
                  { text: "OK", onPress: () => loadUserAddresses() },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  response.error || "Failed to delete address"
                );
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete address");
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
        setAddresses((prevAddresses) =>
          prevAddresses.map((addr) => ({
            ...addr,
            is_default: addr.id === address.id ? "yes" : "no",
          }))
        );
        Alert.alert("Success", "Default address updated");
      } else {
        Alert.alert("Error", response.error || "Failed to set default address");
      }
    } catch (error) {
      console.error("Set default error:", error);
      Alert.alert("Error", "Failed to set default address");
    }
  };

  const formatAddressDisplay = (address) => {
    const parts = [];

    if (address.line_1 || address.address1)
      parts.push(address.line_1 || address.address1);
    if (address.line_2 || address.address2)
      parts.push(address.line_2 || address.address2);
    if (address.line_3 || address.address3)
      parts.push(address.line_3 || address.address3);

    return parts.filter(Boolean);
  };

  const renderAddressItem = ({ item }) => {
    const addressLines = formatAddressDisplay(item);

    return (
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <View style={styles.addressTitleContainer}>
            <Text style={styles.addressTitle}>
              {item.address_label || "Delivery Address"}
            </Text>
            {item.is_default === "yes" && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
            {item.address_type && (
              <View
                style={[
                  styles.typeBadge,
                  styles[`typeBadge${item.address_type}`],
                ]}
              >
                <Ionicons
                  name={
                    item.address_type === "home"
                      ? "home"
                      : item.address_type === "work"
                      ? "briefcase"
                      : "location"
                  }
                  size={12}
                  color={theme.colors.text.white}
                />
              </View>
            )}
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(item)}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.status.error}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressContent}>
          <View style={styles.addressRow}>
            <Ionicons
              name="location"
              size={20}
              color={theme.colors.secondary.main}
            />
            <View style={styles.addressTextContainer}>
              {addressLines.map((line, index) => (
                <Text key={index} style={styles.addressText}>
                  {line}
                </Text>
              ))}
              <Text style={styles.addressLocation}>
                {item.city || item.post_town}, {item.pincode}
              </Text>
              {item.county && (
                <Text style={styles.addressCounty}>{item.county}</Text>
              )}
              {item.landmark && (
                <Text style={styles.addressLandmark}>
                  Landmark: {item.landmark}
                </Text>
              )}
              {item.delivery_instructions && (
                <View style={styles.instructionsContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color={theme.colors.primary.main}
                  />
                  <Text style={styles.instructionsText}>
                    {item.delivery_instructions}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {item.is_default !== "yes" && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(item)}
          >
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFoundAddressItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.foundAddressItem}
      onPress={() => handleSelectFoundAddress(item)}
    >
      <View style={styles.foundAddressContent}>
        <Ionicons
          name="location-outline"
          size={20}
          color={theme.colors.secondary.main}
        />
        <View style={styles.foundAddressText}>
          {item.line_2 && (
            <Text style={styles.foundAddressLine}>{item.line_2}</Text>
          )}
          <Text style={styles.foundAddressLocation}>
            {item.post_town}, {item.postcode}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="location-outline"
        size={80}
        color={theme.colors.text.tertiary}
      />
      <Text style={styles.emptyStateTitle}>No Addresses Yet</Text>
      <Text style={styles.emptyStateText}>
        Add your delivery address to get started
      </Text>
    </View>
  );

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
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
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
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => !saving && setModalVisible(false)}
                    disabled={saving}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Postcode Lookup Section */}
                <View style={styles.postcodeSection}>
                  <Text style={styles.sectionTitle}>Find Your Address</Text>
                  <Text style={styles.sectionSubtitle}>
                    Enter your postcode to find your address
                  </Text>

                  <View style={styles.postcodeInputContainer}>
                    <TextInput
                      style={styles.postcodeInput}
                      value={postcodeInput}
                      onChangeText={setPostcodeInput}
                      placeholder="Enter UK Postcode (e.g., SW1A 1AA)"
                      placeholderTextColor={theme.colors.text.placeholder}
                      autoCapitalize="characters"
                      maxLength={8}
                      editable={!lookingUp && !saving}
                    />
                    <TouchableOpacity
                      style={[
                        styles.lookupButton,
                        lookingUp && styles.lookupButtonDisabled,
                      ]}
                      onPress={handlePostcodeLookup}
                      disabled={lookingUp || saving}
                    >
                      {lookingUp ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.text.white}
                        />
                      ) : (
                        <>
                          <Ionicons
                            name="search"
                            size={18}
                            color={theme.colors.text.white}
                          />
                          <Text style={styles.lookupButtonText}>Find</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  {selectedFoundAddress && (
                    <View style={styles.selectedAddressNotice}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.colors.status.success}
                      />
                      <Text style={styles.selectedAddressText}>
                        Address loaded! Edit details below if needed.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <Text style={styles.formSectionTitle}>Address Details</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Address Line 1 <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.line_1}
                      onChangeText={(text) =>
                        setFormData({ ...formData, line_1: text })
                      }
                      placeholder="Address Line 1"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Address Line 2 <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.line_2}
                      onChangeText={(text) =>
                        setFormData({ ...formData, line_2: text })
                      }
                      placeholder="Address Line 2"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Address Line 3 <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.line_3}
                      onChangeText={(text) =>
                        setFormData({ ...formData, line_3: text })
                      }
                      placeholder="Address Line 3"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>
                        City/Town <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.city}
                        onChangeText={(text) =>
                          setFormData({ ...formData, city: text })
                        }
                        placeholder="City"
                        placeholderTextColor={theme.colors.text.placeholder}
                        editable={!saving}
                      />
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>
                        Postcode <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.pincode}
                        onChangeText={(text) =>
                          setFormData({
                            ...formData,
                            pincode: text.toUpperCase(),
                          })
                        }
                        placeholder="SW1A 1AA"
                        placeholderTextColor={theme.colors.text.placeholder}
                        autoCapitalize="characters"
                        maxLength={8}
                        editable={!saving}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Landmark <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.landmark}
                      onChangeText={(text) =>
                        setFormData({ ...formData, landmark: text })
                      }
                      placeholder="Nearby landmark"
                      placeholderTextColor={theme.colors.text.placeholder}
                      editable={!saving}
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    saving && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.text.white}
                    />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {editingAddress ? "Update Address" : "Save Address"}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Address List Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addressListModalVisible}
          onRequestClose={() => setAddressListModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.addressListModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Address</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setAddressListModalVisible(false)}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.addressListSubtitle}>
                Found {foundAddresses.length} address
                {foundAddresses.length !== 1 ? "es" : ""} for {postcodeInput}
              </Text>

              <FlatList
                data={foundAddresses}
                renderItem={renderFoundAddressItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.foundAddressList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaWrapper>
  );
};

// Styles continue in next part due to length...
// Styles for Address Management Component
// Add this to the end of your address-management.jsx file

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
    backgroundColor: theme.colors.background.primary,
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
    backgroundColor: theme.colors.background.primary,
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

  // Address List Styles
  addressList: {
    flex: 1,
  },
  addressListContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing["8xl"],
  },
  addressListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  addressTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
  },
  addressTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },
  defaultBadge: {
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  defaultText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.white,
  },
  typeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadgehome: {
    backgroundColor: theme.colors.primary.main,
  },
  typeBadgework: {
    backgroundColor: theme.colors.secondary.main,
  },
  typeBadgeother: {
    backgroundColor: theme.colors.text.tertiary,
  },
  addressActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },
  addressContent: {
    marginBottom: theme.spacing.sm,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  addressText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    marginBottom: 2,
  },
  addressLocation: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  addressCounty: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
  addressLandmark: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  instructionsText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.primary.main,
  },
  setDefaultButton: {
    alignSelf: "flex-start",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
    marginTop: theme.spacing.sm,
  },
  setDefaultText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.secondary.main,
  },

  // Empty State Styles
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

  // Add Button Styles
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary.main,
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius["2xl"],
    borderTopRightRadius: theme.borderRadius["2xl"],
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    maxHeight: "95%",
  },
  addressListModalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius["2xl"],
    borderTopRightRadius: theme.borderRadius["2xl"],
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing["4xl"],
    maxHeight: "80%",
    height: "80%", // ADD THIS - gives the modal a defined height
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },

  // Postcode Section Styles
  postcodeSection: {
    backgroundColor: theme.colors.secondary[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  postcodeInputContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  postcodeInput: {
    flex: 1,
    backgroundColor: theme.colors.surface.white,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  lookupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
    minWidth: 80,
  },
  lookupButtonDisabled: {
    opacity: 0.6,
  },
  lookupButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },
  selectedAddressNotice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.status.success + "20",
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.sm,
  },
  selectedAddressText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.status.success,
  },

  // Found Address List Styles
  addressListSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  foundAddressList: {
    flexGrow: 1, // CHANGE from flex: 1 - allows proper scrolling
  },
  foundAddressItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  foundAddressContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: theme.spacing.sm,
  },
  foundAddressText: {
    flex: 1,
  },
  foundAddressLine: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  foundAddressLocation: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },

  // Form Styles
  formContainer: {
    gap: theme.spacing.lg,
  },
  formSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputGroup: {
    gap: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.primary,
  },
  required: {
    color: theme.colors.status.error,
  },
  textInput: {
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },

  // Address Type Selector
  typeSelector: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.light,
    gap: theme.spacing.xs,
  },
  typeOptionSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  typeOptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
  },
  typeOptionTextSelected: {
    color: theme.colors.text.white,
  },

  // Save Button
  saveButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },
});

export default AddressManagement;
