// Figma Design System Tokens for Finance Budget Tracker Mobile App
export const colors = {
  // Primary Fintech Brand Colors
  primary: '#4F46E5',        // Modern Indigo
  primaryDark: '#3730A3',    // Dark Indigo
  primaryLight: '#818CF8',   // Light Indigo
  primaryBg: '#EEF2FF',      // Very soft indigo tint

  // Secondary Accents
  accent: '#06B6D4',         // Cyan / Teal
  accentBg: '#ECFEFF',

  // Semantic Financial Colors
  income: '#10B981',         // Emerald Green for Income
  incomeBg: '#ECFDF5',
  incomeDark: '#047857',

  expense: '#F43F5E',        // Rose / Coral Red for Expense
  expenseBg: '#FFF1F2',
  expenseDark: '#BE123C',

  warning: '#F59E0B',        // Amber for budget warnings (> 80%)
  warningBg: '#FEF3C7',

  danger: '#EF4444',
  dangerBg: '#FEE2E2',

  // Surfaces & Backgrounds
  background: '#F8FAFC',     // Clean slate-50 background
  card: '#FFFFFF',           // Pure white cards
  cardAlt: '#F1F5F9',        // Secondary card background
  cardDark: '#0F172A',       // Deep Midnight card for Hero Balance

  // Text Colors
  textPrimary: '#0F172A',    // Dark slate text
  textSecondary: '#64748B',  // Slate gray
  textMuted: '#94A3B8',      // Light muted text
  textWhite: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Shadows
  shadowColor: '#0F172A',

  // Role Badges
  adminBadge: '#7C3AED',
  adminBadgeBg: '#F3E8FF',
  customerBadge: '#0D9488',
  customerBadgeBg: '#CCFBF1',
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 15, fontWeight: '500' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
  button: { fontSize: 16, fontWeight: '600' },
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHighlight: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
};

