import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

export const CategoryProgressCard = ({ category, onPress }) => {
  const { user } = useFinance();

  const isOverBudget = category.spent > category.budgetLimit;
  const isNearLimit = category.percentSpent >= 80 && !isOverBudget;

  const barColor = isOverBudget ? colors.danger : isNearLimit ? colors.warning : category.color;

  return (
    <TouchableOpacity
      style={[styles.container, shadows.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={[styles.iconWrap, { backgroundColor: category.bg }]}>
            <Ionicons name={category.icon || 'folder-outline'} size={20} color={category.color} />
          </View>
          <View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.txCountText}>{category.transactionCount || 0} transaction(s)</Text>
          </View>
        </View>

        <View style={styles.rightInfo}>
          <Text style={styles.spentAmount}>
            {user.currency}{category.spent.toFixed(2)}
          </Text>
          <Text style={styles.budgetLimitText}>
            of {user.currency}{category.budgetLimit.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(100, category.percentSpent)}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <View style={styles.percentBadge}>
          <Text style={[styles.percentText, { color: barColor }]}>
            {category.percentSpent}% Spent
          </Text>
        </View>

        <Text style={styles.remainingText}>
          {isOverBudget ? (
            <Text style={{ color: colors.danger, fontWeight: '700' }}>
              Over by {user.currency}{(category.spent - category.budgetLimit).toFixed(2)}
            </Text>
          ) : (
            <Text>
              {user.currency}{category.remaining.toFixed(2)} left
            </Text>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  txCountText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  budgetLimitText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.cardAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  percentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.cardAlt,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  remainingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

