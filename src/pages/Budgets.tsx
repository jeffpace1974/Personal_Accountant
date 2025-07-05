import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/dateUtils';
import { 
  Plus, 
  PieChart, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';

const Budgets: React.FC = () => {
  const { state, dispatch } = useApp();
  const { budgets, categories, dashboardData } = state;
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getBudgetAnalysis = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return null;
    
    return dashboardData.budgetAnalysis.find(a => a.categoryId === budget.categoryId);
  };

  const handleEditBudget = (budgetId: string, currentAmount: number) => {
    setEditingBudget(budgetId);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveBudget = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const newAmount = parseFloat(editAmount);
    if (isNaN(newAmount) || newAmount <= 0) return;

    const updatedBudget = {
      ...budget,
      amount: newAmount,
      updatedAt: new Date()
    };

    dispatch({ type: 'UPDATE_BUDGET', payload: updatedBudget });
    
    // Add budget adjustment record
    const adjustment = {
      id: Date.now().toString(),
      budgetId: budgetId,
      oldAmount: budget.amount,
      newAmount: newAmount,
      reason: 'Manual adjustment',
      adjustmentDate: new Date(),
      adjustedBy: 'User',
      createdAt: new Date()
    };
    
    dispatch({ type: 'ADD_BUDGET_ADJUSTMENT', payload: adjustment });
    
    setEditingBudget(null);
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setEditAmount('');
  };

  const getStatusColor = (analysis: any) => {
    if (!analysis) return 'text-gray-500';
    if (analysis.isOverBudget) return 'text-danger-600';
    if (analysis.percentageUsed > 80) return 'text-warning-600';
    return 'text-success-600';
  };

  const getProgressBarColor = (analysis: any) => {
    if (!analysis) return 'bg-gray-300';
    if (analysis.isOverBudget) return 'bg-danger-500';
    if (analysis.percentageUsed > 80) return 'bg-warning-500';
    return 'bg-success-500';
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = dashboardData.budgetAnalysis.reduce((sum, analysis) => sum + analysis.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Budgets
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your spending budgets
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
          <button className="btn-secondary">
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Budget</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalBudget)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-danger-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Spent</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalSpent)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Remaining</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalRemaining)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">On Track</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {dashboardData.budgetAnalysis.filter(a => !a.isOverBudget && a.percentageUsed <= 80).length} of {budgets.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Budget Categories</h3>
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-6">
          {budgets.map((budget) => {
            const analysis = getBudgetAnalysis(budget.id);
            const isEditing = editingBudget === budget.id;
            
            return (
              <div key={budget.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {getCategoryName(budget.categoryId)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {budget.period} budget • {budget.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => handleEditBudget(budget.id, budget.amount)}
                          className="btn-secondary text-sm"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button className="btn-secondary text-sm text-danger-600 hover:text-danger-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget Amount</label>
                    {isEditing ? (
                      <div className="mt-1 flex space-x-2">
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="input text-sm"
                          step="0.01"
                          min="0"
                        />
                        <button
                          onClick={() => handleSaveBudget(budget.id)}
                          className="btn-success text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(budget.amount)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Spent</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {analysis ? formatCurrency(analysis.spentAmount) : formatCurrency(0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Remaining</label>
                    <p className={`text-lg font-semibold ${getStatusColor(analysis)}`}>
                      {analysis ? formatCurrency(analysis.remainingAmount) : formatCurrency(budget.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Daily Limit</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {analysis ? formatCurrency(analysis.dailyLimit) : formatCurrency(0)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className={`text-sm font-medium ${getStatusColor(analysis)}`}>
                      {analysis ? `${analysis.percentageUsed.toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressBarColor(analysis)}`}
                      style={{ 
                        width: `${analysis ? Math.min(analysis.percentageUsed, 100) : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {analysis ? `${analysis.daysRemaining} days remaining` : 'No transactions yet'}
                  </span>
                  {analysis && analysis.isOverBudget && (
                    <span className="badge-danger">Over Budget</span>
                  )}
                  {analysis && !analysis.isOverBudget && analysis.percentageUsed > 80 && (
                    <span className="badge-warning">Budget Warning</span>
                  )}
                  {analysis && analysis.percentageUsed <= 80 && (
                    <span className="badge-success">On Track</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Templates */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Budget Templates</h3>
          <Target className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Budget Templates</h4>
          <p className="text-gray-500 mb-4">
            Create budget templates to quickly set up budgets for future periods.
          </p>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Budget Insights */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Budget Insights</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top Spending Categories</h4>
            <div className="space-y-2">
              {dashboardData.budgetAnalysis
                .sort((a, b) => b.spentAmount - a.spentAmount)
                .slice(0, 3)
                .map((analysis) => (
                  <div key={analysis.categoryId} className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {getCategoryName(analysis.categoryId)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(analysis.spentAmount)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Budget Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories On Track</span>
                <span className="text-sm font-medium text-success-600">
                  {dashboardData.budgetAnalysis.filter(a => !a.isOverBudget && a.percentageUsed <= 80).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories At Risk</span>
                <span className="text-sm font-medium text-warning-600">
                  {dashboardData.budgetAnalysis.filter(a => !a.isOverBudget && a.percentageUsed > 80).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories Over Budget</span>
                <span className="text-sm font-medium text-danger-600">
                  {dashboardData.budgetAnalysis.filter(a => a.isOverBudget).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;