import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import { useNavigation } from '@react-navigation/native';

export const AlertsHistoryModal = () => {
  const navigation = useNavigation();
  const { alertsHistory, user } = useFinance();

  return (
    <View style={styles.screenContainer}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Personalized Alert Log</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.infoBannerText}>
          Part-III (ii) Personalized Alerts logged for {user.name} ({user.role}).
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {alertsHistory.length > 0 ? (
          alertsHistory.map((alert, index) => {
            const isSuccess = alert.type === 'success';
            const isWarning = alert.type === 'warning';
            const iconName = isSuccess
              ? 'checkmark-circle'
              : isWarning
              ? 'alert-circle'
              : 'notifications';
            const iconColor = isSuccess
              ? colors.incomeDark
              : isWarning
              ? '#D97706'
              : colors.primary;
            const bg = isSuccess
              ? colors.incomeBg
              : isWarning
              ? colors.warningBg
              : colors.primaryBg;

            return (
              <View key={alert.id || index} style={[styles.alertCard, shadows.sm]}>
                <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                  <Ionicons name={iconName} size={22} color={iconColor} />
                </View>

                <View style={styles.alertContent}>
                  <View style={styles.topRow}>
                    <Text style={[styles.alertTitle, { color: iconColor }]}>
                      {alert.title}
                    </Text>
                    <Text style={styles.alertTime}>{alert.timestamp}</Text>
                  </View>
                  <Text style={styles.alertMsg}>{alert.message}</Text>
                  <Text style={styles.alertRecipient}>
                    Recipient: <Text style={{ fontWeight: '600' }}>{alert.userName}</Text>
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Alerts Yet</Text>
            <Text style={styles.emptySubtitle}>
              Make changes to transactions to trigger real-time personalized alert messages.
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  alertCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  alertTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  alertMsg: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  alertRecipient: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
});

