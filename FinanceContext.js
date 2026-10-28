import React, { createContext, useContext, useState, useMemo } from 'react';

const FinanceContext = createContext();

// Initial Mock Categories
const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Food & Dining',
    icon: 'restaurant-outline',
    color: '#F43F5E',
    bg: '#FFF1F2',
    budgetLimit: 1200,
    description: 'Groceries, Cafes, Restaurants & Takeouts',
  },
  {
    id: 'cat-2',
    name: 'Shopping',
    icon: 'cart-outline',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    budgetLimit: 800,
    description: 'Clothing, Electronics, Books & Goods',
  },
  {
    id: 'cat-3',
    name: 'Housing & Rent',
    icon: 'home-outline',
    color: '#3B82F6',
    bg: '#EFF6FF',
    budgetLimit: 1500,
    description: 'Apartment rent, maintenance, home repairs',
  },
  {
    id: 'cat-4',
    name: 'Transportation',
    icon: 'car-outline',
    color: '#F59E0B',
    bg: '#FEF3C7',
    budgetLimit: 450,
    description: 'Fuel, Metro tickets, Uber, Bus passes',
  },
  {
    id: 'cat-5',
    name: 'Entertainment',
    icon: 'film-outline',
    color: '#EC4899',
    bg: '#FDF2F8',
    budgetLimit: 400,
    description: 'Movies, Netflix, Concerts, Games',
  },
  {
    id: 'cat-6',
    name: 'Utilities & Bills',
    icon: 'flash-outline',
    color: '#06B6D4',
    bg: '#ECFEFF',
    budgetLimit: 350,
    description: 'Electricity, High-speed Wifi, Water, Gas',
  },
  {
    id: 'cat-7',
    name: 'Healthcare',
    icon: 'fitness-outline',
    color: '#10B981',
    bg: '#ECFDF5',
    budgetLimit: 300,
    description: 'Pharmacy, Doctor visits, Health Insurance',
  },
  {
    id: 'cat-8',
    name: 'Salary & Income',
    icon: 'wallet-outline',
    color: '#059669',
    bg: '#D1FAE5',
    budgetLimit: 7500,
    description: 'Monthly payroll, freelance gigs, dividends',
  },
];

