export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  pendingBalance: number;
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  creditLimit?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  date: Date;
  categoryId?: string;
  status: 'pending' | 'cleared';
  type: 'debit' | 'credit';
  merchant?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'pay-period';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAdjustment {
  id: string;
  budgetId: string;
  oldAmount: number;
  newAmount: number;
  reason: string;
  adjustmentDate: Date;
  adjustedBy: string;
  createdAt: Date;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  budgetAllocations: Record<string, number>;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  categoryId: string;
  contributionAmount: number;
  contributionFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'pay-period';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncomeStream {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly' | 'custom';
  payDates: number[]; // Day of month or custom dates
  accountId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  isRecurring: boolean;
  type: 'federal' | 'bank' | 'company' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAnalysis {
  categoryId: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  dailyLimit: number;
  daysRemaining: number;
  isOverBudget: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  totalPendingCharges: number;
  netAvailableFunds: number;
  accounts: Account[];
  lastUpdated: Date;
}

export interface GoalProjection {
  goalId: string;
  currentAmount: number;
  targetAmount: number;
  remainingAmount: number;
  percentageComplete: number;
  estimatedCompletionDate: Date;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
}

export interface PayPeriod {
  startDate: Date;
  endDate: Date;
  payDate: Date;
  adjustedPayDate: Date;
  expectedIncome: number;
  budgetAllocations: Record<string, number>;
}

export interface DashboardData {
  accountSummary: AccountSummary;
  budgetAnalysis: BudgetAnalysis[];
  recentTransactions: Transaction[];
  goalProgress: GoalProjection[];
  nextPayPeriod: PayPeriod;
  monthlySpending: Record<string, number>;
}

export interface ExpenseReport {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  categories: ExpenseCategoryReport[];
  totalSpent: number;
  comparisonPeriod?: ExpenseReport;
  createdAt: Date;
}

export interface ExpenseCategoryReport {
  categoryId: string;
  categoryName: string;
  parentCategoryId?: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  monthlyBreakdown: MonthlySpending[];
  topMerchants: MerchantSpending[];
  percentageOfTotal: number;
  subcategories?: ExpenseCategoryReport[];
}

export interface MonthlySpending {
  month: string;
  year: number;
  amount: number;
  transactionCount: number;
}

export interface MerchantSpending {
  merchant: string;
  totalSpent: number;
  transactionCount: number;
  lastTransaction: Date;
}

export interface TimeComparisonData {
  currentPeriod: {
    startDate: Date;
    endDate: Date;
    totalSpent: number;
    categoryBreakdown: Record<string, number>;
  };
  previousPeriod: {
    startDate: Date;
    endDate: Date;
    totalSpent: number;
    categoryBreakdown: Record<string, number>;
  };
  comparison: {
    totalDifference: number;
    totalPercentageChange: number;
    categoryChanges: Record<string, {
      difference: number;
      percentageChange: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
}

export interface SpendingTrend {
  categoryId: string;
  categoryName: string;
  dataPoints: {
    date: Date;
    amount: number;
    cumulativeAmount: number;
  }[];
  trendDirection: 'up' | 'down' | 'stable';
  averageMonthlySpend: number;
  projectedYearEnd: number;
}

export type TimePeriod = 'week' | 'two-weeks' | 'month' | 'quarter' | 'year' | 'ytd' | 'custom';

export interface ReportFilters {
  timePeriod: TimePeriod;
  startDate?: Date;
  endDate?: Date;
  categories: string[];
  accounts: string[];
  comparisonEnabled: boolean;
  comparisonPeriod?: TimePeriod;
}

export interface TransactionArchive {
  year: number;
  transactions: Transaction[];
  summary: {
    totalTransactions: number;
    totalSpent: number;
    totalIncome: number;
    netAmount: number;
    categorySummary: Record<string, number>;
    monthlyBreakdown: MonthlySpending[];
  };
}