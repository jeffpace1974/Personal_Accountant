import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Edit3,
  Trash2,
  CheckCircle
} from 'lucide-react';

const Goals: React.FC = () => {
  const { state } = useApp();
  const { goals, categories, dashboardData } = state;
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    categoryId: '',
    contributionAmount: '',
    contributionFrequency: 'monthly' as const
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const calculateMonthsToGoal = (currentAmount: number, targetAmount: number, monthlyContribution: number) => {
    if (monthlyContribution <= 0) return Infinity;
    const remaining = targetAmount - currentAmount;
    return Math.ceil(remaining / monthlyContribution);
  };

  const calculateProjectedDate = (currentAmount: number, targetAmount: number, contributionAmount: number, frequency: string) => {
    if (contributionAmount <= 0) return null;
    
    const remaining = targetAmount - currentAmount;
    let monthlyContribution = contributionAmount;
    
    switch (frequency) {
      case 'weekly':
        monthlyContribution = contributionAmount * 4.33;
        break;
      case 'bi-weekly':
        monthlyContribution = contributionAmount * 2.17;
        break;
      case 'pay-period':
        monthlyContribution = contributionAmount * 2;
        break;
    }
    
    const months = Math.ceil(remaining / monthlyContribution);
    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + months);
    return projectedDate;
  };

  const totalGoalsValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalRemaining = totalGoalsValue - totalSaved;
  const averageProgress = goals.length > 0 ? (totalSaved / totalGoalsValue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Savings Goals
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your progress toward financial goals
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
          <button className="btn-secondary">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Projections
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Goal Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Goals</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {goals.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Saved</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalSaved)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Target Amount</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalGoalsValue)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Progress</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {averageProgress.toFixed(1)}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const projectedDate = calculateProjectedDate(
            goal.currentAmount, 
            goal.targetAmount, 
            goal.contributionAmount, 
            goal.contributionFrequency
          );
          const monthsRemaining = calculateMonthsToGoal(
            goal.currentAmount, 
            goal.targetAmount, 
            goal.contributionAmount
          );

          return (
            <div key={goal.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{goal.name}</h3>
                  <p className="text-sm text-gray-500">
                    {getCategoryName(goal.categoryId)} • Target: {formatDate(goal.targetDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary text-sm">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="btn-secondary text-sm text-danger-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-primary-600">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-primary-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Remaining</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Target</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(goal.contributionAmount)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Projections</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {projectedDate && (
                      <p>Estimated completion: {formatDate(projectedDate)}</p>
                    )}
                    <p>Months remaining: {monthsRemaining === Infinity ? 'N/A' : monthsRemaining}</p>
                    <p>Contribution frequency: {goal.contributionFrequency}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="btn-primary text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Contribution
                  </button>
                  <button className="btn-secondary text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Adjust Timeline
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Goal */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Add New Goal</h3>
          <Target className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Goal Name</label>
            <input
              type="text"
              className="input"
              placeholder="Emergency Fund"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Target Amount</label>
            <input
              type="number"
              className="input"
              placeholder="10000"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Target Date</label>
            <input
              type="date"
              className="input"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={newGoal.categoryId}
              onChange={(e) => setNewGoal({ ...newGoal, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Contribution Amount</label>
            <input
              type="number"
              className="input"
              placeholder="200"
              value={newGoal.contributionAmount}
              onChange={(e) => setNewGoal({ ...newGoal, contributionAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Frequency</label>
            <select
              className="input"
              value={newGoal.contributionFrequency}
              onChange={(e) => setNewGoal({ ...newGoal, contributionFrequency: e.target.value as any })}
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="pay-period">Pay Period</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </button>
        </div>
      </div>

      {/* Goal Insights */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Goal Insights</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">On Track Goals</h4>
            <div className="space-y-2">
              {goals
                .filter(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return progress >= 25; // Assuming 25% is "on track"
                })
                .map(goal => (
                  <div key={goal.id} className="flex justify-between">
                    <span className="text-sm text-gray-600">{goal.name}</span>
                    <span className="text-sm font-medium text-success-600">
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Needs Attention</h4>
            <div className="space-y-2">
              {goals
                .filter(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return progress < 25;
                })
                .map(goal => (
                  <div key={goal.id} className="flex justify-between">
                    <span className="text-sm text-gray-600">{goal.name}</span>
                    <span className="text-sm font-medium text-warning-600">
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Remaining</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(totalRemaining)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Contributions</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(goals.reduce((sum, goal) => sum + goal.contributionAmount, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Completion Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(goals.reduce((sum, goal) => {
                    const months = calculateMonthsToGoal(goal.currentAmount, goal.targetAmount, goal.contributionAmount);
                    return sum + (months === Infinity ? 0 : months);
                  }, 0) / goals.length) || 0} months
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;