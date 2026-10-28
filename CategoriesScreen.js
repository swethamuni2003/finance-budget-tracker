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
import { Header } from '../components/Header';
import { PersonalizedAlertBanner } from '../components/PersonalizedAlertBanner';
import { CategoryProgressCard } from '../components/CategoryProgressCard';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const CategoriesScreen = () => {
  const navigation = useNavigation();
  const { user, categoryStats, addCategory, selectedMonth } = useFinance();

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'warning' | 'over'
  const [addModalVisible, setAddModalVisible] = useState(false);

  // New Category Form Fields
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('bookmark-outline');
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
  const [errors, setErrors] = useState({});

  const iconOptions = [
    'restaurant-outline',
    'cart-outline',
    'car-outline',
    'home-outline',
    'film-outline',
    'flash-outline',
    'fitness-outline',
    'book-outline',
    'airplane-outline',
    'gift-outline',
  ];

  const colorOptions = [
    { color: '#4F46E5', bg: '#EEF2FF' },
    { color: '#F43F5E', bg: '#FFF1F2' },
    { color: '#10B981', bg: '#ECFDF5' },
    { color: '#F59E0B', bg: '#FEF3C7' },
    { color: '#8B5CF6', bg: '#F5F3FF' },
    { color: '#06B6D4', bg: '#ECFEFF' },
  ];

  // Filter Categories
  const filteredCategories = categoryStats.filter(c => {
    if (filterMode === 'warning') return c.percentSpent >= 80 && !c.isOverBudget;
    if (filterMode === 'over') return c.isOverBudget;
    return true;
  });

  const totalAllocatedBudget = categoryStats.reduce((sum, c) => sum + c.budgetLimit, 0);
  const totalCategorySpent = categoryStats.reduce((sum, c) => sum + c.spent, 0);

  const validate = () => {
    const newErrors = {};
    if (!newCatName.trim()) {
      newErrors.name = 'Category name is required';
    } else if (newCatName.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!newCatBudget.trim()) {
      newErrors.budget = 'Budget limit is required';
    } else {
      const parsed = parseFloat(newCatBudget);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.budget = 'Budget must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = () => {
    if (!validate()) return;

    const chosenColorObj = colorOptions.find(c => c.color === selectedColor) || colorOptions[0];

    addCategory({
      name: newCatName.trim(),
      budgetLimit: parseFloat(newCatBudget),
      description: newCatDesc.trim(),
      icon: selectedIcon,
      color: chosenColorObj.color,
      bg: chosenColorObj.bg,
    });

    setAddModalVisible(false);
    setNewCatName('');
    setNewCatBudget('');
    setNewCatDesc('');
    setErrors({});

    Alert.alert('Category Added', `New category "${newCatName}" with budget ${user.currency}${newCatBudget} has been created.`);
  };

  return (
    <View style={styles.screenContainer}>
      <Header title="All Categories" subtitle="Budget Management" />
      <PersonalizedAlertBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overall Category Budget Summary Card */}
        <View style={[styles.overviewCard, shadows.sm]}>
          <Text style={styles.overviewTitle}>Overall Budget Distribution</Text>
          <Text style={styles.overviewSub}>Tracked across {categoryStats.length} spending categories for {selectedMonth}</Text>

          <View style={styles.overviewProgressTrack}>
            <View
              style={[
                styles.overviewProgressFill,
                {
                  width: `${Math.min(100, Math.round((totalCategorySpent / (totalAllocatedBudget || 1)) * 100))}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.overviewMetricsRow}>
            <View>
              <Text style={styles.overviewMetricLbl}>Total Spent</Text>
              <Text style={[styles.overviewMetricVal, { color: colors.expenseDark }]}>
                {user.currency}{totalCategorySpent.toFixed(2)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.overviewMetricLbl}>Allocated Budget</Text>
              <Text style={[styles.overviewMetricVal, { color: colors.textPrimary }]}>
                {user.currency}{totalAllocatedBudget.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.filterPill, filterMode === 'all' && styles.filterPillActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.filterPillText, filterMode === 'all' && styles.filterPillTextActive]}>
              All ({categoryStats.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filterMode === 'warning' && styles.filterPillActive]}
            onPress={() => setFilterMode('warning')}
          >
            <Text style={[styles.filterPillText, filterMode === 'warning' && styles.filterPillTextActive]}>
              Near Limit ({categoryStats.filter(c => c.percentSpent >= 80 && !c.isOverBudget).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filterMode === 'over' && styles.filterPillActive]}
            onPress={() => setFilterMode('over')}
          >
            <Text style={[styles.filterPillText, filterMode === 'over' && styles.filterPillTextActive]}>
              Over Budget ({categoryStats.filter(c => c.isOverBudget).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        <View style={styles.listContainer}>
          {filteredCategories.map(cat => (
            <CategoryProgressCard
              key={cat.id}
              category={cat}
              onPress={() => navigation.navigate('CategoryDetails', { categoryId: cat.id })}
            />
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Floating Add Category Button */}
      <TouchableOpacity
        style={[styles.fab, shadows.cardHighlight]}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Add Category Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, shadows.lg]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomInput
                label="Category Name *"
                value={newCatName}
                onChangeText={setNewCatName}
                placeholder="e.g. Subscriptions, Travel, Gym"
                icon="folder-outline"
                error={errors.name}
              />

              <CustomInput
                label={`Monthly Budget Limit (${user.currency}) *`}
                value={newCatBudget}
                onChangeText={setNewCatBudget}
                placeholder="e.g. 350.00"
                icon="cash-outline"
                keyboardType="decimal-pad"
                error={errors.budget}
              />

              <CustomInput
                label="Description (Optional)"
                value={newCatDesc}
                onChangeText={setNewCatDesc}
                placeholder="Brief notes about this category"
                icon="document-text-outline"
              />

              {/* Icon Picker */}
              <Text style={styles.pickerLabel}>Choose Category Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {iconOptions.map(iconName => (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.iconOption,
                      selectedIcon === iconName && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(iconName)}
                  >
                    <Ionicons
                      name={iconName}
                      size={20}
                      color={selectedIcon === iconName ? colors.primary : colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Color Picker */}
              <Text style={styles.pickerLabel}>Choose Color Accent</Text>
              <View style={styles.colorRow}>
                {colorOptions.map(c => (
                  <TouchableOpacity
                    key={c.color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c.color },
                      selectedColor === c.color && styles.colorCircleSelected,
                    ]}
                    onPress={() => setSelectedColor(c.color)}
                  >
                    {selectedColor === c.color && (
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <CustomButton
                title="Create Category"
                onPress={handleCreateCategory}
                icon="add-circle-outline"
                style={{ marginTop: 14, marginBottom: 20 }}
              />
            </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  overviewCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  overviewSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  overviewProgressTrack: {
    height: 10,
    backgroundColor: colors.cardAlt,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  overviewProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  overviewMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewMetricLbl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  overviewMetricVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  filterPillsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  listContainer: {
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 8,
  },
  pickerScroll: {
    marginBottom: 12,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
});

