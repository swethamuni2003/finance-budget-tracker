import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { PersonalizedAlertBanner } from '../components/PersonalizedAlertBanner';
import { TransactionItem } from '../components/TransactionItem';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export const CategoryDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params || {};
  const { categoryStats, user, updateCategory, selectedMonth } = useFinance();

  const category = categoryStats.find(c => c.id === categoryId) || categoryStats[0];

  const [editBudgetModal, setEditBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState(category ? String(category.budgetLimit) : '500');
  const [budgetError, setBudgetError] = useState('');

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOverBudget = category.spent > category.budgetLimit;
  const isNearLimit = category.percentSpent >= 80 && !isOverBudget;
  const barColor = isOverBudget ? colors.danger : isNearLimit ? colors.warning : category.color;

  const handleUpdateBudget = () => {
    const parsed = parseFloat(newBudget);
    if (!newBudget.trim() || isNaN(parsed) || parsed <= 0) {
      setBudgetError('Please enter a valid positive budget amount');
      return;
    }

    updateCategory(category.id, { budgetLimit: parsed });
    setEditBudgetModal(false);
    setBudgetError('');
    Alert.alert(
      'Budget Updated',
      `Allocated limit for ${category.name} has been set to ${user.currency}${parsed.toFixed(2)}.`
    );
  };

  return (
    <View style={styles.screenContainer}>
      {/* Top Custom Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.navBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {category.name}
        </Text>
        <TouchableOpacity
          style={styles.editIconBtn}
          onPress={() => setEditBudgetModal(true)}
        >
          <Ionicons name="pencil" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <PersonalizedAlertBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Hero Card */}
        <View style={[styles.heroCard, shadows.md]}>
          <View style={[styles.heroIconWrap, { backgroundColor: category.bg }]}>
            <Ionicons name={category.icon || 'folder'} size={32} color={category.color} />
          </View>

          <Text style={styles.heroName}>{category.name}</Text>
          <Text style={styles.heroDesc}>{category.description || 'Category budget'}</Text>
          <Text style={styles.monthBadgeText}>{selectedMonth}</Text>

          {/* Budget Progress Bar */}
          <View style={styles.meterContainer}>
            <View style={styles.meterRow}>
              <Text style={styles.meterSpent}>
                Spent: <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{user.currency}{category.spent.toFixed(2)}</Text>
              </Text>
              <Text style={styles.meterLimit}>
                Limit: <Text style={{ fontWeight: '700' }}>{user.currency}{category.budgetLimit.toFixed(2)}</Text>
              </Text>
            </View>

            <View style={styles.trackLarge}>
              <View
                style={[
                  styles.fillLarge,
                  {
                    width: `${Math.min(100, category.percentSpent)}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>

            <View style={styles.meterFooter}>
              <Text style={[styles.percentLabel, { color: barColor }]}>
                {category.percentSpent}% utilized
              </Text>
              <Text style={styles.remainingLabel}>
                {isOverBudget
                  ? `Over by ${user.currency}${(category.spent - category.budgetLimit).toFixed(2)}`
                  : `${user.currency}${category.remaining.toFixed(2)} remaining`}
              </Text>
            </View>
          </View>
        </View>

        {/* Warning Banner if Over Budget or Near Limit */}
        {isOverBudget && (
          <View style={styles.warningAlertBanner}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={styles.warningAlertText}>
              Budget Exceeded! You have spent {category.percentSpent}% of the allocated limit for {category.name}.
            </Text>
          </View>
        )}

        {isNearLimit && (
          <View style={[styles.warningAlertBanner, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <Ionicons name="warning-outline" size={20} color="#D97706" />
            <Text style={[styles.warningAlertText, { color: '#92400E' }]}>
              Notice: You have used {category.percentSpent}% of this category's budget limit.
            </Text>
          </View>
        )}

        {/* Action Button: Add Transaction in this category */}
        <CustomButton
          title={`+ Add Expense in ${category.name}`}
          onPress={() =>
            navigation.navigate('AddTransaction', { defaultCategoryId: category.id })
          }
          icon="add-circle-outline"
          style={{ marginHorizontal: 16, marginVertical: 10 }}
        />

        {/* Category Transactions Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            Category Transactions ({category.transactions?.length || 0})
          </Text>
          <Text style={styles.sectionSub}>All records under {category.name}</Text>
        </View>

        {category.transactions && category.transactions.length > 0 ? (
          category.transactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() => navigation.navigate('AddTransaction', { transaction: tx })}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Transactions in this Category</Text>
            <Text style={styles.emptySubtitle}>
              Tap the button above to log your first expense for {category.name}.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Budget Limit Modal */}
      <Modal
        visible={editBudgetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditBudgetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadows.lg]}>
            <Text style={styles.modalTitle}>Update Category Budget</Text>
            <Text style={styles.modalSub}>
              Set new allocated budget for {category.name}:
            </Text>

            <CustomInput
              label={`Monthly Limit (${user.currency}) *`}
              value={newBudget}
              onChangeText={setNewBudget}
              placeholder="e.g. 800.00"
              icon="cash-outline"
              keyboardType="decimal-pad"
              error={budgetError}
            />

            <View style={styles.modalBtnRow}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={() => setEditBudgetModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <CustomButton
                title="Save"
                onPress={handleUpdateBudget}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  navBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  editIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  monthBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 16,
  },
  meterContainer: {
    width: '100%',
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    padding: 14,
  },
  meterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meterSpent: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  meterLimit: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  trackLarge: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fillLarge: {
    height: '100%',
    borderRadius: 6,
  },
  meterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  remainingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  warningAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  warningAlertText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 18,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 2,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '90%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

