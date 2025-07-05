import React, { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Account } from '../../types';
import PlaidLink from '../PlaidLink/PlaidLink';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Lock,
  RefreshCw,
  X,
  Plus
} from 'lucide-react';

interface BankConnectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const BankConnection: React.FC<BankConnectionProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useApp();
  const [connectionStep, setConnectionStep] = useState<'select' | 'credentials' | 'accounts' | 'success'>('select');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock available Bank of America accounts after authentication
  const mockBankAccounts = [
    {
      id: 'boa-checking-001',
      name: 'Bank of America Advantage Plus Banking',
      type: 'checking' as const,
      accountNumber: '****2347',
      balance: 2847.35,
      routingNumber: '121000358'
    },
    {
      id: 'boa-savings-001',
      name: 'Bank of America Advantage Savings',
      type: 'savings' as const,
      accountNumber: '****5621',
      balance: 18250.00,
      routingNumber: '121000358'
    },
    {
      id: 'boa-credit-001',
      name: 'Bank of America Travel Rewards',
      type: 'credit' as const,
      accountNumber: '****9834',
      balance: -1247.83,
      creditLimit: 10000.00
    },
    {
      id: 'boa-credit-002',
      name: 'Bank of America Cash Rewards',
      type: 'credit' as const,
      accountNumber: '****7291',
      balance: -398.45,
      creditLimit: 5000.00
    }
  ];

  const handlePlaidSuccess = useCallback(async (publicToken: string, metadata: any) => {
    setIsConnecting(true);
    console.log('Plaid success - Public token:', publicToken);
    console.log('Account metadata:', metadata);
    
    try {
      // In a real app, you would send the public_token to your backend to exchange for an access_token
      // For now, we'll simulate the process with the metadata Plaid provides
      
      // Simulate API call to exchange public token
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create accounts from Plaid metadata
      const plaidAccounts = metadata.accounts || [];
      const newAccounts: Account[] = plaidAccounts.map((account: any, index: number) => ({
        id: `plaid-${account.id || Date.now()}-${index}`,
        name: account.name || account.official_name || 'Connected Account',
        type: account.subtype === 'checking' ? 'checking' as const :
              account.subtype === 'savings' ? 'savings' as const :
              account.type === 'credit' ? 'credit' as const : 'checking' as const,
        accountNumber: `****${account.mask || '0000'}`,
        balance: 0, // Will be fetched from real API
        pendingBalance: 0,
        bankName: metadata.institution?.name || 'Connected Bank',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      // Add accounts to the app
      newAccounts.forEach(account => {
        dispatch({ type: 'ADD_ACCOUNT', payload: account });
      });
      
      setConnectionStep('success');
    } catch (error) {
      console.error('Error processing Plaid success:', error);
      // Handle error appropriately
    } finally {
      setIsConnecting(false);
    }
  }, [dispatch]);

  const handlePlaidExit = useCallback((error: any, metadata: any) => {
    console.log('Plaid exit:', { error, metadata });
    if (error) {
      console.error('Plaid error:', error);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (connectionStep === 'credentials') {
      // Simulate authentication
      setConnectionStep('accounts');
    } else if (connectionStep === 'accounts') {
      // Add selected accounts to the app
      const newAccounts: Account[] = mockBankAccounts
        .filter(acc => selectedAccounts.includes(acc.id))
        .map(acc => ({
          ...acc,
          pendingBalance: acc.balance,
          bankName: 'Bank of America',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      
      newAccounts.forEach(account => {
        dispatch({ type: 'ADD_ACCOUNT', payload: account });
      });
      
      setConnectionStep('success');
    }
    
    setIsConnecting(false);
  };

  const renderBankSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="mx-auto h-12 w-12 text-primary-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Connect Your Bank Account</h3>
        <p className="mt-2 text-sm text-gray-500">
          Securely connect your bank accounts to automatically import transactions and balances.
        </p>
      </div>

      <div className="space-y-4">
        {/* Plaid Integration - Real Bank Connection */}
        <div className="border-2 border-primary-200 rounded-lg p-6 bg-primary-50">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <Plus className="h-6 w-6 text-primary-600 mr-2" />
              <h4 className="text-base font-medium text-gray-900">Connect Any Bank</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Connect to 11,000+ banks and credit unions including Bank of America, Chase, Wells Fargo, and more.
            </p>
          </div>
          
          <PlaidLink
            onSuccess={handlePlaidSuccess}
            onExit={handlePlaidExit}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect with Plaid
          </PlaidLink>
        </div>

        {/* Legacy Mock Connection - Bank of America */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-center mb-3">
            <h5 className="text-sm font-medium text-gray-700">Demo Mode</h5>
            <p className="text-xs text-gray-500">Test with mock Bank of America accounts</p>
          </div>
          <button
            onClick={() => setConnectionStep('credentials')}
            className="w-full btn-secondary text-sm"
          >
            Try Demo Connection
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">Bank-level Security</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your credentials are encrypted with 256-bit SSL and we use read-only access. 
              We never store your banking passwords.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCredentialsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Bank of America Login</h3>
        <p className="mt-2 text-sm text-gray-500">
          Enter your Bank of America online banking credentials to connect your accounts.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">Online ID</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your Online ID"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Passcode</label>
          <input
            type="password"
            className="input"
            placeholder="Enter your passcode"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-900">Security Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You may be prompted for additional security questions by Bank of America. 
                This is normal and helps protect your account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">What we can access:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Account balances and transaction history</li>
            <li>• Account names and numbers (last 4 digits)</li>
            <li>• Transaction descriptions and amounts</li>
            <li>• Pending transactions and holds</li>
          </ul>
          <h4 className="text-sm font-medium text-gray-900 mt-3 mb-2">What we cannot do:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Make transfers or payments</li>
            <li>• Change account settings</li>
            <li>• Access personal information beyond transactions</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setConnectionStep('select')}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={handleConnect}
          disabled={!credentials.username || !credentials.password || isConnecting}
          className="btn-primary"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Account'
          )}
        </button>
      </div>
    </div>
  );

  const renderAccountSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-success-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Select Accounts to Connect</h3>
        <p className="mt-2 text-sm text-gray-500">
          Choose which Bank of America accounts you'd like to connect to Personal Accountant.
        </p>
      </div>

      <div className="space-y-4">
        {mockBankAccounts.map((account) => (
          <div 
            key={account.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAccounts.includes(account.id) 
                ? 'border-primary-300 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              if (selectedAccounts.includes(account.id)) {
                setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
              } else {
                setSelectedAccounts([...selectedAccounts, account.id]);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    account.type === 'checking' ? 'bg-blue-100' :
                    account.type === 'savings' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    <span className="text-sm font-semibold">
                      {account.type === 'checking' ? '🏦' : 
                       account.type === 'savings' ? '💰' : '💳'}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                  <p className="text-sm text-gray-500">
                    {account.accountNumber} • ${account.balance.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 rounded"
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => {}} // Handled by div onClick
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setConnectionStep('credentials')}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={handleConnect}
          disabled={selectedAccounts.length === 0 || isConnecting}
          className="btn-primary"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting Accounts...
            </>
          ) : (
            `Connect ${selectedAccounts.length} Account${selectedAccounts.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-success-600" />
        <h3 className="mt-4 text-xl font-medium text-gray-900">Successfully Connected!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your bank accounts have been successfully connected to Personal Accountant.
        </p>
      </div>

      <div className="bg-success-50 border border-success-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-success-900 mb-2">What's Next:</h4>
        <ul className="text-sm text-success-700 space-y-1">
          <li>• Your accounts will sync automatically every hour</li>
          <li>• New transactions will be imported in real-time</li>
          <li>• You can categorize transactions as they come in</li>
          <li>• Budget tracking will update automatically</li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            onClose();
            // Navigate to accounts page
            window.location.href = '/accounts';
          }}
          className="btn-primary w-full"
        >
          View My Accounts
        </button>
        <button
          onClick={onClose}
          className="btn-secondary w-full"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {connectionStep === 'select' && renderBankSelection()}
          {connectionStep === 'credentials' && renderCredentialsForm()}
          {connectionStep === 'accounts' && renderAccountSelection()}
          {connectionStep === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default BankConnection;