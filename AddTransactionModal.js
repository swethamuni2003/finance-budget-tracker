import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useFinance, AVAILABLE_MONTHS } from '../context/FinanceContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export const AddTransactionModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categories, addTransaction, updateTransaction, selectedMonth, user } = useFinance();

  const editItem = route.params?.transaction;
  const initialCategoryId = route.params?.defaultCategoryId;

  const [title, setTitle] = useState(editItem ? editItem.title : '');
  const [amount, setAmount] = useState(editItem ? String(editItem.amount) : '');
  const [type, setType] = useState(editItem ? editItem.type : 'expense'); // 'expense' | 'income'
  const [categoryId, setCategoryId] = useState(
    editItem ? editItem.categoryId : initialCategoryId || categories[0]?.id || 'cat-1'
  );
  const [month, setMonth] = useState(editItem ? editItem.month : selectedMonth);
  const [notes, setNotes] = useState(editItem ? editItem.notes : '');
  const [date, setDate] = useState(
    editItem ? editItem.date : new Date().toISOString().split('T')[0]
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Transaction title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.amount = 'Enter a valid positive amount (e.g. 50.00)';
      }
    }

    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editItem) {
      updateTransaction(editItem.id, {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        categoryId,
        month,
        notes: notes.trim(),
        date,
      });
      navigation.goBack();
    } else {
      addTransaction({
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        categoryId,
        month,
        notes: notes.trim(),
        date,
      });
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editItem ? 'Edit Transaction' : 'New Transaction'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Income vs Expense Toggle */}
        <View style={styles.typeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === 'expense' && styles.typeBtnExpenseActive,
            ]}
            onPress={() => setType('expense')}
          >
            <Ionicons
              name="arrow-up-circle"
              size={18}
              color={type === 'expense' ? '#FFF' : colors.expense}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.typeBtnText,
                type === 'expense' && styles.typeBtnTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === 'income' && styles.typeBtnIncomeActive,
            ]}
            onPress={() => setType('income')}
          >
            <Ionicons
              name="arrow-down-circle"
              size={18}
              color={type === 'income' ? '#FFF' : colors.income}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.typeBtnText,
                type === 'income' && styles.typeBtnTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.formCard}>
          <CustomInput
            label="Transaction Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Grocery Supermarket, Rent, Movie"
            icon="create-outline"
            error={errors.title}
          />

          <CustomInput
            label={`Amount (${user.currency}) *`}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            icon="cash-outline"
            keyboardType="decimal-pad"
            error={errors.amount}
          />

          {/* Month Selection */}
          <Text style={styles.fieldLabel}>Select Month *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {AVAILABLE_MONTHS.map(m => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.monthChip,
                  month === m && styles.monthChipActive,
                ]}
                onPress={() => setMonth(m)}
              >
                <Text
                  style={[
                    styles.monthChipText,
                    month === m && styles.monthChipTextActive,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Category Selector */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Select Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map(cat => {
              const isSelected = categoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    isSelected && { borderColor: cat.color, backgroundColor: cat.bg },
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
                    <Ionicons name={cat.icon} size={16} color={cat.color} />
                  </View>
                  <Text
                    style={[
                      styles.catChipText,
                      isSelected && { color: cat.color, fontWeight: '700' },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.categoryId ? (
            <Text style={styles.errorText}>{errors.categoryId}</Text>
          ) : null}

          {/* Date & Notes */}
          <CustomInput
            label="Transaction Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            icon="calendar-outline"
          />

          <CustomInput
            label="Notes / Description (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add details, receipt reference, or tags..."
            icon="document-text-outline"
            multiline
            numberOfLines={3}
          />

          {/* Submit Button */}
          <CustomButton
            title={editItem ? 'Save Changes' : 'Record Transaction'}
            onPress={handleSave}
            icon={editItem ? 'checkmark-circle-outline' : 'add-circle-outline'}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 30,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  typeBtnExpenseActive: {
    backgroundColor: colors.expense,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.income,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  chipsScroll: {
    marginBottom: 14,
  },
  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthChipTextActive: {
    color: '#FFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: '45%',
    flex: 1,
  },
  catIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  catChipText: {
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
});

