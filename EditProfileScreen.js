import React, { useState } from 'react';
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
import { useFinance } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateProfile } = useFinance();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [monthlyBudget, setMonthlyBudget] = useState(String(user.monthlyBudget || '5000'));
  const [bio, setBio] = useState(user.bio || '');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = phone.replace(/[^0-9]/g, '');

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneClean.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!monthlyBudget.trim()) {
      newErrors.monthlyBudget = 'Monthly budget is required';
    } else {
      const parsed = parseFloat(monthlyBudget);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.monthlyBudget = 'Budget must be a positive number greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      monthlyBudget: parseFloat(monthlyBudget),
      bio: bio.trim(),
    });

    Alert.alert(
      'Profile Updated Successfully',
      `Hello ${name.trim()}! Your profile details and monthly budget (${user.currency}${parseFloat(monthlyBudget).toFixed(2)}) have been saved.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Customer Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, shadows.sm]}>
          <Text style={styles.sectionSubtitle}>Personal & Academic Details</Text>

          <CustomInput
            label="Full Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            icon="person-outline"
            error={errors.name}
            autoCapitalize="words"
          />

          <CustomInput
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. arun.mca@rvscollege.ac.in"
            icon="mail-outline"
            error={errors.email}
            keyboardType="email-address"
          />

          <CustomInput
            label="Phone Number (10 digits) *"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            icon="call-outline"
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <CustomInput
            label={`Monthly Budget Limit (${user.currency}) *`}
            value={monthlyBudget}
            onChangeText={setMonthlyBudget}
            placeholder="e.g. 5000"
            icon="wallet-outline"
            error={errors.monthlyBudget}
            keyboardType="decimal-pad"
          />

          <CustomInput
            label="Student Bio & Notes"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about your degree and budgeting goals..."
            icon="document-text-outline"
            multiline
            numberOfLines={3}
          />

          <CustomButton
            title="Save Profile Changes"
            onPress={handleSave}
            icon="checkmark-circle-outline"
            style={{ marginTop: 10 }}
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
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
});

