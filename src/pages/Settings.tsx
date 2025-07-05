import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';
import { getCurrentYearBankHolidays } from '../utils/bankHolidays';
import { getCurrentYearFederalHolidays, getOPMHolidayURL } from '../utils/federalHolidays';
import BankConnection from '../components/BankConnection/BankConnection';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Calendar, 
  DollarSign,
  Bell,
  Shield,
  User,
  Trash2,
  Plus,
  Save
} from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const { accounts, incomeStreams, holidays } = state;
  const [activeTab, setActiveTab] = useState('general');
  const [selectedHolidaySet, setSelectedHolidaySet] = useState('us-bank');
  const [showBankConnection, setShowBankConnection] = useState(false);
  
  // Get current year's holidays
  const currentYearBankHolidays = getCurrentYearBankHolidays();
  const currentYearFederalHolidays = getCurrentYearFederalHolidays();
  const currentYear = new Date().getFullYear();

  // Group accounts by bank
  const accountsByBank = accounts.reduce((acc, account) => {
    const bankName = account.bankName || 'Unknown Bank';
    if (!acc[bankName]) {
      acc[bankName] = [];
    }
    acc[bankName].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  const handleDisconnectBank = (bankName: string) => {
    const accountsToRemove = accountsByBank[bankName];
    accountsToRemove.forEach(account => {
      dispatch({ type: 'DELETE_ACCOUNT', payload: account.id });
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'accounts', name: 'Accounts', icon: CreditCard },
    { id: 'income', name: 'Income Streams', icon: DollarSign },
    { id: 'holidays', name: 'Holidays', icon: Calendar },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Profile Settings</h3>
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" defaultValue="Jeff Pace" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" defaultValue="jeff@example.com" />
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="input">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="label">Date Format</label>
            <select className="input">
              <option value="MM/dd/yyyy">MM/dd/yyyy</option>
              <option value="dd/MM/yyyy">dd/MM/yyyy</option>
              <option value="yyyy-MM-dd">yyyy-MM-dd</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">App Preferences</h3>
          <SettingsIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Dark Mode</label>
              <p className="text-sm text-gray-500">Use dark theme throughout the application</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Auto-categorize Transactions</label>
              <p className="text-sm text-gray-500">Automatically categorize similar transactions</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Budget Alerts</label>
              <p className="text-sm text-gray-500">Receive alerts when approaching budget limits</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Connected Accounts</h3>
          <CreditCard className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {Object.keys(accountsByBank).length > 0 ? (
            Object.entries(accountsByBank).map(([bankName, bankAccounts]) => (
              <div key={bankName} className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                    <span className="text-success-600 font-semibold">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{bankName}</p>
                    <p className="text-sm text-gray-500">
                      Connected • {bankAccounts.length} account{bankAccounts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="badge-success">Connected</span>
                  <button 
                    onClick={() => handleDisconnectBank(bankName)}
                    className="btn-secondary text-sm hover:bg-red-50 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No Connected Accounts</h3>
              <p className="mt-2 text-sm text-gray-500">
                Connect your bank accounts to automatically import transactions and balances.
              </p>
            </div>
          )}
          
          <div className="pt-4">
            <button
              onClick={() => setShowBankConnection(true)}
              className="btn-primary w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Bank Account
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Sync Settings</h3>
          <SettingsIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Sync Frequency</label>
            <select className="input">
              <option value="realtime">Real-time</option>
              <option value="hourly">Every hour</option>
              <option value="daily">Daily</option>
              <option value="manual">Manual only</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Auto-sync on app open</label>
              <p className="text-sm text-gray-500">Automatically sync when opening the app</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Income Streams</h3>
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {incomeStreams.map((stream) => (
            <div key={stream.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{stream.name}</h4>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary text-sm">Edit</button>
                  <button className="btn-secondary text-sm text-danger-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-2 font-medium">${stream.amount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>
                  <span className="ml-2 font-medium">{stream.frequency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Pay Dates:</span>
                  <span className="ml-2 font-medium">{stream.payDates.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Income Stream
          </button>
        </div>
      </div>
    </div>
  );

  const renderHolidaySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Holiday Calendar</h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Holiday Set</label>
              <select 
                className="input"
                value={selectedHolidaySet}
                onChange={(e) => setSelectedHolidaySet(e.target.value)}
              >
                <option value="us-federal">US Federal Holidays</option>
                <option value="us-bank">US Bank Holidays</option>
                <option value="custom">Custom Only</option>
              </select>
            </div>
            <div>
              <label className="label">Pay Date Adjustment</label>
              <select className="input">
                <option value="before">Move to day before</option>
                <option value="after">Move to day after</option>
                <option value="closest">Move to closest business day</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* US Bank Holidays Table */}
      {selectedHolidaySet === 'us-bank' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">US Bank Holidays {new Date().getFullYear()}</h3>
            <div className="text-sm text-gray-500">
              Source: <a 
                href="https://www.federalreserve.gov/aboutthefed/k8.htm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                Federal Reserve
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holiday Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day of Week
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentYearBankHolidays.map((holiday, index) => {
                  const isObservedDifferent = holiday.date.getTime() !== holiday.observedDate.getTime();
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{holiday.name}</div>
                        <div className="text-sm text-gray-500">{holiday.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(holiday.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isObservedDifferent ? 'text-warning-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(holiday.observedDate)}
                          {isObservedDifferent && (
                            <span className="text-xs text-warning-500 block">
                              (Weekend adjustment)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {holiday.observedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Weekend Adjustment Rules</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• If a holiday falls on <strong>Saturday</strong>, it is typically observed on <strong>Friday</strong></p>
              <p>• If a holiday falls on <strong>Sunday</strong>, it is typically observed on <strong>Monday</strong></p>
              <p>• These adjustments ensure banks are closed on business days adjacent to weekends</p>
            </div>
          </div>
        </div>
      )}

      {/* US Federal Holidays Table */}
      {selectedHolidaySet === 'us-federal' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">US Federal Holidays {currentYear}</h3>
            <div className="text-sm text-gray-500">
              Source: <a 
                href={getOPMHolidayURL(currentYear)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                Office of Personnel Management
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holiday Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day of Week
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentYearFederalHolidays.map((holiday, index) => {
                  const isObservedDifferent = holiday.date.getTime() !== holiday.observedDate.getTime();
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {holiday.name}
                          {holiday.isInaugurationDay && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              DC Area Only
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{holiday.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(holiday.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isObservedDifferent ? 'text-warning-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(holiday.observedDate)}
                          {isObservedDifferent && (
                            <span className="text-xs text-warning-500 block">
                              (Weekend adjustment)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {holiday.observedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Federal Employee Holiday Rules</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• If a holiday falls on <strong>Saturday</strong>, federal employees typically get <strong>Friday</strong> off</p>
              <p>• If a holiday falls on <strong>Sunday</strong>, federal employees typically get <strong>Monday</strong> off</p>
              <p>• <strong>Inauguration Day</strong> (every 4 years) applies only to federal employees in the Washington, D.C. area</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Custom Holidays</h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {holidays.filter(h => h.type === 'custom').map((holiday) => (
            <div key={holiday.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                <p className="text-sm text-gray-500">{holiday.date.toLocaleDateString()}</p>
              </div>
              <button className="btn-secondary text-sm text-danger-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" className="input" placeholder="Holiday name" />
            <input type="date" className="input" />
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Notification Preferences</h3>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Budget Alerts</label>
              <p className="text-sm text-gray-500">Notify when approaching budget limits</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Goal Milestones</label>
              <p className="text-sm text-gray-500">Notify when reaching savings goal milestones</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Large Transactions</label>
              <p className="text-sm text-gray-500">Notify for transactions over a certain amount</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Weekly Summary</label>
              <p className="text-sm text-gray-500">Receive weekly spending summaries</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alert Thresholds</h3>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Budget Warning (%)</label>
            <input type="number" className="input" defaultValue="80" min="0" max="100" />
          </div>
          <div>
            <label className="label">Large Transaction ($)</label>
            <input type="number" className="input" defaultValue="500" min="0" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Security Settings</h3>
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="btn-secondary text-sm">Enable</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Session Timeout</label>
              <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
            </div>
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Data & Privacy</h3>
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Data Export</h4>
            <p className="text-sm text-gray-500 mb-3">
              Download all your financial data in a portable format
            </p>
            <button className="btn-secondary">Export Data</button>
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-danger-900 mb-2">Danger Zone</h4>
            <p className="text-sm text-gray-500 mb-3">
              These actions cannot be undone. Please be careful.
            </p>
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'accounts':
        return renderAccountSettings();
      case 'income':
        return renderIncomeSettings();
      case 'holidays':
        return renderHolidaySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Settings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and application settings
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <button className="btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Tabs */}
          <div className="lg:w-64 mb-6 lg:mb-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border-primary-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md border border-transparent`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Bank Connection Modal */}
      <BankConnection
        isOpen={showBankConnection}
        onClose={() => setShowBankConnection(false)}
      />
    </>
  );
};

export default Settings;