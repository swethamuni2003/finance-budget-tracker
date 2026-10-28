import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

export const PeriodReportSelector = () => {
  const [activePeriod, setActivePeriod] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'
  const { reports, user } = useFinance();

  const reportData = reports[activePeriod];
  const maxWeeklySpent = Math.max(...(reports.weekly?.days?.map(d => d.spent) || [100]), 100);

  return (
    <View style={[styles.container, shadows.sm]}>
      {/* Header and Segmented Control */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.sectionHeaderTitle}>Financial Reports</Text>
          <Text style={styles.periodSublabel}>{reportData.periodLabel}</Text>
        </View>

        {/* 3-Way Segment Tabs (Part-III (iii) Requirement) */}
        <View style={styles.segmentedControl}>
          {['daily', 'weekly', 'monthly'].map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.segmentButton,
                activePeriod === period && styles.segmentButtonActive,
              ]}
              onPress={() => setActivePeriod(period)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  activePeriod === period && styles.segmentButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metrics Row for Selected Period */}
      <View style={styles.metricsContainer}>
        {/* Income Card */}
        <View style={[styles.metricCard, { backgroundColor: colors.incomeBg }]}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricLabel, { color: colors.incomeDark }]}>Income</Text>
            <Ionicons name="trending-up" size={14} color={colors.incomeDark} />
          </View>
          <Text style={[styles.metricValue, { color: colors.incomeDark }]}>
            {user.currency}{reportData.income.toFixed(2)}
          </Text>
        </View>

        {/* Expense Card */}
        <View style={[styles.metricCard, { backgroundColor: colors.expenseBg }]}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricLabel, { color: colors.expenseDark }]}>Expense</Text>
            <Ionicons name="trending-down" size={14} color={colors.expenseDark} />
          </View>
          <Text style={[styles.metricValue, { color: colors.expenseDark }]}>
            {user.currency}{reportData.expense.toFixed(2)}
          </Text>
        </View>

        {/* Net Cash Flow Card */}
        <View style={[styles.metricCard, { backgroundColor: colors.primaryBg }]}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricLabel, { color: colors.primaryDark }]}>Net Flow</Text>
            <Ionicons name="wallet-outline" size={14} color={colors.primaryDark} />
          </View>
          <Text
            style={[
              styles.metricValue,
              { color: reportData.balance >= 0 ? colors.incomeDark : colors.expenseDark },
            ]}
          >
            {reportData.balance >= 0 ? '+' : '-'}
            {user.currency}{Math.abs(reportData.balance).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Dynamic Visual Breakdown per Period */}
      {activePeriod === 'daily' && (
        <View style={styles.visualSection}>
          <View style={styles.insightsRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.insightsText}>
              {reportData.count > 0
                ? `${reportData.count} transaction(s) recorded today. Total spent: ${user.currency}${reportData.expense.toFixed(2)}.`
                : 'No expenses recorded yet today. Keep up the disciplined budgeting!'}
            </Text>
          </View>
        </View>
      )}

      {activePeriod === 'weekly' && (
        <View style={styles.visualSection}>
          <Text style={styles.chartTitle}>7-Day Daily Spending Trend</Text>
          <View style={styles.barChartContainer}>
            {reports.weekly.days.map((item, index) => {
              const heightPercent = maxWeeklySpent > 0 ? (item.spent / maxWeeklySpent) * 100 : 10;
              const isToday = item.day === 'Wed';
              return (
                <View key={index} style={styles.barCol}>
                  <Text style={styles.barAmountText}>
                    {item.spent > 0 ? `${item.spent}` : '0'}
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.max(10, heightPercent)}%`,
                          backgroundColor: isToday ? colors.primary : '#94A3B8',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayLabel, isToday && styles.barDayLabelActive]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {activePeriod === 'monthly' && (
        <View style={styles.visualSection}>
          <View style={styles.budgetProgressHeader}>
            <Text style={styles.chartTitle}>Monthly Budget Allocation</Text>
            <Text style={styles.budgetPercentText}>
              {Math.min(100, Math.round((reportData.expense / (user.monthlyBudget || 1)) * 100))}% Used
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, Math.round((reportData.expense / (user.monthlyBudget || 1)) * 100))}%`,
                  backgroundColor:
                    reportData.expense > user.monthlyBudget
                      ? colors.expense
                      : reportData.expense > user.monthlyBudget * 0.8
                      ? colors.warning
                      : colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.budgetDetailsRow}>
            <Text style={styles.budgetDetailSub}>
              Spent: <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{user.currency}{reportData.expense.toFixed(2)}</Text>
            </Text>
            <Text style={styles.budgetDetailSub}>
              Remaining: <Text style={{ fontWeight: '700', color: colors.incomeDark }}>{user.currency}{reportData.budgetRemaining.toFixed(2)}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  periodSublabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    padding: 3,
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  segmentButtonActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: colors.primary,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  visualSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  insightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    padding: 10,
    borderRadius: 10,
  },
  insightsText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    paddingTop: 15,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barAmountText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 50,
    backgroundColor: colors.cardAlt,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barDayLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 6,
  },
  barDayLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  budgetProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  budgetPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.cardAlt,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  budgetDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetDetailSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

