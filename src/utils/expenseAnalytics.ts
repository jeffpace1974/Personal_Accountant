import { 
  Transaction, 
  Category, 
  ExpenseReport, 
  ExpenseCategoryReport, 
  TimeComparisonData, 
  SpendingTrend, 
  TimePeriod, 
  MonthlySpending,
  MerchantSpending,
  TransactionArchive
} from '../types';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  format,
  isWithinInterval,
  addDays,
  eachMonthOfInterval,
  differenceInDays
} from 'date-fns';

export const getDateRangeForPeriod = (period: TimePeriod, baseDate: Date = new Date()): { start: Date, end: Date } => {
  switch (period) {
    case 'week':
      return {
        start: startOfWeek(baseDate),
        end: endOfWeek(baseDate)
      };
    case 'two-weeks':
      const twoWeeksStart = subWeeks(startOfWeek(baseDate), 1);
      return {
        start: twoWeeksStart,
        end: endOfWeek(baseDate)
      };
    case 'month':
      return {
        start: startOfMonth(baseDate),
        end: endOfMonth(baseDate)
      };
    case 'quarter':
      return {
        start: startOfQuarter(baseDate),
        end: endOfQuarter(baseDate)
      };
    case 'year':
      return {
        start: startOfYear(baseDate),
        end: endOfYear(baseDate)
      };
    case 'ytd':
      return {
        start: startOfYear(baseDate),
        end: baseDate
      };
    default:
      return {
        start: startOfMonth(baseDate),
        end: endOfMonth(baseDate)
      };
  }
};

export const getPreviousPeriodDates = (period: TimePeriod, currentStart: Date, currentEnd: Date): { start: Date, end: Date } => {
  const daysDiff = differenceInDays(currentEnd, currentStart);
  
  switch (period) {
    case 'week':
      return {
        start: subWeeks(currentStart, 1),
        end: subWeeks(currentEnd, 1)
      };
    case 'two-weeks':
      return {
        start: subWeeks(currentStart, 2),
        end: subWeeks(currentEnd, 2)
      };
    case 'month':
      return {
        start: subMonths(currentStart, 1),
        end: subMonths(currentEnd, 1)
      };
    case 'quarter':
      return {
        start: subQuarters(currentStart, 1),
        end: subQuarters(currentEnd, 1)
      };
    case 'year':
    case 'ytd':
      return {
        start: subYears(currentStart, 1),
        end: subYears(currentEnd, 1)
      };
    default:
      return {
        start: addDays(currentStart, -daysDiff - 1),
        end: addDays(currentEnd, -daysDiff - 1)
      };
  }
};

export const filterTransactionsByDateRange = (
  transactions: Transaction[], 
  startDate: Date, 
  endDate: Date
): Transaction[] => {
  return transactions.filter(transaction => 
    isWithinInterval(transaction.date, { start: startDate, end: endDate })
  );
};

export const groupTransactionsByCategory = (
  transactions: Transaction[], 
  categories: Category[]
): Record<string, Transaction[]> => {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    if (transaction.categoryId && transaction.amount < 0) { // Only expenses
      const categoryId = transaction.categoryId;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(transaction);
    }
  });
  
  return grouped;
};

