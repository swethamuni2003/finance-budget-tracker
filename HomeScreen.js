import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { Header } from '../components/Header';
import { PersonalizedAlertBanner } from '../components/PersonalizedAlertBanner';
import { SummaryCard } from '../components/SummaryCard';
import { PeriodReportSelector } from '../components/PeriodReportSelector';
import { CategoryProgressCard } from '../components/CategoryProgressCard';
import { TransactionItem } from '../components/TransactionItem';
import { useFinance, AVAILABLE_MONTHS } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const {
    user,
    adminStats,
    selectedMonth,
    setSelectedMonth,
    categoryStats,
    currentMonthTransactions,
    switchRole,
  } = useFinance();

  const [monthModalVisible, setMonthModalVisible] = useState(false);

  // Take top 3 recent transactions
  const recentTransactions = currentMonthTransactions.slice(0, 4);

  // Take top 3 spending categories
  const topCategories = [...categoryStats]
    .filter(c => c.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  return (
    <View style={styles.screenContainer}>
      {/* Universal Top Header */}
      <Header />

      {/* In-App Personalized Alert Banner (Part-III (ii)) */}
      <PersonalizedAlertBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Auth Banner & Sign In / Sign Up Access (Part-I (1)) */}
        <View style={[styles.authBar, shadows.sm]}>
          <View style={styles.authInfo}>
            <View
              style={[
                styles.roleDot,
                { backgroundColor: user.role === 'Admin' ? '#7C3AED' : '#0D9488' },
              ]}
            />
            <Text style={styles.authBarText}>
              Active Account:{' '}
              <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                {user.name}
              </Text>{' '}
              ({user.role})
            </Text>
          </View>

          <TouchableOpacity
            style={styles.authActionBtn}
            onPress={() => navigation.navigate('Auth')}
          >
            <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
            <Text style={styles.authActionText}>Sign In / Up</Text>
          </TouchableOpacity>
        </View>

        {/* ADMIN OVERVIEW CARD (if logged in as Admin) */}
        {user.role === 'Admin' ? (
          <View style={[styles.adminHeroCard, shadows.md]}>
            <View style={styles.adminHeroHeader}>
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#7C3AED" />
                <Text style={styles.adminBadgeText}>Admin System Dashboard</Text>
              </View>
              <Text style={styles.examText}>RVS MCA 2026 EoS Exam</Text>
            </View>

            <Text style={styles.adminTitle}>Financial Operations Control</Text>
            <Text style={styles.adminSubtitle}>
              Monitoring overall budget tracking, transactions & user compliance.
            </Text>

            <View style={styles.adminStatsRow}>
              <View style={styles.adminStatBox}>
                <Text style={styles.adminStatVal}>{adminStats.totalCustomers}</Text>
                <Text style={styles.adminStatLbl}>MCA Students</Text>
              </View>
              <View style={styles.adminStatBox}>
                <Text style={styles.adminStatVal}>{adminStats.totalTransactions}</Text>
                <Text style={styles.adminStatLbl}>Platform Logs</Text>
              </View>
              <View style={styles.adminStatBox}>
                <Text style={styles.adminStatVal}>
                  {user.currency}
                  {Math.round(adminStats.totalPlatformVolume).toLocaleString()}
                </Text>
                <Text style={styles.adminStatLbl}>Total Flow</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.adminSwitchBtn}
              onPress={() => switchRole('Customer')}
            >
              <Ionicons name="eye-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.adminSwitchText}>
                Preview as Customer (Arun Kumar)
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* HERO TOTAL BALANCE CARD (Figma UI matching) */}
        <SummaryCard onMonthPress={() => setMonthModalVisible(true)} />

        {/* QUICK ACTIONS ROW (Fintech Circular Action Buttons) */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Add Tx</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Analysis')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#ECFEFF' }]}>
              <Ionicons name="pie-chart-outline" size={22} color="#06B6D4" />
            </View>
            <Text style={styles.actionLabel}>Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Categories')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="grid-outline" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.actionLabel}>Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Transactions')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#FFF1F2' }]}>
              <Ionicons name="swap-horizontal-outline" size={22} color="#F43F5E" />
            </View>
            <Text style={styles.actionLabel}>History</Text>
          </TouchableOpacity>
        </View>

        {/* REPORTS (Daily / Weekly / Monthly - Part-III (iii) Requirement) */}
        <PeriodReportSelector />

        {/* TOP SPENDING CATEGORIES SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Top Budget Allocations</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAllText}>See All ({categoryStats.length})</Text>
          </TouchableOpacity>
        </View>

        {topCategories.length > 0 ? (
          topCategories.map(cat => (
            <CategoryProgressCard
              key={cat.id}
              category={cat}
              onPress={() => navigation.navigate('CategoryDetails', { categoryId: cat.id })}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No category expenses recorded yet.</Text>
          </View>
        )}

        {/* RECENT TRANSACTIONS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>
              See All ({currentMonthTransactions.length})
            </Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() => navigation.navigate('AddTransaction', { transaction: tx })}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No transactions for {selectedMonth}.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Action Button for Quick Add */}
      <TouchableOpacity
        style={[styles.fabButton, shadows.cardHighlight]}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Month Selection Modal */}
      <Modal
        visible={monthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthModalVisible(false)}
        >
          <View style={[styles.monthModalCard, shadows.lg]}>
            <View style={styles.monthModalHeader}>
              <Text style={styles.monthModalTitle}>Select Financial Month</Text>
              <TouchableOpacity onPress={() => setMonthModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {AVAILABLE_MONTHS.map(m => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.monthOptionRow,
                  selectedMonth === m && styles.monthOptionRowActive,
                ]}
                onPress={() => {
                  setSelectedMonth(m);
                  setMonthModalVisible(false);
                }}
              >
                <Ionicons
                  name={selectedMonth === m ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selectedMonth === m ? colors.primary : colors.textMuted}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    styles.monthOptionText,
                    selectedMonth === m && { fontWeight: '700', color: colors.primary },
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  authBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  authInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  authBarText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  authActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  authActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  adminHeroCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  adminHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  examText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4C1D95',
    marginBottom: 2,
  },
  adminSubtitle: {
    fontSize: 12,
    color: '#6D28D9',
    marginBottom: 12,
  },
  adminStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  adminStatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  adminStatVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5B21B6',
  },
  adminStatLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  adminSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 12,
  },
  adminSwitchText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  monthModalCard: {
    width: '90%',
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
  },
  monthModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  monthOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  monthOptionRowActive: {
    backgroundColor: colors.primaryBg,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  monthOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

