import React, { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { plaidConfig, isPlaidConfigured } from '../../config/plaid';
import { logPlaidAPICall, logSecurityEvent } from '../../utils/logger';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit?: (error: any, metadata: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
  className?: string;
  children?: React.ReactNode;
}

const PlaidLink: React.FC<PlaidLinkProps> = ({
  onSuccess,
  onExit,
  onEvent,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSuccess = useCallback((publicToken: string, metadata: any) => {
    setIsLoading(false);
    console.log('Plaid Link success:', { publicToken, metadata });
    
    // Log successful Plaid connection
    logPlaidAPICall('LINK_SUCCESS', true, {
      institution: metadata.institution?.name,
      accountsCount: metadata.accounts?.length,
      linkSessionId: metadata.link_session_id
    });
    
    onSuccess(publicToken, metadata);
  }, [onSuccess]);

  const handleOnExit = useCallback((error: any, metadata: any) => {
    setIsLoading(false);
    console.log('Plaid Link exit:', { error, metadata });
    
    // Log Plaid connection exit/failure
    logPlaidAPICall('LINK_EXIT', !error, {
      errorType: error?.error_type,
      errorCode: error?.error_code,
      exitStatus: metadata?.status,
      linkSessionId: metadata?.link_session_id
    });
    
    if (onExit) {
      onExit(error, metadata);
    }
  }, [onExit]);

  const handleOnEvent = useCallback((eventName: string, metadata: any) => {
    console.log('Plaid Link event:', { eventName, metadata });
    
    // Log Plaid events for security monitoring
    logPlaidAPICall(`LINK_EVENT_${eventName}`, true, {
      eventName,
      linkSessionId: metadata?.link_session_id,
      timestamp: new Date().toISOString()
    });
    
    if (eventName === 'OPEN') {
      setIsLoading(true);
    }
    if (onEvent) {
      onEvent(eventName, metadata);
    }
  }, [onEvent]);

  const config = {
    token: null, // We'll need to get this from backend
    onSuccess: handleOnSuccess,
    onExit: handleOnExit,
    onEvent: handleOnEvent,
    env: plaidConfig.environment as 'sandbox' | 'production' | 'development',
    product: plaidConfig.products,
    clientName: plaidConfig.clientName,
    countryCodes: plaidConfig.countryCodes,
    language: plaidConfig.language,
  };

  const { open, ready, error } = usePlaidLink(config);

  // Check if Plaid is configured
  if (!isPlaidConfigured()) {
    return (
      <div className="card border-warning-200 bg-warning-50">
        <div className="card-header">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-warning-600 mr-2" />
            <h3 className="text-sm font-medium text-warning-800">Plaid Configuration Required</h3>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-warning-700">
            To connect your bank accounts, you need to configure Plaid API credentials.
          </p>
          <div className="text-sm text-warning-600 space-y-1">
            <p>1. Create a Plaid account at <a href="https://plaid.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-warning-800">plaid.com</a></p>
            <p>2. Get your Client ID and Public Key from the Plaid Dashboard</p>
            <p>3. Create a <code className="bg-warning-100 px-1 rounded">.env</code> file with:</p>
            <div className="bg-warning-100 p-2 rounded text-xs font-mono">
              VITE_PLAID_CLIENT_ID=your_client_id<br />
              VITE_PLAID_PUBLIC_KEY=your_public_key<br />
              VITE_PLAID_ENVIRONMENT=sandbox
            </div>
          </div>
          <a 
            href="https://plaid.com/docs/quickstart/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-warning-700 hover:text-warning-900 underline"
          >
            View Plaid Setup Guide
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    );
  }

  // Show error if Plaid Link has an error
  if (error) {
    return (
      <div className="card border-danger-200 bg-danger-50">
        <div className="card-header">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-danger-600 mr-2" />
            <h3 className="text-sm font-medium text-danger-800">Connection Error</h3>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-danger-700">
            Unable to initialize bank connection. Please try again later.
          </p>
          <p className="text-xs text-danger-600">
            Error: {error.message || 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (ready) {
      open();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!ready || isLoading}
      className={`btn-primary ${className} ${(!ready || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Connecting...
        </div>
      ) : (
        children || 'Connect Bank Account'
      )}
    </button>
  );
};

export default PlaidLink;