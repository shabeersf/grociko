import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { getContactAndFaq } from "@/services/apiService";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Help = () => {
  const [activeSection, setActiveSection] = useState("faq");
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState(null);
  const [faqData, setFaqData] = useState([]);

  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const quickLinks = [
    {
      id: "1",
      title: "Order Issues",
      description: "Problems with your current or past orders",
      icon: "bag-outline",
      action: () => router.push("/orders"),
    },
    {
      id: "3",
      title: "Delivery Address",
      description: "Update or manage delivery addresses",
      icon: "location-outline",
      action: () => router.push("/address-management"),
    },
    {
      id: "4",
      title: "Account Settings",
      description: "Profile, preferences, and security",
      icon: "person-outline",
      action: () => router.push("/my-details"),
    },
  ];

  // Load contact us data when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadContactFaq();
    }, [])
  );

  const loadContactFaq = async () => {
    try {
      setLoading(true);
      const response = await getContactAndFaq();

      console.log("📦 Full API Response:", response);

      if (response.success) {
        console.log("📋 Contact Data:", response.contact);
        console.log("📋 FAQ Data:", response.faq);

        setContactData(response.contact);
        setFaqData(response.faq);
      } else {
        console.error("❌ API Error:", response.error);
        Alert.alert("Error", response.error || "Failed to load data");
      }
    } catch (error) {
      console.error("❌ Error loading contact data:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Build contact options dynamically from API data
  const getContactOptions = () => {
    if (!contactData) return [];

    const options = [];

    if (contactData.phone) {
      options.push({
        id: "1",
        title: "Call Us",
        description: contactData.phone,
        subtitle: "Available 24/7",
        icon: "call-outline",
        action: () => Linking.openURL(`tel:${contactData.phone}`),
      });
    }

    if (contactData.email) {
      options.push({
        id: "2",
        title: "Email Support",
        description: contactData.email,
        subtitle: "Response within 2 hours",
        icon: "mail-outline",
        action: () => Linking.openURL(`mailto:${contactData.email}`),
      });
    }

    if (contactData.whatsapp) {
      options.push({
        id: "4",
        title: "WhatsApp",
        description: contactData.whatsapp,
        subtitle: "Quick assistance via WhatsApp",
        icon: "logo-whatsapp",
        action: () =>
          Linking.openURL(`whatsapp://send?phone=${contactData.whatsapp}`),
      });
    }

    return options;
  };

  const handleFaqPress = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSendMessage = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      Alert.alert("Error", "Please fill in both subject and message");
      return;
    }

    // Send message logic would go here
    Alert.alert(
      "Message Sent",
      "Thank you for contacting us. We'll get back to you soon!"
    );
    setContactForm({ subject: "", message: "" });
  };

  const renderFaqItem = ({ item }) => (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => handleFaqPress(item.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={expandedFaq === item.id ? "chevron-up" : "chevron-down"}
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
        <Ionicons
          name={item.icon}
          size={24}
          color={theme.colors.secondary.main}
        />
      </View>
      <View style={styles.quickLinkContent}>
        <Text style={styles.quickLinkTitle}>{item.title}</Text>
        <Text style={styles.quickLinkDescription}>{item.description}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  const renderContactOption = ({ item }) => (
    <TouchableOpacity style={styles.contactItem} onPress={item.action}>
      <View style={styles.contactIcon}>
        <Ionicons
          name={item.icon}
          size={24}
          color={theme.colors.secondary.main}
        />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{item.title}</Text>
        <Text style={styles.contactDescription}>{item.description}</Text>
        <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="information-circle-outline"
        size={64}
        color={theme.colors.text.tertiary}
      />
      <Text style={styles.emptyText}>No data available</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={loadContactFaq}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
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
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeSection === "faq" && styles.activeTab]}
            onPress={() => setActiveSection("faq")}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === "faq" && styles.activeTabText,
              ]}
            >
              FAQ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeSection === "contact" && styles.activeTab,
            ]}
            onPress={() => setActiveSection("contact")}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === "contact" && styles.activeTabText,
              ]}
            >
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          renderLoading()
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {activeSection === "faq" ? (
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
                  <Text style={styles.sectionTitle}>
                    Frequently Asked Questions
                  </Text>
                  {faqData.length > 0 ? (
                    <FlatList
                      data={faqData}
                      renderItem={renderFaqItem}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  ) : (
                    renderEmptyState()
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Contact Options */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Get in Touch</Text>
                  {getContactOptions().length > 0 ? (
                    <FlatList
                      data={getContactOptions()}
                      renderItem={renderContactOption}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  ) : (
                    renderEmptyState()
                  )}
                </View>

                {/* Contact Address */}
                {contactData?.address && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Address</Text>
                    <View style={styles.addressCard}>
                      <Ionicons
                        name="location"
                        size={24}
                        color={theme.colors.primary.main}
                      />
                      <Text style={styles.addressText}>
                        {contactData.address}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Contact Form */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Send us a Message</Text>
                  <View style={styles.contactForm}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Subject</Text>
                      <TextInput
                        style={styles.textInput}
                        value={contactForm.subject}
                        onChangeText={(text) =>
                          setContactForm({ ...contactForm, subject: text })
                        }
                        placeholder="What can we help you with?"
                        placeholderTextColor={theme.colors.text.placeholder}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Message</Text>
                      <TextInput
                        style={[styles.textInput, styles.messageInput]}
                        value={contactForm.message}
                        onChangeText={(text) =>
                          setContactForm({ ...contactForm, message: text })
                        }
                        placeholder="Describe your issue or question..."
                        placeholderTextColor={theme.colors.text.placeholder}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={handleSendMessage}
                    >
                      <Text style={styles.sendButtonText}>Send Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
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

  // Tab Styles
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.background.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.tertiary,
  },
  activeTabText: {
    color: theme.colors.text.primary,
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing["6xl"],
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing["4xl"],
  },
  emptyText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing["2xl"],
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },

  // Section Styles
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },

  // Quick Link Styles
  quickLinkItem: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.lg,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  quickLinkDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },

  // FAQ Styles
  faqItem: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  faqQuestion: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    lineHeight:
      theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },

  // Contact Styles
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.lg,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  contactDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.secondary.main,
    marginBottom: theme.spacing.xs,
  },
  contactSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
  },

  // Address Card Styles
  addressCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    gap: theme.spacing.lg,
  },
  addressText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
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
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.white,
  },
});

export default Help;