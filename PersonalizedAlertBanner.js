import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

export const PersonalizedAlertBanner = () => {
  const { activeAlert, dismissActiveAlert } = useFinance();

  if (!activeAlert) return null;

  const isSuccess = activeAlert.type === 'success';
  const isWarning = activeAlert.type === 'warning';

  const badgeBg = isSuccess ? colors.incomeBg : isWarning ? colors.warningBg : colors.primaryBg;
  const badgeBorder = isSuccess ? colors.income : isWarning ? colors.warning : colors.primary;
  const iconName = isSuccess ? 'checkmark-circle' : isWarning ? 'alert-circle' : 'notifications';
  const iconColor = isSuccess ? colors.incomeDark : isWarning ? '#D97706' : colors.primary;

  return (
    <View style={[styles.container, shadows.md, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.alertTitle, { color: iconColor }]}>
            {activeAlert.title || 'Personalized Alert'}
          </Text>
          <Text style={styles.timestamp}>{activeAlert.timestamp || 'Just now'}</Text>
        </View>
        <Text style={styles.messageText}>{activeAlert.message}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={dismissActiveAlert}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textMuted,
  },
  messageText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    fontWeight: '500',
  },
  closeBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

