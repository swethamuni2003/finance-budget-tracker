import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

export const TransactionItem = ({ transaction, onPress, onLongPress }) => {
  const { categories, user } = useFinance();

  const category = categories.find(c => c.id === transaction.categoryId) || {
    name: 'General',
    icon: 'card-outline',
    color: '#64748B',
    bg: '#F1F5F9',
  };

  const isIncome = transaction.type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}${user.currency}${transaction.amount.toFixed(2)}`;

  return (
    <TouchableOpacity
      style={[styles.container, shadows.sm]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Category Icon */}
      <View style={[styles.iconContainer, { backgroundColor: category.bg }]}>
        <Ionicons name={category.icon || 'receipt-outline'} size={20} color={category.color} />
      </View>

      {/* Title & Category Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {transaction.title}
        </Text>
        <View style={styles.subInfoRow}>
          <Text style={[styles.categoryBadge, { color: category.color }]}>
            {category.name}
          </Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.dateText}>{transaction.date}</Text>
        </View>
      </View>

      {/* Amount & Time */}
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            { color: isIncome ? colors.incomeDark : colors.expenseDark },
          ]}
        >
          {formattedAmount}
        </Text>
        <Text style={styles.timeText}>{transaction.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  dotSeparator: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 5,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