// Initial Mock Transactions (October 2026, September 2026, August 2026)
const INITIAL_TRANSACTIONS = [
  // October 2026 (Current Active Month)
  {
    id: 'tx-101',
    title: 'Monthly Salary Credit',
    amount: 5200.0,
    type: 'income',
    categoryId: 'cat-8',
    month: 'October 2026',
    date: '2026-10-01',
    time: '09:00 AM',
    notes: 'Cognizant Monthly Tech Stipend / Salary',
    userRole: 'Customer',
  },
  {
    id: 'tx-102',
    title: 'Apartment Monthly Rent',
    amount: 1250.0,
    type: 'expense',
    categoryId: 'cat-3',
    month: 'October 2026',
    date: '2026-10-02',
    time: '11:30 AM',
    notes: '2BHK Apartment Rent to Landlord',
    userRole: 'Customer',
  },
  {
    id: 'tx-103',
    title: 'Supermarket Grocery Haul',
    amount: 245.5,
    type: 'expense',
    categoryId: 'cat-1',
    month: 'October 2026',
    date: '2026-10-05',
    time: '06:15 PM',
    notes: 'Weekly organic produce & supplies',
    userRole: 'Customer',
  },
  {
    id: 'tx-104',
    title: 'Freelance React Native App UI',
    amount: 850.0,
    type: 'income',
    categoryId: 'cat-8',
    month: 'October 2026',
    date: '2026-10-12',
    time: '03:45 PM',
    notes: 'Milestone 1 Payment for Client App',
    userRole: 'Customer',
  },
  {
    id: 'tx-105',
    title: 'Electricity & Fiber Wifi Bill',
    amount: 140.0,
    type: 'expense',
    categoryId: 'cat-6',
    month: 'October 2026',
    date: '2026-10-14',
    time: '10:00 AM',
    notes: 'ACT Fibernet 300Mbps & TNEB Power',
    userRole: 'Customer',
  },
  {
    id: 'tx-106',
    title: 'New Wireless Headphones',
    amount: 199.99,
    type: 'expense',
    categoryId: 'cat-2',
    month: 'October 2026',
    date: '2026-10-18',
    time: '04:20 PM',
    notes: 'Sony WH-CH720N Noise Canceling',
    userRole: 'Customer',
  },
  {
    id: 'tx-107',
    title: 'Weekend Dining with Friends',
    amount: 120.0,
    type: 'expense',
    categoryId: 'cat-1',
    month: 'October 2026',
    date: '2026-10-24',
    time: '08:45 PM',
    notes: 'Barbeque Nation Dinner Treat',
    userRole: 'Customer',
  },
  {
    id: 'tx-108',
    title: 'Fuel Petrol Tank Full',
    amount: 75.0,
    type: 'expense',
    categoryId: 'cat-4',
    month: 'October 2026',
    date: '2026-10-26',
    time: '08:15 AM',
    notes: 'HP Fuel Station Premium Petrol',
    userRole: 'Customer',
  },
  {
    id: 'tx-109',
    title: 'Movie Tickets & Popcorn',
    amount: 45.0,
    type: 'expense',
    categoryId: 'cat-5',
    month: 'October 2026',
    date: '2026-10-27',
    time: '07:00 PM',
    notes: 'IMAX Sci-Fi Movie Night',
    userRole: 'Customer',
  },
  {
    id: 'tx-110',
    title: 'Medical Prescription & Vitamins',
    amount: 65.0,
    type: 'expense',
    categoryId: 'cat-7',
    month: 'October 2026',
    date: '2026-10-28',
    time: '11:00 AM',
    notes: 'Apollo Pharmacy Health Supplements',
    userRole: 'Customer',
  },

  // September 2026
  {
    id: 'tx-201',
    title: 'September Salary Credit',
    amount: 5200.0,
    type: 'income',
    categoryId: 'cat-8',
    month: 'September 2026',
    date: '2026-09-01',
    time: '09:00 AM',
    notes: 'Cognizant Monthly Stipend',
    userRole: 'Customer',
  },
  {
    id: 'tx-202',
    title: 'House Rent September',
    amount: 1250.0,
    type: 'expense',
    categoryId: 'cat-3',
    month: 'September 2026',
    date: '2026-09-02',
    time: '10:00 AM',
    notes: 'Monthly Apartment Rent',
    userRole: 'Customer',
  },
  {
    id: 'tx-203',
    title: 'Shopping Festive Sale',
    amount: 380.0,
    type: 'expense',
    categoryId: 'cat-2',
    month: 'September 2026',
    date: '2026-09-15',
    time: '02:30 PM',
    notes: 'Amazon Great Indian Festival Sale',
    userRole: 'Customer',
  },
  {
    id: 'tx-204',
    title: 'Dining & Food Outing',
    amount: 290.0,
    type: 'expense',
    categoryId: 'cat-1',
    month: 'September 2026',
    date: '2026-09-22',
    time: '09:15 PM',
    notes: 'Family Celebration Dinner',
    userRole: 'Customer',
  },

  // August 2026
  {
    id: 'tx-301',
    title: 'August Salary Credit',
    amount: 5200.0,
    type: 'income',
    categoryId: 'cat-8',
    month: 'August 2026',
    date: '2026-08-01',
    time: '09:00 AM',
    notes: 'Monthly Salary Credit',
    userRole: 'Customer',
  },
  {
    id: 'tx-302',
    title: 'House Rent August',
    amount: 1250.0,
    type: 'expense',
    categoryId: 'cat-3',
    month: 'August 2026',
    date: '2026-08-03',
    time: '11:00 AM',
    notes: 'Monthly Rent',
    userRole: 'Customer',
  },
  {
    id: 'tx-303',
    title: 'College Semester Project Materials',
    amount: 210.0,
    type: 'expense',
    categoryId: 'cat-2',
    month: 'August 2026',
    date: '2026-08-14',
    time: '04:00 PM',
    notes: 'Books and dev test devices',
    userRole: 'Customer',
  },
];

export const AVAILABLE_MONTHS = [
  'October 2026',
  'September 2026',
  'August 2026',
  'July 2026',
];

