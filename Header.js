import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../navigation/DrawerContext';

export const Header = ({ title, showBack = false, subtitle }) => {
  const navigation = useNavigation();
  const { user, alertsHistory, switchRole } = useFinance();
  const { openDrawer } = useDrawer();

  const unreadAlertsCount = alertsHistory.filter(a => !a.read).length;

  const handleToggleDrawer = () => {
    openDrawer();
  };

  const handleRoleToggle = () => {
    const nextRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    switchRole(nextRole);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleToggleDrawer}
            accessibilityLabel="Open drawer menu"
          >
            <Ionicons name="menu-outline" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          {subtitle ? (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          ) : null}
          <Text style={styles.titleText} numberOfLines={1}>
            {title || `Hi, ${user.name.split(' ')[0]} 👋`}
          </Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        {/* Role Switcher Pill */}
        <TouchableOpacity
          style={[
            styles.roleBadge,
            user.role === 'Admin' ? styles.adminBadge : styles.customerBadge,
          ]}
          onPress={handleRoleToggle}
          activeOpacity={0.7}
        >
          <Ionicons
            name={user.role === 'Admin' ? 'shield-checkmark' : 'person'}
            size={12}
            color={user.role === 'Admin' ? '#7C3AED' : '#0D9488'}
          />
          <Text
            style={[
              styles.roleBadgeText,
              { color: user.role === 'Admin' ? '#7C3AED' : '#0D9488' },
            ]}
          >
            {user.role}
          </Text>
        </TouchableOpacity>

        {/* Alerts Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AlertsHistory')}
          accessibilityLabel="Personalized alerts"
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          {unreadAlertsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadAlertsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* User Avatar */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => {
            if (user.role === 'Customer') {
              navigation.navigate('Profile');
            } else {
              handleRoleToggle();
            }
          }}
        >
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleContainer: {
    flex: 1,
  },
  subtitleText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  customerBadge: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
  },
  adminBadge: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.expense,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    marginLeft: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

