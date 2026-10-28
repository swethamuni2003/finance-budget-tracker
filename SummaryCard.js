import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance, AVAILABLE_MONTHS } from '../context/FinanceContext';

export const SummaryCard = ({ onMonthPress }) => {
  const { user, selectedMonth, setSelectedMonth, monthFinancials } = useFinance();
  const [showBalance, setShowBalance] = useState(true);

  const formattedBalance = `${user.currency}${Math.abs(monthFinancials.netBalance).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedIncome = `+${user.currency}${monthFinancials.income.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedExpense = `-${user.currency}${monthFinancials.expense.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <View style={[styles.cardContainer, shadows.cardHighlight]}>
      {/* Background decorative circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      {/* Header Row: Label, Eye Toggle & Month selector */}
      <View style={styles.topRow}>
        <View style={styles.labelContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowBalance(!showBalance)}
            accessibilityLabel={showBalance ? 'Hide balance' : 'Show balance'}
          >
            <Ionicons
              name={showBalance ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="#CBD5E1"
            />
          </TouchableOpacity>
        </View>

        {/* Month Selector Pill */}
        <TouchableOpacity
          style={styles.monthPill}
          onPress={onMonthPress}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={13} color="#E0E7FF" style={{ marginRight: 5 }} />
          <Text style={styles.monthPillText}>{selectedMonth}</Text>
          <Ionicons name="chevron-down" size={13} color="#E0E7FF" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>

      {/* Hero Balance Number */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>{user.currency}</Text>
        <Text style={styles.balanceAmount}>
          {showBalance
            ? monthFinancials.netBalance >= 0
              ? formattedBalance.replace(user.currency, '')
              : `-${formattedBalance.replace(user.currency, '')}`
            : '••••••••'}
        </Text>
      </View>

      {/* Savings Rate Badge */}
      <View style={styles.savingsBadge}>
        <Ionicons name="trending-up" size={14} color="#10B981" />
        <Text style={styles.savingsText}>
          Savings Rate: {monthFinancials.savingsRate}% this month
        </Text>
      </View>

      {/* Income & Expense Breakdown Row */}
      <View style={styles.breakdownRow}>
        {/* Income Card */}
        <View style={styles.flowCard}>
          <View style={[styles.flowIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="arrow-down-outline" size={18} color="#34D399" />
          </View>
          <View>
            <Text style={styles.flowLabel}>Total Income</Text>
            <Text style={[styles.flowValue, { color: '#34D399' }]}>
              {showBalance ? formattedIncome : '••••'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Expense Card */}
        <View style={styles.flowCard}>
          <View style={[styles.flowIconWrap, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
            <Ionicons name="arrow-up-outline" size={18} color="#FB7185" />
          </View>
          <View>
            <Text style={styles.flowLabel}>Total Expenses</Text>
            <Text style={[styles.flowValue, { color: '#FB7185' }]}>
              {showBalance ? formattedExpense : '••••'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  eyeBtn: {
    marginLeft: 8,
    padding: 2,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  monthPillText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  currencySymbol: {
    color: '#818CF8',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    marginRight: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  savingsText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  flowCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  flowLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  flowValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
});