export const FinanceProvider = ({ children }) => {
  // Current active user & role
  const [user, setUser] = useState({
    id: 'usr-1',
    name: 'Arun Kumar',
    email: 'arun.mca@rvscollege.ac.in',
    role: 'Customer', // 'Customer' | 'Admin'
    phone: '+91 98765 43210',
    monthlyBudget: 5000,
    currency: '$',
    bio: 'RVS College SCS - MCA 2025 Batch | Mobile App Dev Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    joinedDate: 'October 2025',
  });

  // Admin user details
  const [adminProfile] = useState({
    id: 'adm-1',
    name: 'Prof. R. Sundaram',
    email: 'admin.scs@rvscollege.ac.in',
    role: 'Admin',
    department: 'School of Computer Studies (SCS) - MCA',
    college: 'RVS College of Arts and Science (Autonomous)',
    accessLevel: 'Super Administrator',
  });

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Personalized Alert State (Requirement Part-III (ii))
  const [activeAlert, setActiveAlert] = useState(null);
  const [alertsHistory, setAlertsHistory] = useState([
    {
      id: 'alt-1',
      type: 'info',
      title: 'Welcome to Budget Tracker',
      message: 'Hello Arun Kumar! Welcome to your personal finance dashboard for October 2026.',
      userName: 'Arun Kumar',
      timestamp: 'Today at 09:00 AM',
      read: false,
    },
    {
      id: 'alt-2',
      type: 'warning',
      title: 'Budget Alert (Housing & Rent)',
      message: 'Hey Arun Kumar! You have utilized 83.3% of your Housing & Rent budget for October 2026.',
      userName: 'Arun Kumar',
      timestamp: 'Oct 02, 2026',
      read: true,
    },
  ]);

  // Helper to trigger a personalized alert on transaction change
  const triggerPersonalizedAlert = (actionType, tx) => {
    const userName = user.name || 'Valued User';
    let messageText = '';
    let alertType = 'info';

    const formattedAmount = `${user.currency}${Number(tx.amount || 0).toFixed(2)}`;

    if (actionType === 'ADD') {
      messageText = `✨ Hello ${userName}! Your ${tx.type.toUpperCase()} transaction "${tx.title}" of ${formattedAmount} has been recorded for ${tx.month}.`;
      alertType = tx.type === 'income' ? 'success' : 'info';
    } else if (actionType === 'UPDATE') {
      messageText = `✏️ Hello ${userName}! Your transaction "${tx.title}" was successfully updated with new amount ${formattedAmount}.`;
      alertType = 'info';
    } else if (actionType === 'DELETE') {
      messageText = `🗑️ Hello ${userName}! Transaction "${tx.title}" (${formattedAmount}) was removed from your records.`;
      alertType = 'warning';
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      type: alertType,
      title: `Transaction ${actionType === 'ADD' ? 'Added' : actionType === 'UPDATE' ? 'Updated' : 'Deleted'}`,
      message: messageText,
      userName: userName,
      timestamp: 'Just now',
      read: false,
    };

    setActiveAlert(newAlert);
    setAlertsHistory(prev => [newAlert, ...prev]);

    // Auto dismiss active banner after 4.5 seconds
    setTimeout(() => {
      setActiveAlert(current => (current?.id === newAlert.id ? null : current));
    }, 4500);
  };

  const dismissActiveAlert = () => {
    setActiveAlert(null);
  };

  // Add Transaction
  const addTransaction = (txData) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      title: txData.title.trim(),
      amount: parseFloat(txData.amount),
      type: txData.type,
      categoryId: txData.categoryId,
      month: txData.month || selectedMonth,
      date: txData.date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: txData.notes || '',
      userRole: user.role,
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerPersonalizedAlert('ADD', newTx);
    return newTx;
  };

  // Update Transaction
  const updateTransaction = (id, txData) => {
    let updatedTx = null;
    setTransactions(prev =>
      prev.map(item => {
        if (item.id === id) {
          updatedTx = {
            ...item,
            ...txData,
            amount: parseFloat(txData.amount),
          };
          return updatedTx;
        }
        return item;
      })
    );
    if (updatedTx) {
      triggerPersonalizedAlert('UPDATE', updatedTx);
    }
    return updatedTx;
  };

  // Delete Transaction
  const deleteTransaction = (id) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (txToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      triggerPersonalizedAlert('DELETE', txToDelete);
    }
  };

  // Add Category
  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      icon: categoryData.icon || 'folder-outline',
      color: categoryData.color || '#4F46E5',
      bg: categoryData.bg || '#EEF2FF',
      budgetLimit: parseFloat(categoryData.budgetLimit) || 500,
      description: categoryData.description || 'Custom category',
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  // Update Category
  const updateCategory = (id, updateData) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updateData, budgetLimit: parseFloat(updateData.budgetLimit) } : c))
    );
  };

  // Update Profile
  const updateProfile = (profileData) => {
    setUser(prev => ({
      ...prev,
      ...profileData,
      monthlyBudget: parseFloat(profileData.monthlyBudget) || prev.monthlyBudget,
    }));
  };

  // Role Switcher & Auth helpers
  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'Admin' ? 'Prof. R. Sundaram (Admin)' : 'Arun Kumar',
      email: newRole === 'Admin' ? 'admin.scs@rvscollege.ac.in' : 'arun.mca@rvscollege.ac.in',
    }));
  };

  const signIn = (email, password, role) => {
    const userName = role === 'Admin' ? 'Prof. R. Sundaram (Admin)' : email.split('@')[0];
    setUser(prev => ({
      ...prev,
      email,
      name: userName,
      role: role || 'Customer',
    }));
  };

  const signUp = (name, email, password, role) => {
    setUser(prev => ({
      ...prev,
      name,
      email,
      role: role || 'Customer',
    }));
  };

  // Computed Financial Metrics for Selected Month
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => t.month === selectedMonth);
  }, [transactions, selectedMonth]);

  const monthFinancials = useMemo(() => {
    let income = 0;
    let expense = 0;

    currentMonthTransactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    const netBalance = income - expense;
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    return {
      income,
      expense,
      netBalance,
      savingsRate,
      transactionCount: currentMonthTransactions.length,
    };
  }, [currentMonthTransactions]);

  // Daily, Weekly, Monthly Reports for Home Screen (Requirement Part-III (iii))
  const reports = useMemo(() => {
    // Reference date: 2026-10-28
    const todayStr = '2026-10-28';

    // Daily calculation
    const dailyTx = transactions.filter(t => t.date === todayStr);
    const dailyIncome = dailyTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const dailyExpense = dailyTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Weekly calculation (Transactions in the past 7 days: Oct 22 to Oct 28)
    const weeklyTx = transactions.filter(t => {
      return t.month === 'October 2026' && t.date >= '2026-10-22' && t.date <= '2026-10-28';
    });
    const weeklyIncome = weeklyTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const weeklyExpense = weeklyTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Day-by-day weekly breakdown (Mon-Sun)
    const weekDays = [
      { day: 'Thu', date: '2026-10-22', spent: 0 },
      { day: 'Fri', date: '2026-10-23', spent: 0 },
      { day: 'Sat', date: '2026-10-24', spent: 120 },
      { day: 'Sun', date: '2026-10-25', spent: 0 },
      { day: 'Mon', date: '2026-10-26', spent: 75 },
      { day: 'Tue', date: '2026-10-27', spent: 45 },
      { day: 'Wed', date: '2026-10-28', spent: 65 },
    ];

    return {
      daily: {
        title: "Today's Financial Summary",
        periodLabel: 'Today (28 Oct 2026)',
        income: dailyIncome,
        expense: dailyExpense,
        balance: dailyIncome - dailyExpense,
        transactions: dailyTx,
        count: dailyTx.length,
      },
      weekly: {
        title: 'Weekly Financial Pulse',
        periodLabel: 'Past 7 Days (22 - 28 Oct)',
        income: weeklyIncome,
        expense: weeklyExpense,
        balance: weeklyIncome - weeklyExpense,
        transactions: weeklyTx,
        days: weekDays,
        count: weeklyTx.length,
      },
      monthly: {
        title: 'Monthly Budget & Cash Flow',
        periodLabel: selectedMonth,
        income: monthFinancials.income,
        expense: monthFinancials.expense,
        balance: monthFinancials.netBalance,
        transactions: currentMonthTransactions,
        budgetLimit: user.monthlyBudget,
        budgetRemaining: Math.max(0, user.monthlyBudget - monthFinancials.expense),
        savingsRate: monthFinancials.savingsRate,
        count: monthFinancials.transactionCount,
      },
    };
  }, [transactions, selectedMonth, monthFinancials, user.monthlyBudget]);

  // Category breakdown calculations
  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const catTransactions = currentMonthTransactions.filter(t => t.categoryId === cat.id);
      const spent = catTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const incomeReceived = catTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const percentSpent = cat.budgetLimit > 0 ? Math.min(100, Math.round((spent / cat.budgetLimit) * 100)) : 0;
      const remaining = Math.max(0, cat.budgetLimit - spent);
      const isOverBudget = spent > cat.budgetLimit;

      return {
        ...cat,
        spent,
        incomeReceived,
        percentSpent,
        remaining,
        isOverBudget,
        transactionCount: catTransactions.length,
        transactions: catTransactions,
      };
    });
  }, [categories, currentMonthTransactions]);

  // Admin platform aggregate stats
  const adminStats = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalPlatformVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalCustomers = 42; // mock count of registered MCA student accounts
    const activeBudgets = 38;
    const systemCategories = categories.length;

    return {
      totalTransactions,
      totalPlatformVolume,
      totalCustomers,
      activeBudgets,
      systemCategories,
    };
  }, [transactions, categories]);

  return (
    <FinanceContext.Provider
      value={{
        user,
        adminProfile,
        selectedMonth,
        setSelectedMonth,
        categories,
        transactions,
        currentMonthTransactions,
        monthFinancials,
        reports,
        categoryStats,
        adminStats,
        activeAlert,
        alertsHistory,
        triggerPersonalizedAlert,
        dismissActiveAlert,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        updateProfile,
        switchRole,
        signIn,
        signUp,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