export const calculateCategorySpending = (
  transactions: Transaction[], 
  categoryId: string, 
  categories: Category[]
): number => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return 0;
  
  // Get all subcategories
  const subcategoryIds = categories
    .filter(c => c.parentId === categoryId)
    .map(c => c.id);
  
  // Calculate spending for this category and all subcategories
  return transactions
    .filter(t => {
      if (t.amount >= 0) return false; // Only expenses
      return t.categoryId === categoryId || subcategoryIds.includes(t.categoryId || '');
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

export const generateExpenseReport = (
  transactions: Transaction[], 
  categories: Category[], 
  startDate: Date, 
  endDate: Date
): ExpenseReport => {
  const periodTransactions = filterTransactionsByDateRange(transactions, startDate, endDate);
  const expenseTransactions = periodTransactions.filter(t => t.amount < 0);
  
  const totalSpent = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Get parent categories only
  const parentCategories = categories.filter(c => !c.parentId);
  
  const categoryReports: ExpenseCategoryReport[] = parentCategories.map(category => {
    const categorySpending = calculateCategorySpending(expenseTransactions, category.id, categories);
    const categoryTransactions = expenseTransactions.filter(t => 
      t.categoryId === category.id || 
      categories.some(subcat => subcat.parentId === category.id && subcat.id === t.categoryId)
    );
    
    // Get subcategories
    const subcategories = categories
      .filter(c => c.parentId === category.id)
      .map(subcat => {
        const subcatSpending = calculateCategorySpending(expenseTransactions, subcat.id, categories);
        const subcatTransactions = expenseTransactions.filter(t => t.categoryId === subcat.id);
        
        return {
          categoryId: subcat.id,
          categoryName: subcat.name,
          parentCategoryId: category.id,
          totalSpent: subcatSpending,
          transactionCount: subcatTransactions.length,
          averageTransaction: subcatTransactions.length > 0 ? subcatSpending / subcatTransactions.length : 0,
          monthlyBreakdown: generateMonthlyBreakdown(subcatTransactions, startDate, endDate),
          topMerchants: generateTopMerchants(subcatTransactions),
          percentageOfTotal: totalSpent > 0 ? (subcatSpending / totalSpent) * 100 : 0,
        };
      });
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      totalSpent: categorySpending,
      transactionCount: categoryTransactions.length,
      averageTransaction: categoryTransactions.length > 0 ? categorySpending / categoryTransactions.length : 0,
      monthlyBreakdown: generateMonthlyBreakdown(categoryTransactions, startDate, endDate),
      topMerchants: generateTopMerchants(categoryTransactions),
      percentageOfTotal: totalSpent > 0 ? (categorySpending / totalSpent) * 100 : 0,
      subcategories: subcategories.filter(sub => sub.totalSpent > 0),
    };
  }).filter(report => report.totalSpent > 0);
  
  return {
    id: `report-${Date.now()}`,
    name: `Expense Report ${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`,
    startDate,
    endDate,
    categories: categoryReports.sort((a, b) => b.totalSpent - a.totalSpent),
    totalSpent,
    createdAt: new Date(),
  };
};

export const generateMonthlyBreakdown = (
  transactions: Transaction[], 
  startDate: Date, 
  endDate: Date
): MonthlySpending[] => {
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  
  return months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthTransactions = transactions.filter(t => 
      isWithinInterval(t.date, { start: monthStart, end: monthEnd })
    );
    
    return {
      month: format(month, 'MMM'),
      year: month.getFullYear(),
      amount: monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
      transactionCount: monthTransactions.length,
    };
  });
};

export const generateTopMerchants = (transactions: Transaction[]): MerchantSpending[] => {
  const merchantMap = new Map<string, MerchantSpending>();
  
  transactions.forEach(transaction => {
    const merchant = transaction.merchant || 'Unknown Merchant';
    const existing = merchantMap.get(merchant);
    
    if (existing) {
      existing.totalSpent += Math.abs(transaction.amount);
      existing.transactionCount += 1;
      if (transaction.date > existing.lastTransaction) {
        existing.lastTransaction = transaction.date;
      }
    } else {
      merchantMap.set(merchant, {
        merchant,
        totalSpent: Math.abs(transaction.amount),
        transactionCount: 1,
        lastTransaction: transaction.date,
      });
    }
  });
  
  return Array.from(merchantMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10); // Top 10 merchants
};

