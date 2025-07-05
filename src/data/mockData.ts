import { Account, Transaction, Category, Budget, Goal, IncomeStream, Holiday, DashboardData } from '../types';

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'checking',
    balance: 2500.00,
    pendingBalance: 2350.00,
    bankName: 'Bank of America',
    accountNumber: '****1234',
    routingNumber: '123456789',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Savings Account',
    type: 'savings',
    balance: 15000.00,
    pendingBalance: 15000.00,
    bankName: 'Bank of America',
    accountNumber: '****5678',
    routingNumber: '123456789',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'credit',
    balance: -850.00,
    pendingBalance: -1200.00,
    bankName: 'Bank of America',
    accountNumber: '****9876',
    creditLimit: 5000.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Housing',
    color: '#3B82F6',
    icon: 'home',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Rent',
    parentId: '1',
    color: '#3B82F6',
    icon: 'home',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Utilities',
    parentId: '1',
    color: '#3B82F6',
    icon: 'zap',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Food',
    color: '#10B981',
    icon: 'utensils',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Groceries',
    parentId: '4',
    color: '#10B981',
    icon: 'shopping-cart',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Transportation',
    color: '#F59E0B',
    icon: 'car',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Emergency Fund',
    color: '#EF4444',
    icon: 'shield',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Monthly Rent',
    categoryId: '2',
    amount: 1200.00,
    period: 'monthly',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Utilities Budget',
    categoryId: '3',
    amount: 200.00,
    period: 'monthly',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Grocery Budget',
    categoryId: '5',
    amount: 500.00,
    period: 'monthly',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Transportation Budget',
    categoryId: '6',
    amount: 300.00,
    period: 'monthly',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Generate historical transactions for the past 18 months
const generateHistoricalTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-07-04');
  
  const merchants = {
    '2': ['Property Management Co', 'Landlord Services'],
    '3': ['Electric Company', 'Gas Company', 'Water Utility', 'Internet Provider'],
    '5': ['Supermarket', 'Grocery Store', 'Whole Foods', 'Walmart', 'Target'],
    '6': ['Gas Station', 'Shell', 'Chevron', 'BP', 'Auto Repair Shop']
  };
  
  let transactionId = 1;
  
  // Generate monthly recurring transactions
  for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
    const currentMonth = new Date(date);
    
    // Rent - monthly on 1st
    transactions.push({
      id: (transactionId++).toString(),
      accountId: '1',
      amount: -1200.00 + Math.random() * 100 - 50, // Slight variation
      description: 'Rent Payment',
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      categoryId: '2',
      status: 'cleared',
      type: 'debit',
      merchant: merchants['2'][Math.floor(Math.random() * merchants['2'].length)],
      createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      updatedAt: new Date()
    });
    
    // Utilities - multiple per month
    for (let i = 0; i < 3; i++) {
      transactions.push({
        id: (transactionId++).toString(),
        accountId: '1',
        amount: -(50 + Math.random() * 100),
        description: ['Electric Bill', 'Gas Bill', 'Water Bill'][i],
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 5 + i * 7),
        categoryId: '3',
        status: 'cleared',
        type: 'debit',
        merchant: merchants['3'][i % merchants['3'].length],
        createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 5 + i * 7),
        updatedAt: new Date()
      });
    }
    
    // Groceries - weekly
    for (let week = 0; week < 4; week++) {
      transactions.push({
        id: (transactionId++).toString(),
        accountId: '1',
        amount: -(80 + Math.random() * 80),
        description: 'Grocery Shopping',
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 3 + week * 7),
        categoryId: '5',
        status: 'cleared',
        type: 'debit',
        merchant: merchants['5'][Math.floor(Math.random() * merchants['5'].length)],
        createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 3 + week * 7),
        updatedAt: new Date()
      });
    }
    
    // Transportation - bi-weekly
    for (let i = 0; i < 2; i++) {
      transactions.push({
        id: (transactionId++).toString(),
        accountId: '1',
        amount: -(40 + Math.random() * 40),
        description: 'Gas Station',
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 8 + i * 14),
        categoryId: '6',
        status: 'cleared',
        type: 'debit',
        merchant: merchants['6'][Math.floor(Math.random() * merchants['6'].length)],
        createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 8 + i * 14),
        updatedAt: new Date()
      });
    }
    
    // Salary - bi-monthly (1st and 15th)
    for (let i = 0; i < 2; i++) {
      const payDate = i === 0 ? 1 : 15;
      transactions.push({
        id: (transactionId++).toString(),
        accountId: '1',
        amount: 3000.00 + Math.random() * 500 - 250, // Slight variation
        description: 'Salary Deposit',
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), payDate),
        status: 'cleared',
        type: 'credit',
        merchant: 'Employer',
        createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), payDate),
        updatedAt: new Date()
      });
    }
    
    // Random other expenses
    for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const categories = ['5', '6', '3']; // Focus on main categories
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      transactions.push({
        id: (transactionId++).toString(),
        accountId: Math.random() > 0.7 ? '3' : '1', // Sometimes use credit card
        amount: -(10 + Math.random() * 200),
        description: `Purchase ${i + 1}`,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), randomDay),
        categoryId: randomCategory,
        status: 'cleared',
        type: 'debit',
        merchant: merchants[randomCategory as keyof typeof merchants][Math.floor(Math.random() * merchants[randomCategory as keyof typeof merchants].length)],
        createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), randomDay),
        updatedAt: new Date()
      });
    }
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const mockTransactions: Transaction[] = generateHistoricalTransactions();

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000.00,
    currentAmount: 5000.00,
    targetDate: new Date('2025-12-31'),
    categoryId: '7',
    contributionAmount: 200.00,
    contributionFrequency: 'monthly',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockIncomeStreams: IncomeStream[] = [
  {
    id: '1',
    name: 'Primary Job',
    amount: 3000.00,
    frequency: 'bi-monthly',
    payDates: [15, 30],
    accountId: '1',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Freelance Work',
    amount: 500.00,
    frequency: 'monthly',
    payDates: [3],
    accountId: '1',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockHolidays: Holiday[] = [
  {
    id: '1',
    name: 'Independence Day',
    date: new Date('2024-07-04'),
    isRecurring: true,
    type: 'federal',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Labor Day',
    date: new Date('2024-09-02'),
    isRecurring: true,
    type: 'federal',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const generateMockDashboardData = (): DashboardData => {
  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalPendingCharges = mockAccounts
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + Math.abs(account.pendingBalance - account.balance), 0);

  return {
    accountSummary: {
      totalBalance,
      totalPendingCharges,
      netAvailableFunds: totalBalance - totalPendingCharges,
      accounts: mockAccounts,
      lastUpdated: new Date()
    },
    budgetAnalysis: [
      {
        categoryId: '2',
        budgetAmount: 1200.00,
        spentAmount: 1200.00,
        remainingAmount: 0.00,
        percentageUsed: 100,
        dailyLimit: 0,
        daysRemaining: 27,
        isOverBudget: false
      },
      {
        categoryId: '3',
        budgetAmount: 200.00,
        spentAmount: 85.50,
        remainingAmount: 114.50,
        percentageUsed: 42.75,
        dailyLimit: 4.24,
        daysRemaining: 27,
        isOverBudget: false
      },
      {
        categoryId: '5',
        budgetAmount: 500.00,
        spentAmount: 120.00,
        remainingAmount: 380.00,
        percentageUsed: 24,
        dailyLimit: 14.07,
        daysRemaining: 27,
        isOverBudget: false
      },
      {
        categoryId: '6',
        budgetAmount: 300.00,
        spentAmount: 50.00,
        remainingAmount: 250.00,
        percentageUsed: 16.67,
        dailyLimit: 9.26,
        daysRemaining: 27,
        isOverBudget: false
      }
    ],
    recentTransactions: mockTransactions.slice(0, 5),
    goalProgress: [
      {
        goalId: '1',
        currentAmount: 5000.00,
        targetAmount: 10000.00,
        remainingAmount: 5000.00,
        percentageComplete: 50,
        estimatedCompletionDate: new Date('2025-12-31'),
        monthsRemaining: 17,
        requiredMonthlyContribution: 294.12
      }
    ],
    nextPayPeriod: {
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-15'),
      payDate: new Date('2024-07-15'),
      adjustedPayDate: new Date('2024-07-15'),
      expectedIncome: 3000.00,
      budgetAllocations: {
        '2': 1200.00,
        '3': 200.00,
        '5': 500.00,
        '6': 300.00
      }
    },
    monthlySpending: {
      'Housing': 1285.50,
      'Food': 120.00,
      'Transportation': 50.00,
      'Other': 0.00
    }
  };
};