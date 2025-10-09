import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const About = () => {
  const appInfo = {
    version: '1.2.3',
    buildNumber: '2024.01.15',
    lastUpdated: 'January 15, 2024',
  };

  const teamMembers = [
    {
      id: '1',
      name: 'Shabeer Ahmed',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Tech Lead',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  ];

  const socialLinks = [
    {
      id: '1',
      name: 'Website',
      icon: 'globe-outline',
      url: 'https://grociko.com',
      color: theme.colors.secondary.main,
    },
    {
      id: '2',
      name: 'Facebook',
      icon: 'logo-facebook',
      url: 'https://facebook.com/grociko',
      color: '#1877F2',
    },
    {
      id: '3',
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://instagram.com/grociko',
      color: '#E4405F',
    },
    {
      id: '4',
      name: 'Twitter',
      icon: 'logo-twitter',
      url: 'https://twitter.com/grociko',
      color: '#1DA1F2',
    },
  ];

  const legalLinks = [
    {
      id: '1',
      title: 'Terms of Service',
      onPress: () => Linking.openURL('https://grociko.com/terms'),
    },
    {
      id: '2',
      title: 'Privacy Policy',
      onPress: () => Linking.openURL('https://grociko.com/privacy'),
    },
    {
      id: '3',
      title: 'Cookie Policy',
      onPress: () => Linking.openURL('https://grociko.com/cookies'),
    },
    {
      id: '4',
      title: 'Refund Policy',
      onPress: () => Linking.openURL('https://grociko.com/refund'),
    },
  ];

  const handleSocialPress = (url) => {
    Linking.openURL(url);
  };

  const handleRateApp = () => {
    // In a real app, this would link to the app store
    Linking.openURL('https://play.google.com/store/apps/details?id=com.grociko.app');
  };

  const handleShareApp = () => {
    // In a real app, this would use the native share API
    Linking.openURL('https://grociko.com/download');
  };

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
          <Text style={styles.headerTitle}>About</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* App Logo & Info */}
          <View style={styles.appSection}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=60&h=60&fit=crop' }}
                style={styles.appLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Grociko</Text>
            <Text style={styles.appTagline}>Fresh groceries at your doorstep</Text>
            <Text style={styles.appVersion}>Version {appInfo.version}</Text>
          </View>

          {/* About Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Us</Text>
            <Text style={styles.aboutText}>
              Grociko is your trusted partner for fresh, high-quality groceries delivered right to your doorstep.
              We're committed to making grocery shopping convenient, affordable, and sustainable for families across the region.
              {'\n\n'}
              Founded in 2023, we've grown from a small local startup to serving thousands of customers daily.
              Our mission is to connect you with the freshest produce and everyday essentials while supporting local farmers and suppliers.
            </Text>
          </View>

          {/* Team */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Team</Text>
            <View style={styles.teamContainer}>
              {teamMembers.map((member) => (
                <View key={member.id} style={styles.teamMember}>
                  <Image
                    source={{ uri: member.image }}
                    style={styles.teamMemberImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  <Text style={styles.teamMemberRole}>{member.role}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What We Offer</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="flash-outline" size={24} color={theme.colors.secondary.main} />
                <Text style={styles.featureText}>Lightning-fast delivery in 30-120 minutes</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="leaf-outline" size={24} color={theme.colors.secondary.main} />
                <Text style={styles.featureText}>Fresh, organic produce from local farms</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.secondary.main} />
                <Text style={styles.featureText}>Quality guaranteed or money back</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="card-outline" size={24} color={theme.colors.secondary.main} />
                <Text style={styles.featureText}>Secure payment options including COD</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="people-outline" size={24} color={theme.colors.secondary.main} />
                <Text style={styles.featureText}>24/7 customer support</Text>
              </View>
            </View>
          </View>

          {/* Social Media */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect With Us</Text>
            <View style={styles.socialContainer}>
              {socialLinks.map((social) => (
                <TouchableOpacity
                  key={social.id}
                  style={[styles.socialButton, { backgroundColor: `${social.color}20` }]}
                  onPress={() => handleSocialPress(social.url)}
                >
                  <Ionicons name={social.icon} size={24} color={social.color} />
                  <Text style={[styles.socialText, { color: social.color }]}>
                    {social.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Us</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleRateApp}>
              <Ionicons name="star-outline" size={24} color={theme.colors.secondary.main} />
              <Text style={styles.actionButtonText}>Rate Our App</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShareApp}>
              <Ionicons name="share-outline" size={24} color={theme.colors.secondary.main} />
              <Text style={styles.actionButtonText}>Share With Friends</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.legalContainer}>
              {legalLinks.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  style={styles.legalLink}
                  onPress={link.onPress}
                >
                  <Text style={styles.legalLinkText}>{link.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appInfoText}>Build: {appInfo.buildNumber}</Text>
            <Text style={styles.appInfoText}>Last Updated: {appInfo.lastUpdated}</Text>
            <Text style={styles.copyright}>
              © 2024 Grociko. All rights reserved.
            </Text>
          </View>
        </ScrollView>
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

  // Content Styles
  content: {
    flex: 1,
  },

  // App Section
  appSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  appLogo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  appTagline: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },

  // Section Styles
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },

  // About Text
  aboutText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },

  // Team Styles
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  teamMember: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  teamMemberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.secondary.main,
  },
  teamMemberName: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  teamMemberRole: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Features Styles
  featuresList: {
    gap: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  featureText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    flex: 1,
  },

  // Social Styles
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  socialText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
  },

  // Action Button Styles
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    flex: 1,
    marginLeft: theme.spacing.lg,
  },

  // Legal Styles
  legalContainer: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  legalLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.divider,
  },
  legalLinkText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
  },

  // App Info
  appInfoSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['6xl'],
  },
  appInfoText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  copyright: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
});

export default About;