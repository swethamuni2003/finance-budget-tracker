import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { Header } from '../components/Header';
import { PersonalizedAlertBanner } from '../components/PersonalizedAlertBanner';
import { CustomButton } from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, monthFinancials, transactions, switchRole, updateProfile } = useFinance();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const currencies = ['$', '₹', '€', '£'];

  const handleCurrencyChange = (curr) => {
    updateProfile({ currency: curr });
    Alert.alert('Currency Updated', `Default app currency is now set to ${curr}`);
  };

  return (
    <View style={styles.screenContainer}>
      <Header title="My Profile" subtitle="Account & Settings" />
      <PersonalizedAlertBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={[styles.profileHeaderCard, shadows.md]}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.avatarEditBadge}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userNameText}>{user.name}</Text>
          <Text style={styles.userEmailText}>{user.email}</Text>

          <View style={styles.roleBadgeContainer}>
            <View style={styles.customerRoleBadge}>
              <Ionicons name="school-outline" size={14} color="#0D9488" />
              <Text style={styles.customerRoleText}>MCA 2025 Batch Student</Text>
            </View>
          </View>

          <Text style={styles.userBioText}>{user.bio}</Text>

          {/* Edit Profile Action Button */}
          <CustomButton
            title="Edit Profile Information"
            onPress={() => navigation.navigate('EditProfile')}
            icon="create-outline"
            variant="outline"
            style={{ width: '100%', marginTop: 14 }}
          />
        </View>

        {/* Monthly Budget Card */}
        <View style={[styles.budgetLimitCard, shadows.sm]}>
          <View style={styles.budgetHeaderRow}>
            <View>
              <Text style={styles.budgetCardLabel}>Configured Monthly Budget Limit</Text>
              <Text style={styles.budgetValueText}>
                {user.currency}{user.monthlyBudget?.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.budgetEditBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.budgetCardHint}>
            Used by Home and Categories screens to calculate remaining balances and warning alerts.
          </Text>
        </View>

        {/* Lifetime Activity Stats */}
        <View style={[styles.statsCard, shadows.sm]}>
          <Text style={styles.sectionHeaderTitle}>Financial Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNum}>{transactions.length}</Text>
              <Text style={styles.statBoxLbl}>Total Transactions</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statBoxNum, { color: colors.incomeDark }]}>
                {monthFinancials.savingsRate}%
              </Text>
              <Text style={styles.statBoxLbl}>Savings Rate</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNum}>{user.phone?.slice(-4) || '3210'}</Text>
              <Text style={styles.statBoxLbl}>Phone Verified</Text>
            </View>
          </View>
        </View>

        {/* Currency Selector */}
        <View style={[styles.settingsCard, shadows.sm]}>
          <Text style={styles.sectionHeaderTitle}>Currency Preference</Text>
          <View style={styles.currencyRow}>
            {currencies.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.currencyPill,
                  user.currency === c && styles.currencyPillActive,
                ]}
                onPress={() => handleCurrencyChange(c)}
              >
                <Text
                  style={[
                    styles.currencyText,
                    user.currency === c && styles.currencyTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preference Toggles */}
        <View style={[styles.settingsCard, shadows.sm]}>
          <Text style={styles.sectionHeaderTitle}>Preferences & Security</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelRow}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.toggleTitle}>Transaction Alerts</Text>
                <Text style={styles.toggleSub}>Get personalized banners for budget changes</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.cardAlt, true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : '#F4F3F4'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelRow}>
              <Ionicons name="finger-print-outline" size={20} color={colors.textPrimary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.toggleTitle}>Biometric Lock</Text>
                <Text style={styles.toggleSub}>Require Face ID / Fingerprint on launch</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: colors.cardAlt, true: colors.primaryLight }}
              thumbColor={biometricsEnabled ? colors.primary : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Examination & Institution Info Card */}
        <View style={[styles.examCard, shadows.sm]}>
          <View style={styles.examHeader}>
            <Ionicons name="ribbon-outline" size={22} color={colors.primary} />
            <Text style={styles.examTitle}>RVS College of Arts and Science (Autonomous)</Text>
          </View>
          <Text style={styles.examSub}>
            School of Computer Studies (SCS) - MCA 2025 Batch Semester - III{'\n'}
            Core Elective-II: Mobile App Development using React Native{'\n'}
            EoS Examinations Oct 2026 - Major Hackathon (75 Marks)
          </Text>
        </View>

        {/* Role Switcher Test Button */}
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => switchRole('Admin')}
        >
          <Ionicons name="shield-checkmark" size={16} color="#7C3AED" />
          <Text style={styles.switchRoleText}>Switch to Admin Mode for Testing</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  roleBadgeContainer: {
    marginBottom: 10,
  },
  customerRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  customerRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  userBioText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  budgetLimitCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  budgetCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  budgetValueText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  budgetEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetCardHint: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statBoxNum: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statBoxLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  currencyPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  currencyPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  currencyTextActive: {
    color: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  examCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  examTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    flex: 1,
  },
  examSub: {
    fontSize: 11,
    color: '#4338CA',
    lineHeight: 16,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  switchRoleText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '700',
  },
});

