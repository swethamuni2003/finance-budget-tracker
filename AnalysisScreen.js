import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { Header } from '../components/Header';
import { PersonalizedAlertBanner } from '../components/PersonalizedAlertBanner';
import { useFinance, AVAILABLE_MONTHS } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const AnalysisScreen = () => {
  const navigation = useNavigation();
  const {
    user,
    selectedMonth,
    setSelectedMonth,
    categoryStats,
    monthFinancials,
    currentMonthTransactions,
    adminStats,
  } = useFinance();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'categories' | 'trends'

  // Total expense for category percentage calculation
  const totalExpense = monthFinancials.expense || 1;

  // Filtered categories with expense > 0
  const activeExpenseCategories = categoryStats
    .filter(c => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  // Health Score Calculation based on savings rate
  const healthScore = Math.min(100, Math.max(30, Math.round(50 + monthFinancials.savingsRate * 0.5)));

  return (
    <View style={styles.screenContainer}>
      <Header title="Financial Analysis" subtitle="Reports & Insights" />
      <PersonalizedAlertBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Selector Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {AVAILABLE_MONTHS.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.monthPill, selectedMonth === m && styles.monthPillActive]}
              onPress={() => setSelectedMonth(m)}
            >
              <Text style={[styles.monthPillText, selectedMonth === m && styles.monthPillTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ADMIN SPECIFIC ANALYTICS CARD (if Admin) */}
        {user.role === 'Admin' ? (
          <View style={[styles.adminCard, shadows.sm]}>
            <View style={styles.adminCardHeader}>
              <Ionicons name="bar-chart" size={18} color="#7C3AED" />
              <Text style={styles.adminCardTitle}>Institution Aggregate Spend Analysis</Text>
            </View>
            <Text style={styles.adminDesc}>
              Aggregated across all registered MCA students & department allocations.
            </Text>

            <View style={styles.adminMetricsGrid}>
              <View style={styles.adminGridItem}>
                <Text style={styles.adminMetricVal}>{adminStats.totalCustomers}</Text>
                <Text style={styles.adminMetricLbl}>Active Users</Text>
              </View>
              <View style={styles.adminGridItem}>
                <Text style={styles.adminMetricVal}>{adminStats.systemCategories}</Text>
                <Text style={styles.adminMetricLbl}>Budget Rules</Text>
              </View>
              <View style={styles.adminGridItem}>
                <Text style={styles.adminMetricVal}>92%</Text>
                <Text style={styles.adminMetricLbl}>Compliance</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* FINANCIAL HEALTH SCORE CARD (Customer) */}
        {user.role === 'Customer' ? (
          <View style={[styles.healthCard, shadows.sm]}>
            <View style={styles.healthScoreCircle}>
              <Text style={styles.healthScoreNumber}>{healthScore}</Text>
              <Text style={styles.healthScoreMax}>/100</Text>
            </View>
            <View style={styles.healthTextContainer}>
              <Text style={styles.healthTitle}>Financial Discipline Score</Text>
              <Text style={styles.healthSubtitle}>
                {healthScore >= 80
                  ? 'Excellent savings rate! Your spending is well within budget limits.'
                  : healthScore >= 60
                  ? 'Good budgeting. Watch your dining and shopping expenses.'
                  : 'Caution: Expenses are approaching your total allocated budget.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* COMPARATIVE CASH FLOW CARD (Income vs Expense Visual) */}
        <View style={[styles.chartCard, shadows.sm]}>
          <Text style={styles.cardHeaderTitle}>Income vs Expense Balance</Text>
          <Text style={styles.cardHeaderSub}>Net Cash Flow for {selectedMonth}</Text>

          <View style={styles.cashFlowBarContainer}>
            {/* Income Bar */}
            <View style={styles.flowBarItem}>
              <View style={styles.barLabelRow}>
                <Text style={styles.flowBarTitle}>Total Income</Text>
                <Text style={[styles.flowBarAmount, { color: colors.incomeDark }]}>
                  +{user.currency}{monthFinancials.income.toFixed(2)}
                </Text>
              </View>
              <View style={styles.barTrackLarge}>
                <View style={[styles.barFillLarge, { width: '100%', backgroundColor: colors.income }]} />
              </View>
            </View>

            {/* Expense Bar */}
            <View style={styles.flowBarItem}>
              <View style={styles.barLabelRow}>
                <Text style={styles.flowBarTitle}>Total Expense</Text>
                <Text style={[styles.flowBarAmount, { color: colors.expenseDark }]}>
                  -{user.currency}{monthFinancials.expense.toFixed(2)}
                </Text>
              </View>
              <View style={styles.barTrackLarge}>
                <View
                  style={[
                    styles.barFillLarge,
                    {
                      width: `${Math.min(100, (monthFinancials.expense / (monthFinancials.income || 1)) * 100)}%`,
                      backgroundColor: colors.expense,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Quick Summary Pill Row */}
          <View style={styles.summaryPillRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.pillLabel}>Net Savings</Text>
              <Text style={[styles.pillValue, { color: colors.incomeDark }]}>
                {user.currency}{monthFinancials.netBalance.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.pillLabel}>Savings Ratio</Text>
              <Text style={styles.pillValue}>{monthFinancials.savingsRate}%</Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.pillLabel}>Transactions</Text>
              <Text style={styles.pillValue}>{monthFinancials.transactionCount}</Text>
            </View>
          </View>
        </View>

        {/* CATEGORY SPENDING BREAKDOWN SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expense Breakdown by Category</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.linkText}>Details</Text>
          </TouchableOpacity>
        </View>

        {/* Stacked Multi-Color Category Progress Bar */}
        <View style={[styles.multiColorBarCard, shadows.sm]}>
          <View style={styles.stackedBar}>
            {activeExpenseCategories.map(cat => {
              const widthPct = Math.max(3, (cat.spent / totalExpense) * 100);
              return (
                <View
                  key={cat.id}
                  style={[
                    styles.stackedSegment,
                    { width: `${widthPct}%`, backgroundColor: cat.color },
                  ]}
                />
              );
            })}
          </View>

          {/* Category Percentage List */}
          <View style={styles.categoryPercentList}>
            {activeExpenseCategories.map(cat => {
              const share = Math.round((cat.spent / totalExpense) * 100);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryPercentRow}
                  onPress={() => navigation.navigate('CategoryDetails', { categoryId: cat.id })}
                >
                  <View style={styles.catLeft}>
                    <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                    <View style={[styles.iconSmall, { backgroundColor: cat.bg }]}>
                      <Ionicons name={cat.icon} size={14} color={cat.color} />
                    </View>
                    <Text style={styles.catNameText}>{cat.name}</Text>
                  </View>

                  <View style={styles.catRight}>
                    <Text style={styles.catSpentText}>
                      {user.currency}{cat.spent.toFixed(2)}
                    </Text>
                    <View style={styles.shareBadge}>
                      <Text style={styles.shareBadgeText}>{share}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* MONTH OVERVIEW / INSIGHTS CARD */}
        <View style={[styles.insightCard, shadows.sm]}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb-outline" size={20} color={colors.warning} />
            <Text style={styles.insightTitle}>Key Spending Insights</Text>
          </View>
          <Text style={styles.insightBody}>
            • Largest monthly outflow was{' '}
            <Text style={{ fontWeight: '700' }}>
              {activeExpenseCategories[0]?.name || 'Housing'} ({user.currency}
              {activeExpenseCategories[0]?.spent.toFixed(2) || '0.00'})
            </Text>
            .{'\n'}• You have preserved a{' '}
            <Text style={{ fontWeight: '700', color: colors.incomeDark }}>
              {monthFinancials.savingsRate}%
            </Text>{' '}
            savings surplus for {selectedMonth}.
          </Text>
        </View>

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
  monthScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthPillTextActive: {
    color: '#FFF',
  },
  adminCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FAF5FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  adminCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  adminCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B21A8',
  },
  adminDesc: {
    fontSize: 12,
    color: '#7E22CE',
    marginBottom: 12,
  },
  adminMetricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  adminGridItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  adminMetricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#581C87',
  },
  adminMetricLbl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  healthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  healthScoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginRight: 14,
  },
  healthScoreNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  healthScoreMax: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: -2,
  },
  healthTextContainer: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  healthSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardHeaderSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  cashFlowBarContainer: {
    marginBottom: 16,
    gap: 12,
  },
  flowBarItem: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowBarTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  flowBarAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  barTrackLarge: {
    height: 12,
    backgroundColor: colors.cardAlt,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFillLarge: {
    height: '100%',
    borderRadius: 6,
  },
  summaryPillRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  summaryPill: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  pillLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  multiColorBarCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stackedBar: {
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.cardAlt,
  },
  stackedSegment: {
    height: '100%',
  },
  categoryPercentList: {
    gap: 10,
  },
  categoryPercentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  iconSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  catNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  catRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catSpentText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  shareBadge: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  shareBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  insightCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  insightBody: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
});

