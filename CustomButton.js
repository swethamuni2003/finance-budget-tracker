import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  icon,
  iconRight,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const getBackgroundColor = () => {
    if (disabled) return '#CBD5E1';
    if (isPrimary) return colors.primary;
    if (isSecondary) return colors.cardAlt;
    if (isOutline || isGhost) return 'transparent';
    if (isDanger) return colors.expense;
    return colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    if (isPrimary || isDanger) return '#FFFFFF';
    if (isSecondary) return colors.textPrimary;
    if (isOutline) return colors.primary;
    if (isGhost) return colors.textSecondary;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outlineBorder,
        isPrimary && !disabled && shadows.md,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={getTextColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[styles.buttonText, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
          {iconRight && (
            <Ionicons
              name={iconRight}
              size={18}
              color={getTextColor()}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

