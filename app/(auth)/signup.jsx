import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    // Reset errors
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    // Phone validation
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      hasError = true;
    } else if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number');
      hasError = true;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    // Terms agreement
    if (!agreeToTerms) {
      Alert.alert('Terms & Conditions', 'Please agree to Terms & Conditions to continue');
      return;
    }

    if (hasError) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Account Created Successfully!',
        'Welcome to Grociko! Your account has been created.',
        [
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)/home'),
          },
        ]
      );
    }, 2000);
  };

  const formatPhoneNumber = (text) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');

    // Format as needed (this is a simple example)
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    }
  };

  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background.primary}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.carrotContainer}>
                <View style={styles.carrotLeaves}>
                  <View style={[styles.leaf, styles.leafLeft]} />
                  <View style={[styles.leaf, styles.leafCenter]} />
                  <View style={[styles.leaf, styles.leafRight]} />
                </View>
                <View style={styles.carrotBody} />
              </View>
            </View>
            <Text style={styles.brandName}>Grociko</Text>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Sign up to get started with fresh groceries</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.inputWrapper, phoneError && styles.inputError]}>
                <Ionicons name="call-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.countryCode}>+880</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={phone}
                  onChangeText={(text) => {
                    const formatted = formatPhoneNumber(text);
                    setPhone(formatted);
                    if (phoneError) setPhoneError('');
                  }}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  maxLength={15}
                />
              </View>
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create password"
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <Text style={styles.passwordHint}>Must be at least 8 characters</Text>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputWrapper, confirmPasswordError && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkedBox]}>
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={14} color={theme.colors.text.white} />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <View style={[styles.loadingDot, styles.loadingDot2]} />
                  <View style={[styles.loadingDot, styles.loadingDot3]} />
                </View>
              ) : (
                <>
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={20} color={theme.colors.text.white} />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign Up */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color={theme.colors.social.google} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color={theme.colors.social.facebook} />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
  },

  // Header
  header: {
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  carrotContainer: {
    alignItems: 'center',
    width: 56,
    height: 56,
  },
  carrotLeaves: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: -2,
    zIndex: 2,
  },
  leaf: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  leafLeft: {
    width: 10,
    height: 14,
    transform: [{ rotate: '-20deg' }],
  },
  leafCenter: {
    width: 8,
    height: 18,
    transform: [{ rotate: '0deg' }],
  },
  leafRight: {
    width: 10,
    height: 14,
    transform: [{ rotate: '20deg' }],
  },
  carrotBody: {
    width: 24,
    height: 36,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    zIndex: 1,
  },
  brandName: {
    fontSize: theme.typography.fontSize['4xl'],
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitleText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Form Section
  formSection: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: theme.colors.status.error,
    backgroundColor: theme.colors.status.error + '10',
  },
  countryCode: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    borderRightWidth: 1,
    borderRightColor: theme.colors.surface.border,
  },
  textInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  passwordHint: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },

  // Terms
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    borderRadius: theme.borderRadius.xs,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  termsText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.sm * 1.4,
  },
  termsLink: {
    color: theme.colors.primary.main,
    fontFamily: 'Outfit-SemiBold',
  },

  // Sign Up Button
  signUpButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.xl,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.white,
    marginHorizontal: 2,
    opacity: 0.4,
  },
  loadingDot2: {
    opacity: 0.7,
  },
  loadingDot3: {
    opacity: 1,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.surface.border,
  },
  dividerText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginHorizontal: theme.spacing.lg,
  },

  // Social Container
  socialContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  socialButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  signInLink: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.main,
  },
});

export default SignUp;