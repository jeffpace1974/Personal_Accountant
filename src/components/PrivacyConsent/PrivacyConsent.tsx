import React, { useState } from 'react';
import { logDataAccess, logSecurityEvent } from '../../utils/logger';
import { setSecureItem, getSecureItem } from '../../utils/encryption';
import { Shield, Check, AlertCircle, FileText, ExternalLink } from 'lucide-react';

interface ConsentData {
  financialData: boolean;
  transactionHistory: boolean;
  accountInformation: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

interface PrivacyConsentProps {
  onConsentComplete: (consents: ConsentData) => void;
  onDecline: () => void;
  isVisible: boolean;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({
  onConsentComplete,
  onDecline,
  isVisible
}) => {
  const [consents, setConsents] = useState<ConsentData>({
    financialData: false,
    transactionHistory: false,
    accountInformation: false,
    analytics: false,
    marketing: false,
    timestamp: '',
    version: '1.0'
  });

  const [showDetails, setShowDetails] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleConsentChange = (type: keyof ConsentData, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [type]: value
    }));

    // Log consent changes for audit trail
    logDataAccess('CONSENT_CHANGE', type, true, undefined, {
      consentType: type,
      value: value,
      timestamp: new Date().toISOString()
    });
  };

  const handleAcceptAll = () => {
    const fullConsent: ConsentData = {
      financialData: true,
      transactionHistory: true,
      accountInformation: true,
      analytics: true,
      marketing: false, // Keep marketing opt-out by default
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    setConsents(fullConsent);
    processConsent(fullConsent);
  };

  const handleCustomConsent = () => {
    if (!consents.financialData || !consents.accountInformation) {
      logSecurityEvent('INSUFFICIENT_CONSENT', false, {
        requiredConsents: ['financialData', 'accountInformation'],
        providedConsents: consents
      });
      return;
    }

    if (!acceptedTerms) {
      logSecurityEvent('TERMS_NOT_ACCEPTED', false);
      return;
    }

    const finalConsent: ConsentData = {
      ...consents,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    processConsent(finalConsent);
  };

  const processConsent = (consentData: ConsentData) => {
    try {
      // Store consent record securely
      setSecureItem('user_consent', JSON.stringify(consentData));
      
      // Log successful consent for compliance
      logDataAccess('CONSENT_GRANTED', 'USER_CONSENT', true, undefined, {
        consentTypes: Object.entries(consentData)
          .filter(([key, value]) => key !== 'timestamp' && key !== 'version' && value)
          .map(([key]) => key),
        timestamp: consentData.timestamp,
        version: consentData.version
      });

      onConsentComplete(consentData);
    } catch (error) {
      logSecurityEvent('CONSENT_STORAGE_FAILED', false, { error: error.message });
    }
  };

  const handleDecline = () => {
    logDataAccess('CONSENT_DECLINED', 'USER_CONSENT', true, undefined, {
      timestamp: new Date().toISOString(),
      reason: 'User declined consent'
    });
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Privacy & Data Consent</h2>
                <p className="text-sm text-gray-600">Your privacy is important to us. Please review and consent to data collection.</p>
              </div>
            </div>

            {/* Privacy Notice Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What We Collect & Why</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Financial Data:</strong> Account balances and information to provide budgeting services</p>
                <p>• <strong>Transaction History:</strong> Transaction details to categorize and track spending</p>
                <p>• <strong>Account Information:</strong> Basic account details for service functionality</p>
                <p>• <strong>Usage Analytics:</strong> How you use the app to improve our services (optional)</p>
              </div>
            </div>

            {/* Required Consents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Permissions</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="financialData"
                      checked={consents.financialData}
                      onChange={(e) => handleConsentChange('financialData', e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="financialData" className="text-sm font-medium text-gray-900">
                      Financial Account Data Collection <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600">
                      We need access to your bank account information to provide personal financial management services.
                      This includes account balances, account names, and basic account details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="transactionHistory"
                      checked={consents.transactionHistory}
                      onChange={(e) => handleConsentChange('transactionHistory', e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="transactionHistory" className="text-sm font-medium text-gray-900">
                      Transaction History Access
                    </label>
                    <p className="text-sm text-gray-600">
                      Access to your transaction history to provide budgeting, categorization, and spending analysis features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="accountInformation"
                      checked={consents.accountInformation}
                      onChange={(e) => handleConsentChange('accountInformation', e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="accountInformation" className="text-sm font-medium text-gray-900">
                      Account Management Information <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600">
                      Basic account information needed to manage your Personal Accountant profile and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Consents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Permissions</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={consents.analytics}
                      onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="analytics" className="text-sm font-medium text-gray-900">
                      Usage Analytics & App Improvement
                    </label>
                    <p className="text-sm text-gray-600">
                      Help us improve the app by sharing anonymized usage patterns and feature usage statistics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={consents.marketing}
                      onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="marketing" className="text-sm font-medium text-gray-900">
                      Marketing Communications
                    </label>
                    <p className="text-sm text-gray-600">
                      Receive updates about new features, financial tips, and service announcements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="acceptTerms" className="text-sm font-medium text-gray-900">
                    I agree to the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-sm text-primary-600 hover:text-primary-800 underline flex items-center"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Privacy Policy
                    </button>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-sm text-primary-600 hover:text-primary-800 underline flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Terms of Service
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Rights Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-green-900 mb-2">Your Privacy Rights</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• <strong>Right to Access:</strong> View all data we've collected about you</p>
                <p>• <strong>Right to Correct:</strong> Update any inaccurate information</p>
                <p>• <strong>Right to Delete:</strong> Request deletion of your personal data</p>
                <p>• <strong>Right to Withdraw:</strong> Change your consent preferences at any time</p>
                <p>• <strong>Right to Export:</strong> Download your data in a portable format</p>
              </div>
            </div>

            {/* Data Security Information */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-indigo-900 mb-2">How We Protect Your Data</h4>
              <div className="text-sm text-indigo-800 space-y-1">
                <p>• <strong>Encryption:</strong> All financial data encrypted with bank-level security (AES-256)</p>
                <p>• <strong>Access Control:</strong> Multi-factor authentication and least privilege access</p>
                <p>• <strong>Monitoring:</strong> 24/7 security monitoring and incident response</p>
                <p>• <strong>Compliance:</strong> GLBA, FCRA, and privacy law compliance</p>
                <p>• <strong>No Sale:</strong> We never sell your financial data to third parties</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleDecline}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Decline & Exit
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept All & Continue
              </button>
              <button
                onClick={handleCustomConsent}
                disabled={!consents.financialData || !consents.accountInformation || !acceptedTerms}
                className="px-6 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Save Custom Preferences
              </button>
            </div>

            {/* Required Fields Notice */}
            {(!consents.financialData || !consents.accountInformation || !acceptedTerms) && (
              <div className="mt-4 flex items-center text-sm text-orange-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Required fields must be accepted to use Personal Accountant services.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsent;