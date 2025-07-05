import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/dateUtils';
import { 
  generateExpenseReport, 
  generateTimeComparison, 
  generateSpendingTrend, 
  getDateRangeForPeriod, 
  getPreviousPeriodDates,
  createTransactionArchive
} from '../utils/expenseAnalytics';
import { format } from 'date-fns';
import { TimePeriod, ReportFilters } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download, 
  BarChart3,
  PieChart as PieChartIcon,
  Archive,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const Reports: React.FC = () => {
  const { state } = useApp();
  const { transactions, categories } = state;
  
  const [filters, setFilters] = useState<ReportFilters>({
    timePeriod: 'month',
    categories: [],
    accounts: [],
    comparisonEnabled: true,
    comparisonPeriod: 'month'
  });
  
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'categories' | 'archive'>('overview');

  // Calculate date ranges
  const currentDateRange = useMemo(() => {
    if (filters.startDate && filters.endDate) {
      return { start: filters.startDate, end: filters.endDate };
    }
    return getDateRangeForPeriod(filters.timePeriod);
  }, [filters.timePeriod, filters.startDate, filters.endDate]);

  const previousDateRange = useMemo(() => {
    return getPreviousPeriodDates(
      filters.comparisonPeriod || filters.timePeriod, 
      currentDateRange.start, 
      currentDateRange.end
    );
  }, [filters.comparisonPeriod, filters.timePeriod, currentDateRange]);

  // Generate reports
  const currentReport = useMemo(() => {
    return generateExpenseReport(
      transactions, 
      categories, 
      currentDateRange.start, 
      currentDateRange.end
    );
  }, [transactions, categories, currentDateRange]);

  const comparisonData = useMemo(() => {
    if (!filters.comparisonEnabled) return null;
    return generateTimeComparison(
      transactions, 
      categories, 
      currentDateRange, 
      previousDateRange
    );
  }, [transactions, categories, currentDateRange, previousDateRange, filters.comparisonEnabled]);

  const spendingTrends = useMemo(() => {
    return categories
      .filter(cat => !cat.parentId) // Only parent categories
      .map(category => generateSpendingTrend(transactions, categories, category.id))
      .filter(trend => trend.averageMonthlySpend > 0);
  }, [transactions, categories]);

  // Color scheme for charts
  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-danger-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-success-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Current Period</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(currentReport.totalSpent)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {comparisonData && (
          <>
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Previous Period</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(comparisonData.previousPeriod.totalSpent)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {comparisonData.comparison.totalDifference > 0 ? (
                    <TrendingUp className="h-8 w-8 text-danger-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-success-600" />
                  )}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Change</dt>
                    <dd className={`text-lg font-medium ${
                      comparisonData.comparison.totalDifference > 0 ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {comparisonData.comparison.totalDifference > 0 ? '+' : ''}
                      {formatCurrency(comparisonData.comparison.totalDifference)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    comparisonData.comparison.totalPercentageChange > 0 ? 'bg-danger-100' : 'bg-success-100'
                  }`}>
                    <span className={`font-semibold text-sm ${
                      comparisonData.comparison.totalPercentageChange > 0 ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      %
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">% Change</dt>
                    <dd className={`text-lg font-medium ${
                      comparisonData.comparison.totalPercentageChange > 0 ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {comparisonData.comparison.totalPercentageChange > 0 ? '+' : ''}
                      {comparisonData.comparison.totalPercentageChange.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spending by Category Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Spending by Category</h3>
          <PieChartIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentReport.categories.map((cat, index) => ({
                  name: cat.categoryName,
                  value: cat.totalSpent,
                  fill: COLORS[index % COLORS.length]
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {currentReport.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Comparison */}
      {comparisonData && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Category Comparison</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentReport.categories.map(cat => ({
                  name: cat.categoryName,
                  current: cat.totalSpent,
                  previous: comparisonData.previousPeriod.categoryBreakdown[cat.categoryId] || 0,
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="current" fill="#0ea5e9" name="Current Period" />
                <Bar dataKey="previous" fill="#64748b" name="Previous Period" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {spendingTrends.slice(0, 4).map((trend, index) => (
          <div key={trend.categoryId} className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{trend.categoryName}</h3>
                <p className="text-sm text-gray-500">
                  Avg: {formatCurrency(trend.averageMonthlySpend)}/month
                </p>
              </div>
              {getTrendIcon(trend.trendDirection)}
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend.dataPoints.map(point => ({
                  month: format(point.date, 'MMM'),
                  amount: point.amount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Projected annual: {formatCurrency(trend.projectedYearEnd)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Category Breakdown</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {currentReport.categories.map((category) => (
            <div key={category.categoryId} className="border-l-4 border-primary-400 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-gray-900">{category.categoryName}</h4>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(category.totalSpent)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {category.percentageOfTotal.toFixed(1)}% of total
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Transactions</label>
                  <p className="text-sm text-gray-900">{category.transactionCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Average</label>
                  <p className="text-sm text-gray-900">{formatCurrency(category.averageTransaction)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Change</label>
                  {comparisonData && (
                    <div className="flex items-center">
                      {getTrendIcon(comparisonData.comparison.categoryChanges[category.categoryId]?.trend || 'stable')}
                      <span className={`ml-1 text-sm ${
                        (comparisonData.comparison.categoryChanges[category.categoryId]?.percentageChange || 0) > 0 
                          ? 'text-danger-600' : 'text-success-600'
                      }`}>
                        {(comparisonData.comparison.categoryChanges[category.categoryId]?.percentageChange || 0).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-4 space-y-2">
                  {category.subcategories.map((subcat) => (
                    <div key={subcat.categoryId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{subcat.categoryName}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(subcat.totalSpent)}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({subcat.transactionCount} transactions)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Top Merchants */}
              {category.topMerchants.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Top Merchants</h5>
                  <div className="space-y-1">
                    {category.topMerchants.slice(0, 3).map((merchant) => (
                      <div key={merchant.merchant} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{merchant.merchant}</span>
                        <div>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(merchant.totalSpent)}
                          </span>
                          <span className="ml-2 text-gray-500">
                            ({merchant.transactionCount} transactions)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArchive = () => {
    const years = [2024, 2023];
    const archives = years.map(year => createTransactionArchive(transactions, categories, year));
    
    return (
      <div className="space-y-6">
        {archives.map((archive) => (
          <div key={archive.year} className="card">
            <div className="card-header">
              <h3 className="card-title">{archive.year} Annual Summary</h3>
              <Archive className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Transactions</label>
                <p className="text-lg font-semibold text-gray-900">{archive.summary.totalTransactions}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Spent</label>
                <p className="text-lg font-semibold text-danger-600">
                  {formatCurrency(archive.summary.totalSpent)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Income</label>
                <p className="text-lg font-semibold text-success-600">
                  {formatCurrency(archive.summary.totalIncome)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Net Amount</label>
                <p className={`text-lg font-semibold ${
                  archive.summary.netAmount > 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(archive.summary.netAmount)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Breakdown</h4>
                <div className="space-y-2">
                  {archive.summary.monthlyBreakdown.map((month) => (
                    <div key={`${month.month}-${month.year}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">{month.month}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(month.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Category Summary</h4>
                <div className="space-y-2">
                  {Object.entries(archive.summary.categorySummary)
                    .filter(([_, amount]) => amount > 0)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([categoryId, amount]) => (
                      <div key={categoryId} className="flex justify-between text-sm">
                        <span className="text-gray-600">{getCategoryName(categoryId)}</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Expense Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Analyze your spending patterns and trends over time
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Report Filters</h3>
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="label">Time Period</label>
            <select
              className="input"
              value={filters.timePeriod}
              onChange={(e) => setFilters({ ...filters, timePeriod: e.target.value as TimePeriod })}
            >
              <option value="week">This Week</option>
              <option value="two-weeks">Last 2 Weeks</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              className="input"
              value={filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setFilters({ 
                ...filters, 
                startDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              className="input"
              value={filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setFilters({ 
                ...filters, 
                endDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
            />
          </div>
          <div>
            <label className="label">Compare To</label>
            <select
              className="input"
              value={filters.comparisonPeriod || 'month'}
              onChange={(e) => setFilters({ 
                ...filters, 
                comparisonPeriod: e.target.value as TimePeriod 
              })}
              disabled={!filters.comparisonEnabled}
            >
              <option value="week">Previous Week</option>
              <option value="month">Previous Month</option>
              <option value="quarter">Previous Quarter</option>
              <option value="year">Previous Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 rounded mr-2"
                checked={filters.comparisonEnabled}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  comparisonEnabled: e.target.checked 
                })}
              />
              <span className="text-sm text-gray-700">Enable Comparison</span>
            </label>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'trends', name: 'Trends', icon: TrendingUp },
            { id: 'categories', name: 'Categories', icon: PieChartIcon },
            { id: 'archive', name: 'Archive', icon: Archive },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`${
                  activeView === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'trends' && renderTrends()}
      {activeView === 'categories' && renderCategories()}
      {activeView === 'archive' && renderArchive()}
    </div>
  );
};

export default Reports;