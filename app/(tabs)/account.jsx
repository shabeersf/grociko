import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Account = () => {
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Clear user session/tokens here
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Orders',
      icon: 'bag-outline',
      onPress: () => router.push('/orders'),
    },
    {
      id: 2,
      title: 'My Details',
      icon: 'person-outline',
      onPress: () => router.push('/my-details'),
    },
    {
      id: 3,
      title: 'Delivery Address',
      icon: 'location-outline',
      onPress: () => router.push('/address-management'),
    },
    {
      id: 4,
      title: 'Promo Code',
      icon: 'ticket-outline',
      onPress: () => router.push('/promo-code'),
    },
    {
      id: 5,
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => router.push('/notifications'),
    },
    {
      id: 6,
      title: 'Help',
      icon: 'help-circle-outline',
      onPress: () => router.push('/help'),
    },
    {
      id: 7,
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => router.push('/about'),
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemContent}>
        <Ionicons
          name={item.icon}
          size={24}
          color={theme.colors.text.primary}
        />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Shabeer Ahmed</Text>
            <Text style={styles.userEmail}>shabeer@grociko.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons
              name="pencil-outline"
              size={20}
              color={theme.colors.secondary.main}
            />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutContent}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.colors.status.error}
            />
            <Text style={styles.logoutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  // Profile Section Styles
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  profileImageContainer: {
    marginRight: theme.spacing.lg,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: theme.components.avatar.borderRadius,
    borderWidth: 2,
    borderColor: theme.colors.secondary.main,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Menu Section Styles
  menuSection: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.divider,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.lg,
  },

  // Logout Button Styles
  logoutButton: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing['6xl'],
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.status.error,
    marginLeft: theme.spacing.lg,
  },
});

export default Account;