export const generateTimeComparison = (
  transactions: Transaction[], 
  categories: Category[], 
  currentPeriod: { start: Date, end: Date }, 
  previousPeriod: { start: Date, end: Date }
): TimeComparisonData => {
  const currentTransactions = filterTransactionsByDateRange(transactions, currentPeriod.start, currentPeriod.end)
    .filter(t => t.amount < 0);
  const previousTransactions = filterTransactionsByDateRange(transactions, previousPeriod.start, previousPeriod.end)
    .filter(t => t.amount < 0);
  
  const currentTotal = currentTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const previousTotal = previousTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const currentCategoryBreakdown: Record<string, number> = {};
  const previousCategoryBreakdown: Record<string, number> = {};
  
  // Calculate current period breakdown
  categories.forEach(category => {
    currentCategoryBreakdown[category.id] = calculateCategorySpending(currentTransactions, category.id, categories);
    previousCategoryBreakdown[category.id] = calculateCategorySpending(previousTransactions, category.id, categories);
  });
  
  const categoryChanges: Record<string, { difference: number; percentageChange: number; trend: 'up' | 'down' | 'stable' }> = {};
  
  categories.forEach(category => {
    const current = currentCategoryBreakdown[category.id] || 0;
    const previous = previousCategoryBreakdown[category.id] || 0;
    const difference = current - previous;
    const percentageChange = previous > 0 ? (difference / previous) * 100 : (current > 0 ? 100 : 0);
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentageChange) > 5) { // 5% threshold for trend detection
      trend = percentageChange > 0 ? 'up' : 'down';
    }
    
    categoryChanges[category.id] = {
      difference,
      percentageChange,
      trend,
    };
  });
  
  return {
    currentPeriod: {
      startDate: currentPeriod.start,
      endDate: currentPeriod.end,
      totalSpent: currentTotal,
      categoryBreakdown: currentCategoryBreakdown,
    },
    previousPeriod: {
      startDate: previousPeriod.start,
      endDate: previousPeriod.end,
      totalSpent: previousTotal,
      categoryBreakdown: previousCategoryBreakdown,
    },
    comparison: {
      totalDifference: currentTotal - previousTotal,
      totalPercentageChange: previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0,
      categoryChanges,
    },
  };
};

export const generateSpendingTrend = (
  transactions: Transaction[], 
  categories: Category[], 
  categoryId: string, 
  months: number = 12
): SpendingTrend => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  
  const endDate = new Date();
  const startDate = subMonths(endDate, months);
  
  const categoryTransactions = transactions.filter(t => 
    t.categoryId === categoryId && 
    t.amount < 0 && 
    isWithinInterval(t.date, { start: startDate, end: endDate })
  );
  
  const monthlyData = eachMonthOfInterval({ start: startDate, end: endDate }).map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthTransactions = categoryTransactions.filter(t => 
      isWithinInterval(t.date, { start: monthStart, end: monthEnd })
    );
    const amount = monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return {
      date: month,
      amount,
      cumulativeAmount: 0, // Will be calculated below
    };
  });
  
  // Calculate cumulative amounts
  let cumulative = 0;
  monthlyData.forEach(data => {
    cumulative += data.amount;
    data.cumulativeAmount = cumulative;
  });
  
  const totalSpent = monthlyData.reduce((sum, data) => sum + data.amount, 0);
  const averageMonthlySpend = totalSpent / months;
  
  // Determine trend direction
  const firstHalf = monthlyData.slice(0, Math.floor(months / 2));
  const secondHalf = monthlyData.slice(Math.floor(months / 2));
  const firstHalfAvg = firstHalf.reduce((sum, data) => sum + data.amount, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, data) => sum + data.amount, 0) / secondHalf.length;
  
  let trendDirection: 'up' | 'down' | 'stable' = 'stable';
  const trendChange = secondHalfAvg - firstHalfAvg;
  if (Math.abs(trendChange) > averageMonthlySpend * 0.1) { // 10% threshold
    trendDirection = trendChange > 0 ? 'up' : 'down';
  }
  
  return {
    categoryId,
    categoryName: category.name,
    dataPoints: monthlyData,
    trendDirection,
    averageMonthlySpend,
    projectedYearEnd: averageMonthlySpend * 12,
  };
};

export const createTransactionArchive = (
  transactions: Transaction[], 
  categories: Category[], 
  year: number
): TransactionArchive => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  
  const yearTransactions = filterTransactionsByDateRange(transactions, yearStart, yearEnd);
  const expenses = yearTransactions.filter(t => t.amount < 0);
  const income = yearTransactions.filter(t => t.amount > 0);
  
  const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  
  const categorySummary: Record<string, number> = {};
  categories.forEach(category => {
    categorySummary[category.id] = calculateCategorySpending(expenses, category.id, categories);
  });
  
  const monthlyBreakdown = generateMonthlyBreakdown(yearTransactions, yearStart, yearEnd);
  
  return {
    year,
    transactions: yearTransactions,
    summary: {
      totalTransactions: yearTransactions.length,
      totalSpent,
      totalIncome,
      netAmount: totalIncome - totalSpent,
      categorySummary,
      monthlyBreakdown,
    },
  };
};