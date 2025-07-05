import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/dateUtils';
import { CreditCard, Eye, EyeOff, RefreshCw, Link } from 'lucide-react';
import BankConnection from '../components/BankConnection/BankConnection';

const Accounts: React.FC = () => {
  const { state } = useApp();
  const { accounts } = state;
  const [showBalances, setShowBalances] = useState(true);
  const [showBankConnection, setShowBankConnection] = useState(false);

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return '🏦';
      case 'savings':
        return '💰';
      case 'credit':
        return '💳';
      default:
        return '📄';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-primary-100 text-primary-800';
      case 'savings':
        return 'bg-success-100 text-success-800';
      case 'credit':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalPendingCharges = accounts
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + Math.abs(account.pendingBalance - account.balance), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Accounts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your bank accounts and credit cards
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="btn-secondary"
          >
            {showBalances ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </button>
          <button className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Accounts
          </button>
          <button 
            onClick={() => setShowBankConnection(true)}
            className="btn-primary"
          >
            <Link className="h-4 w-4 mr-2" />
            Connect Bank Account
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <span className="text-success-600 font-semibold">💰</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {showBalances ? formatCurrency(totalBalance) : '••••••'}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                <span className="text-warning-600 font-semibold">💳</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Charges</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {showBalances ? formatCurrency(totalPendingCharges) : '••••••'}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">💵</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Available Funds</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {showBalances ? formatCurrency(totalBalance - totalPendingCharges) : '••••••'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Your Accounts</h3>
          <CreditCard className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="space-y-4">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">No accounts connected</h3>
                        <p className="text-sm text-gray-500">
                          Connect your Bank of America accounts to get started with automatic transaction import.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBankConnection(true)}
                        className="btn-primary"
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Connect Your First Account
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-lg">{getAccountTypeIcon(account.type)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.bankName} • {account.accountNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {showBalances ? formatCurrency(account.balance) : '••••••'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {showBalances ? (
                      account.type === 'credit' ? 
                        formatCurrency((account.creditLimit || 0) + account.balance) : 
                        formatCurrency(account.pendingBalance)
                    ) : '••••••'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      account.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">View Details</button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details - Bank Integration Info */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Bank Integration Status</h3>
          <RefreshCw className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <span className="text-success-600 font-semibold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Bank of America</p>
                <p className="text-sm text-gray-500">Connected • Last sync: 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge-success">Connected</span>
              <button className="btn-secondary text-xs">
                Sync Now
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Integration Features</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time transaction import</li>
              <li>• Automatic balance updates</li>
              <li>• Pending transaction tracking</li>
              <li>• Credit card monitoring</li>
              <li>• Read-only access (secure)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bank Connection Modal */}
      <BankConnection 
        isOpen={showBankConnection} 
        onClose={() => setShowBankConnection(false)} 
      />
    </div>
  );
};

export default Accounts;