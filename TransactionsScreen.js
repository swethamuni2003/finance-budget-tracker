import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { Header } from '../components/Header';
import { PersonalizedAlertBanner } from '../components/PersonalizedAlertBanner';
import { TransactionItem } from '../components/TransactionItem';
import { useFinance, AVAILABLE_MONTHS } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const TransactionsScreen = () => {
  const navigation = useNavigation();
  const {
    user,
    selectedMonth,
    setSelectedMonth,
    transactions,
    deleteTransaction,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'

  // Filter transactions month-wise first, then apply search and type
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchMonth = t.month === selectedMonth;
      const matchType = filterType === 'all' || t.type === filterType;
      const matchSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchMonth && matchType && matchSearch;
    });
  }, [transactions, selectedMonth, filterType, searchQuery]);

  // Month stats for selected month
  const monthStats = useMemo(() => {
    const monthTx = transactions.filter(t => t.month === selectedMonth);
    const inc = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const exp = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { inc, exp, count: monthTx.length };
  }, [transactions, selectedMonth]);

  const handleTransactionAction = (tx) => {
    Alert.alert(
      tx.title,
      `${tx.type.toUpperCase()}: ${user.currency}${tx.amount.toFixed(2)}\nDate: ${tx.date} (${tx.time})\nNotes: ${tx.notes || 'None'}`,
      [
        {
          text: 'Edit',
          onPress: () => navigation.navigate('AddTransaction', { transaction: tx }),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              `Are you sure you want to delete "${tx.title}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteTransaction(tx.id),
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Header title="Transactions" subtitle="Month-Wise History" />
      <PersonalizedAlertBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Tabs Bar (Month-wise Requirement Part-I (4)) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthScrollView}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {AVAILABLE_MONTHS.map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.monthTab,
                selectedMonth === m && styles.monthTabActive,
              ]}
              onPress={() => setSelectedMonth(m)}
            >
              <Ionicons
                name="calendar-outline"
                size={14}
                color={selectedMonth === m ? '#FFF' : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.monthTabText,
                  selectedMonth === m && styles.monthTabTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Month Overview Mini Capsule */}
        <View style={[styles.monthSummaryCard, shadows.sm]}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Month Income</Text>
            <Text style={[styles.summaryVal, { color: colors.incomeDark }]}>
              +{user.currency}{monthStats.inc.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Month Expenses</Text>
            <Text style={[styles.summaryVal, { color: colors.expenseDark }]}>
              -{user.currency}{monthStats.exp.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Records</Text>
            <Text style={styles.summaryVal}>{filteredTransactions.length}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectedMonth} transactions...`}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips: All | Expense | Income */}
        <View style={styles.typeFilterRow}>
          {['all', 'expense', 'income'].map(t => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeFilterChip,
                filterType === t && styles.typeFilterChipActive,
              ]}
              onPress={() => setFilterType(t)}
            >
              <Text
                style={[
                  styles.typeFilterText,
                  filterType === t && styles.typeFilterTextActive,
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              {selectedMonth} ({filteredTransactions.length})
            </Text>
            <Text style={styles.listHeaderHint}>Tap for details / Edit / Delete</Text>
          </View>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(tx => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() => handleTransactionAction(tx)}
                onLongPress={() => handleTransactionAction(tx)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                No transaction match your filter for {selectedMonth}.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Floating Add Transaction Button */}
      <TouchableOpacity
        style={[styles.fab, shadows.cardHighlight]}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
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
  monthScrollView: {
    paddingVertical: 10,
  },
  monthTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthTabTextActive: {
    color: '#FFF',
  },
  monthSummaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  typeFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  typeFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  typeFilterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  typeFilterTextActive: {
    color: '#FFF',
  },
  listSection: {
    marginTop: 4,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 6,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listHeaderHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
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
});

