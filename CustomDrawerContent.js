import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import { useDrawer } from './DrawerContext';
import { useNavigation } from '@react-navigation/native';

export const CustomDrawerContent = () => {
  const { user, switchRole } = useFinance();
  const { closeDrawer } = useDrawer();
  const navigation = useNavigation();

  const handleRoleToggle = () => {
    const nextRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    switchRole(nextRole);
  };

  const handleNavigate = (screenName) => {
    closeDrawer();
    // Small delay so drawer closes before navigation
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 50);
  };

  // Tab screens use direct tab names; stack screens use stack names
  const navItems = [
    { name: 'Home Dashboard', screen: 'Home', icon: 'home-outline', type: 'tab' },
    { name: 'Financial Analysis', screen: 'Analysis', icon: 'pie-chart-outline', type: 'tab' },
    { name: 'Month-Wise Transactions', screen: 'Transactions', icon: 'swap-horizontal-outline', type: 'tab' },
    { name: 'Budget Categories', screen: 'Categories', icon: 'grid-outline', type: 'tab' },
    { name: 'Customer Profile', screen: 'Profile', icon: 'person-outline', type: 'tab' },
    { name: 'Edit Profile', screen: 'EditProfile', icon: 'create-outline', type: 'stack' },
    { name: 'Personalized Alerts Log', screen: 'AlertsHistory', icon: 'notifications-outline', type: 'stack' },
    { name: 'Sign In / Sign Up', screen: 'Auth', icon: 'log-in-outline', type: 'stack' },
  ];

  return (
    <View style={styles.drawerContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerScroll}>
        {/* User Profile Header */}
        <View style={styles.userSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View
              style={[
                styles.roleBadge,
                user.role === 'Admin' ? styles.adminBadge : styles.customerBadge,
              ]}
            >
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: user.role === 'Admin' ? '#7C3AED' : '#0D9488' },
                ]}
              >
                ● {user.role} Mode
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Role Switcher Pill */}
        <TouchableOpacity
          style={styles.switchRoleCard}
          onPress={handleRoleToggle}
          activeOpacity={0.8}
        >
          <Ionicons name="repeat-outline" size={18} color={colors.primary} />
          <Text style={styles.switchRoleCardText}>
            Switch to {user.role === 'Admin' ? 'Customer' : 'Admin'} Mode
          </Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Navigation Items */}
        <Text style={styles.menuHeader}>MAIN NAVIGATION (Drawer)</Text>
        <View style={styles.navItemsList}>
          {navItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.navRow}
              onPress={() => handleNavigate(item.screen)}
            >
              <View style={styles.navIconBox}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.navRowText}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Exam Information Footer Card */}
        
      </ScrollView>

      {/* Footer Sign Out / Sign In */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => handleNavigate('Auth')}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.expense} />
          <Text style={styles.signOutText}>Switch Account / Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.card,
  },
  drawerScroll: {
    padding: 20,
    paddingTop: 40,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  customerBadge: {
    backgroundColor: '#CCFBF1',
  },
  adminBadge: {
    backgroundColor: '#F3E8FF',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  switchRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    padding: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  switchRoleCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  menuHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  navItemsList: {
    gap: 4,
    marginBottom: 16,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  navRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  examCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  examCollege: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  examDept: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  examDegree: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
    marginTop: 2,
  },
  examCourse: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  examMarks: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.expenseDark,
    marginTop: 4,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.card,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.expense,
  },
});
