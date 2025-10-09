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

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Sign In Successful!',
        'Welcome back to Grociko',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)/home'),
          },
        ]
      );
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'A password reset link will be sent to your email address.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Link',
          onPress: () => Alert.alert('Success', 'Reset link sent to your email!'),
        },
      ]
    );
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
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitleText}>Sign in to your account to continue</Text>
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
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
                  <Text style={styles.signInButtonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color={theme.colors.text.white} />
                </>
              )}
            </TouchableOpacity>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signUpLink}>Create Account</Text>
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
    paddingVertical: theme.spacing['2xl'],
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
    paddingVertical: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
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

  // Forgot Password
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.main,
  },

  // Sign In Button
  signInButton: {
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
  signInButtonText: {
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
  signUpLink: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.main,
  },
});

export default SignIn;