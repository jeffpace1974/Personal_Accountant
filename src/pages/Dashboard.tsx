import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  Target,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { dashboardData, categories } = state;

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getStatusColor = (isOverBudget: boolean, percentageUsed: number) => {
    if (isOverBudget) return 'text-danger-600';
    if (percentageUsed > 80) return 'text-warning-600';
    return 'text-success-600';
  };

  const getProgressBarColor = (isOverBudget: boolean, percentageUsed: number) => {
    if (isOverBudget) return 'bg-danger-500';
    if (percentageUsed > 80) return 'bg-warning-500';
    return 'bg-success-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's an overview of your financial status.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className="text-sm text-gray-500">
            Last updated: {formatDate(dashboardData.accountSummary.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(dashboardData.accountSummary.totalBalance)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Charges</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(dashboardData.accountSummary.totalPendingCharges)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Available Funds</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(dashboardData.accountSummary.netAvailableFunds)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Next Paycheck</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatDate(dashboardData.nextPayPeriod.adjustedPayDate)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Budget Overview</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.budgetAnalysis.map((analysis) => (
              <div key={analysis.categoryId} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getCategoryName(analysis.categoryId)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(analysis.spentAmount)} of {formatCurrency(analysis.budgetAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(analysis.isOverBudget, analysis.percentageUsed)}`}>
                      {analysis.percentageUsed.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(analysis.remainingAmount)} left
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressBarColor(analysis.isOverBudget, analysis.percentageUsed)}`}
                      style={{ width: `${Math.min(analysis.percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Daily limit: {formatCurrency(analysis.dailyLimit)} • {analysis.daysRemaining} days left
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Transactions</h3>
            <TrendingDown className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {getCategoryName(transaction.categoryId || '')} • {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-success-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    transaction.status === 'pending' ? 'bg-warning-100 text-warning-800' : 'bg-success-100 text-success-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Goal Progress</h3>
          <Target className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.goalProgress.map((goal) => (
            <div key={goal.goalId} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Emergency Fund</h4>
                <span className="text-sm font-medium text-primary-600">
                  {goal.percentageComplete}%
                </span>
              </div>
              <div className="progress-bar mb-2">
                <div
                  className="progress-fill bg-primary-500"
                  style={{ width: `${goal.percentageComplete}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</p>
                <p>{goal.monthsRemaining} months remaining</p>
                <p>Monthly target: {formatCurrency(goal.requiredMonthlyContribution)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Spending Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Monthly Spending by Category</h3>
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dashboardData.monthlySpending).map(([category, amount]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{category}</p>
              <p className="text-lg font-semibold text-primary-600">{formatCurrency(amount)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alerts & Notifications</h3>
          <AlertCircle className="h-5 w-5 text-warning-500" />
        </div>
        <div className="space-y-3">
          {dashboardData.budgetAnalysis
            .filter(analysis => analysis.isOverBudget || analysis.percentageUsed > 80)
            .map((analysis) => (
              <div
                key={analysis.categoryId}
                className={`p-3 rounded-lg border-l-4 ${
                  analysis.isOverBudget 
                    ? 'bg-danger-50 border-danger-400' 
                    : 'bg-warning-50 border-warning-400'
                }`}
              >
                <div className="flex items-center">
                  <AlertCircle className={`h-4 w-4 ${
                    analysis.isOverBudget ? 'text-danger-500' : 'text-warning-500'
                  }`} />
                  <p className="ml-2 text-sm font-medium text-gray-900">
                    {analysis.isOverBudget ? 'Over Budget' : 'Budget Warning'}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {getCategoryName(analysis.categoryId)}: {analysis.percentageUsed.toFixed(1)}% used
                  {analysis.isOverBudget && ` (${formatCurrency(Math.abs(analysis.remainingAmount))} over)`}
                </p>
              </div>
            ))}
          {dashboardData.budgetAnalysis.every(analysis => !analysis.isOverBudget && analysis.percentageUsed <= 80) && (
            <div className="p-3 rounded-lg bg-success-50 border-l-4 border-success-400">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-success-500" />
                <p className="ml-2 text-sm font-medium text-gray-900">All budgets on track!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;