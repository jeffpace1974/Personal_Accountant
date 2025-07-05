// Plaid configuration
export const plaidConfig = {
  clientId: import.meta.env.VITE_PLAID_CLIENT_ID || '',
  publicKey: import.meta.env.VITE_PLAID_PUBLIC_KEY || '',
  environment: import.meta.env.VITE_PLAID_ENVIRONMENT || 'sandbox',
  clientName: 'Personal Accountant',
  countryCodes: ['US'] as const,
  language: 'en' as const,
  products: ['transactions', 'accounts'] as const,
};

// Validate Plaid configuration
export const validatePlaidConfig = (): boolean => {
  if (!plaidConfig.clientId) {
    console.error('Plaid Client ID is required. Set VITE_PLAID_CLIENT_ID in your .env file.');
    return false;
  }
  
  if (!plaidConfig.publicKey) {
    console.error('Plaid Public Key is required. Set VITE_PLAID_PUBLIC_KEY in your .env file.');
    return false;
  }
  
  return true;
};

// Check if Plaid is properly configured
export const isPlaidConfigured = (): boolean => {
  return Boolean(plaidConfig.clientId && plaidConfig.publicKey);
};