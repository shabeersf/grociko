import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Help = () => {
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const faqData = [
    {
      id: '1',
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. Make sure you have a delivery address and payment method set up.',
    },
    {
      id: '2',
      question: 'What are the delivery charges?',
      answer: 'Delivery is free for orders above $30. For orders below $30, a delivery fee of $5 applies. Premium members get free delivery on all orders.',
    },
    {
      id: '3',
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-4 hours during business hours. Express delivery (30-60 minutes) is available for an additional fee in select areas.',
    },
    {
      id: '4',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 15 minutes of placing it. After that, please contact our customer support for assistance.',
    },
    {
      id: '5',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard), debit cards, digital wallets (PayPal, Apple Pay, Google Pay), and cash on delivery.',
    },
    {
      id: '6',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time through the "Orders" section in your account. You\'ll also receive SMS and email updates.',
    },
    {
      id: '7',
      question: 'What if I receive damaged items?',
      answer: 'If you receive damaged or incorrect items, please contact us immediately through the app or call our support line. We\'ll arrange for a replacement or refund.',
    },
    {
      id: '8',
      question: 'How do I apply a promo code?',
      answer: 'You can apply promo codes during checkout or add them to your account through the "Promo Code" section in your profile.',
    },
  ];

  const quickLinks = [
    {
      id: '1',
      title: 'Order Issues',
      description: 'Problems with your current or past orders',
      icon: 'bag-outline',
      action: () => router.push('/orders'),
    },
    {
      id: '2',
      title: 'Payment & Billing',
      description: 'Payment methods, billing, and refunds',
      icon: 'card-outline',
      action: () => router.push('/payment-methods'),
    },
    {
      id: '3',
      title: 'Delivery Address',
      description: 'Update or manage delivery addresses',
      icon: 'location-outline',
      action: () => router.push('/address-management'),
    },
    {
      id: '4',
      title: 'Account Settings',
      description: 'Profile, preferences, and security',
      icon: 'person-outline',
      action: () => router.push('/my-details'),
    },
  ];

  const contactOptions = [
    {
      id: '1',
      title: 'Call Us',
      description: '+880 1800-GROCIKO',
      subtitle: 'Available 24/7',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:+8801800472626'),
    },
    {
      id: '2',
      title: 'Email Support',
      description: 'support@grociko.com',
      subtitle: 'Response within 2 hours',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:support@grociko.com'),
    },
    {
      id: '3',
      title: 'Live Chat',
      description: 'Chat with our support team',
      subtitle: 'Available 9 AM - 9 PM',
      icon: 'chatbubble-outline',
      action: () => Alert.alert('Live Chat', 'Live chat feature would open here'),
    },
    {
      id: '4',
      title: 'WhatsApp',
      description: '+880 1700-HELP',
      subtitle: 'Quick assistance via WhatsApp',
      icon: 'logo-whatsapp',
      action: () => Linking.openURL('whatsapp://send?phone=8801700435739'),
    },
  ];

  const handleFaqPress = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSendMessage = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    // Send message logic would go here
    Alert.alert('Message Sent', 'Thank you for contacting us. We\'ll get back to you soon!');
    setContactForm({ subject: '', message: '' });
  };

  const renderFaqItem = ({ item }) => (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => handleFaqPress(item.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={expandedFaq === item.id ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.text.tertiary}
        />
      </View>
      {expandedFaq === item.id && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  const renderQuickLink = ({ item }) => (
    <TouchableOpacity style={styles.quickLinkItem} onPress={item.action}>
      <View style={styles.quickLinkIcon}>
        <Ionicons name={item.icon} size={24} color={theme.colors.secondary.main} />
      </View>
      <View style={styles.quickLinkContent}>
        <Text style={styles.quickLinkTitle}>{item.title}</Text>
        <Text style={styles.quickLinkDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );

  const renderContactOption = ({ item }) => (
    <TouchableOpacity style={styles.contactItem} onPress={item.action}>
      <View style={styles.contactIcon}>
        <Ionicons name={item.icon} size={24} color={theme.colors.secondary.main} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{item.title}</Text>
        <Text style={styles.contactDescription}>{item.description}</Text>
        <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'faq' && styles.activeTab]}
            onPress={() => setActiveSection('faq')}
          >
            <Text style={[styles.tabText, activeSection === 'faq' && styles.activeTabText]}>
              FAQ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'contact' && styles.activeTab]}
            onPress={() => setActiveSection('contact')}
          >
            <Text style={[styles.tabText, activeSection === 'contact' && styles.activeTabText]}>
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeSection === 'faq' ? (
            <>
              {/* Quick Links */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Help</Text>
                <FlatList
                  data={quickLinks}
                  renderItem={renderQuickLink}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>

              {/* FAQ */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <FlatList
                  data={faqData}
                  renderItem={renderFaqItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            </>
          ) : (
            <>
              {/* Contact Options */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Get in Touch</Text>
                <FlatList
                  data={contactOptions}
                  renderItem={renderContactOption}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>

              {/* Contact Form */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Send us a Message</Text>
                <View style={styles.contactForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Subject</Text>
                    <TextInput
                      style={styles.textInput}
                      value={contactForm.subject}
                      onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                      placeholder="What can we help you with?"
                      placeholderTextColor={theme.colors.text.placeholder}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Message</Text>
                    <TextInput
                      style={[styles.textInput, styles.messageInput]}
                      value={contactForm.message}
                      onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                      placeholder="Describe your issue or question..."
                      placeholderTextColor={theme.colors.text.placeholder}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
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

  // Content Styles
  content: {
    flex: 1,
  },

  // Section Styles
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },

  // Quick Link Styles
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.secondary.main}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  quickLinkDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },

  // FAQ Styles
  faqItem: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  faqQuestion: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },

  // Contact Styles
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.secondary.main}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  contactDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.secondary.main,
    marginBottom: theme.spacing.xs,
  },
  contactSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },

  // Contact Form Styles
  contactForm: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
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
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
});

export default Help;