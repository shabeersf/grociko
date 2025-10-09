import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MyDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Shabeer',
    lastName: 'Ahmed',
    email: 'shabeer@grociko.com',
    phone: '+880 1234567890',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
  });

  const [originalData, setOriginalData] = useState(formData);

  const handleEdit = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Save logic here
    setIsEditing(false);
    Alert.alert('Success', 'Your details have been updated successfully');
  };

  const handleImagePicker = () => {
    // Image picker logic would go here
    Alert.alert('Photo', 'Image picker functionality would be implemented here');
  };

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Details</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSave : handleEdit}
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'pencil'}
              size={20}
              color={theme.colors.secondary.main}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              {isEditing && (
                <TouchableOpacity
                  style={styles.imageEditButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="camera" size={16} color={theme.colors.text.white} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.profileName}>
              {formData.firstName} {formData.lastName}
            </Text>
            <Text style={styles.profileEmail}>{formData.email}</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* First Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="Enter your first name"
                placeholderTextColor={theme.colors.text.placeholder}
                editable={isEditing}
                selectTextOnFocus={isEditing}
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Enter your last name"
                placeholderTextColor={theme.colors.text.placeholder}
                editable={isEditing}
                selectTextOnFocus={isEditing}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Email Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
                selectTextOnFocus={isEditing}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.text.placeholder}
                keyboardType="phone-pad"
                editable={isEditing}
                selectTextOnFocus={isEditing}
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.text.placeholder}
                editable={isEditing}
                selectTextOnFocus={isEditing}
              />
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              {isEditing ? (
                <View style={styles.genderContainer}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderOption,
                        formData.gender === option && styles.selectedGenderOption,
                      ]}
                      onPress={() => setFormData({ ...formData, gender: option })}
                    >
                      <Text
                        style={[
                          styles.genderOptionText,
                          formData.gender === option && styles.selectedGenderOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={[styles.textInput, styles.disabledInput]}
                  value={formData.gender}
                  editable={false}
                />
              )}
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // Profile Section Styles
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.secondary.main,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.secondary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background.primary,
  },
  profileName: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },

  // Form Styles
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
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
  disabledInput: {
    backgroundColor: theme.colors.surface.light,
    color: theme.colors.text.secondary,
  },

  // Gender Styles
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  genderOption: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.light,
  },
  selectedGenderOption: {
    backgroundColor: theme.colors.secondary.main,
    borderColor: theme.colors.secondary.main,
  },
  genderOptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },
  selectedGenderOptionText: {
    color: theme.colors.text.white,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    paddingBottom: theme.spacing['6xl'],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.light,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
});

export default MyDetails;