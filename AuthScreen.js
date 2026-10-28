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

export const AuthScreen = () => {
  const navigation = useNavigation();
  const { signIn, signUp, user } = useFinance();

  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Admin'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isSignUp) {
      signUp(name.trim(), email.trim(), password, role);
      Alert.alert(
        'Account Created Successfully!',
        `Welcome ${name}! You are registered as ${role}. You can now start tracking budgets.`,
        [{ text: 'Continue to App', onPress: () => navigation.goBack() }]
      );
    } else {
      signIn(email.trim(), password, role);
      Alert.alert(
        'Sign In Successful',
        `Welcome back! Logged in as ${role} (${email}).`,
        [{ text: 'Continue', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleQuickDemoFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Admin') {
      setEmail('admin.scs@rvscollege.ac.in');
      setPassword('admin123');
      setName('Prof. R. Sundaram');
    } else {
      setEmail('arun.mca@rvscollege.ac.in');
      setPassword('customer123');
      setName('Arun Kumar');
    }
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Brand Hero */}
        <View style={styles.brandHero}>
          <View style={[styles.iconContainer, shadows.cardHighlight]}>
            <Ionicons name="wallet" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.appTitle}>Finance Budget Tracker</Text>
          <Text style={styles.collegeSubtitle}>
            RVS College SCS - MCA Mobile App Lab
          </Text>
        </View>

        {/* Auth Toggle Tabs (Sign In vs Sign Up) */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            style={[styles.tabButton, !isSignUp && styles.tabButtonActive]}
            onPress={() => {
              setIsSignUp(false);
              setErrors({});
            }}
          >
            <Text style={[styles.tabButtonText, !isSignUp && styles.tabButtonTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, isSignUp && styles.tabButtonActive]}
            onPress={() => {
              setIsSignUp(true);
              setErrors({});
            }}
          >
            <Text style={[styles.tabButtonText, isSignUp && styles.tabButtonTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Role Selector (Customer vs Admin) */}
        <Text style={styles.roleLabel}>Select User Account Role:</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              role === 'Customer' && styles.roleCardActiveCustomer,
            ]}
            onPress={() => setRole('Customer')}
          >
            <Ionicons
              name="person"
              size={20}
              color={role === 'Customer' ? '#0D9488' : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleText,
                role === 'Customer' && { color: '#0D9488', fontWeight: '700' },
              ]}
            >
              Customer
            </Text>
            <Text style={styles.roleSubtext}>Manage budget & personal spends</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              role === 'Admin' && styles.roleCardActiveAdmin,
            ]}
            onPress={() => setRole('Admin')}
          >
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={role === 'Admin' ? '#7C3AED' : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleText,
                role === 'Admin' && { color: '#7C3AED', fontWeight: '700' },
              ]}
            >
              Admin
            </Text>
            <Text style={styles.roleSubtext}>System stats & analytics audit</Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {isSignUp && (
            <CustomInput
              label="Full Name *"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Arun Kumar"
              icon="person-outline"
              error={errors.name}
              autoCapitalize="words"
            />
          )}

          <CustomInput
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. user@rvscollege.ac.in"
            icon="mail-outline"
            error={errors.email}
            keyboardType="email-address"
          />

          <CustomInput
            label="Password *"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter secure password (min 6 chars)"
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
          />

          {isSignUp && (
            <CustomInput
              label="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              icon="shield-outline"
              secureTextEntry
              error={errors.confirmPassword}
            />
          )}

          <CustomButton
            title={isSignUp ? `Create ${role} Account` : `Sign In as ${role}`}
            onPress={handleSubmit}
            icon={isSignUp ? 'person-add-outline' : 'log-in-outline'}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* Quick Demo Login Preset Buttons for Exam Evaluator */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Exam Evaluation Quick Access:</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoPill, { backgroundColor: '#CCFBF1' }]}
              onPress={() => handleQuickDemoFill('Customer')}
            >
              <Ionicons name="person" size={14} color="#0F766E" />
              <Text style={[styles.demoPillText, { color: '#0F766E' }]}>Fill Customer Demo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoPill, { backgroundColor: '#F3E8FF' }]}
              onPress={() => handleQuickDemoFill('Admin')}
            >
              <Ionicons name="shield-checkmark" size={14} color="#6B21A8" />
              <Text style={[styles.demoPillText, { color: '#6B21A8' }]}>Fill Admin Demo</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  collegeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardAlt,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  roleCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  roleCardActiveCustomer: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  roleCardActiveAdmin: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 6,
    marginBottom: 2,
  },
  roleSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 20,
  },
  demoSection: {
    backgroundColor: colors.cardAlt,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

