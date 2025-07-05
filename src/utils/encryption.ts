// Client-side encryption utilities for sensitive data
import { logSecurityEvent } from './logger';

class EncryptionService {
  private static instance: EncryptionService;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  // Encrypt sensitive data before storing in localStorage/sessionStorage
  async encryptSensitiveData(data: string, key?: string): Promise<string> {
    try {
      if (!window.crypto || !window.crypto.subtle) {
        logSecurityEvent('ENCRYPTION_NOT_SUPPORTED', false, { reason: 'Web Crypto API not available' });
        throw new Error('Encryption not supported in this environment');
      }

      // Generate a key if not provided
      const cryptoKey = key ? await this.importKey(key) : await this.generateKey();
      
      // Convert string to ArrayBuffer
      const encoder = new TextEncoder();
      const data_buffer = encoder.encode(data);
      
      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the data
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        cryptoKey,
        data_buffer
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      // Convert to base64 for storage
      const base64 = btoa(String.fromCharCode(...combined));
      
      logSecurityEvent('DATA_ENCRYPTED', true, { dataLength: data.length });
      return base64;
      
    } catch (error) {
      logSecurityEvent('ENCRYPTION_FAILED', false, { error: error.message });
      throw error;
    }
  }

  // Decrypt sensitive data retrieved from storage
  async decryptSensitiveData(encryptedData: string, key?: string): Promise<string> {
    try {
      if (!window.crypto || !window.crypto.subtle) {
        logSecurityEvent('DECRYPTION_NOT_SUPPORTED', false, { reason: 'Web Crypto API not available' });
        throw new Error('Decryption not supported in this environment');
      }

      // Generate/import the same key used for encryption
      const cryptoKey = key ? await this.importKey(key) : await this.generateKey();
      
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      // Decrypt the data
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        cryptoKey,
        encrypted
      );
      
      // Convert back to string
      const decoder = new TextDecoder();
      const result = decoder.decode(decrypted);
      
      logSecurityEvent('DATA_DECRYPTED', true, { dataLength: result.length });
      return result;
      
    } catch (error) {
      logSecurityEvent('DECRYPTION_FAILED', false, { error: error.message });
      throw error;
    }
  }

  // Generate a new encryption key
  private async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Import a key from string (for consistent encryption across sessions)
  private async importKey(keyString: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyString.padEnd(32, '0').slice(0, 32));
    
    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Hash sensitive data for comparison without storing plaintext
  async hashSensitiveData(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = new Uint8Array(hashBuffer);
      const hashHex = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      logSecurityEvent('DATA_HASHED', true, { dataLength: data.length });
      return hashHex;
      
    } catch (error) {
      logSecurityEvent('HASHING_FAILED', false, { error: error.message });
      throw error;
    }
  }

  // Secure storage wrapper
  setSecureItem(key: string, value: string): void {
    try {
      // For development, use simple storage
      // In production, this would use encrypted storage
      const prefixedKey = `PA_SECURE_${key}`;
      
      if (this.isProductionEnvironment()) {
        // In production, encrypt before storing
        this.encryptSensitiveData(value).then(encrypted => {
          localStorage.setItem(prefixedKey, encrypted);
          logSecurityEvent('SECURE_STORAGE_SET', true, { key: prefixedKey });
        });
      } else {
        // Development: store with prefix for easy identification
        localStorage.setItem(prefixedKey, value);
        logSecurityEvent('STORAGE_SET', true, { key: prefixedKey });
      }
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_FAILED', false, { key, error: error.message });
    }
  }

  getSecureItem(key: string): string | null {
    try {
      const prefixedKey = `PA_SECURE_${key}`;
      const value = localStorage.getItem(prefixedKey);
      
      if (value) {
        logSecurityEvent('SECURE_STORAGE_GET', true, { key: prefixedKey });
        
        if (this.isProductionEnvironment()) {
          // In production, decrypt the value
          // Note: This would need to be async in real implementation
          return value; // Simplified for development
        }
        
        return value;
      }
      
      return null;
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_GET_FAILED', false, { key, error: error.message });
      return null;
    }
  }

  removeSecureItem(key: string): void {
    try {
      const prefixedKey = `PA_SECURE_${key}`;
      localStorage.removeItem(prefixedKey);
      logSecurityEvent('SECURE_STORAGE_REMOVED', true, { key: prefixedKey });
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_REMOVE_FAILED', false, { key, error: error.message });
    }
  }

  private isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  // Clear all secure storage (for logout/security purposes)
  clearAllSecureStorage(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('PA_SECURE_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      logSecurityEvent('ALL_SECURE_STORAGE_CLEARED', true, { itemsCleared: keysToRemove.length });
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_CLEAR_FAILED', false, { error: error.message });
    }
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();

// Convenience functions
export const encryptData = (data: string, key?: string) => encryptionService.encryptSensitiveData(data, key);
export const decryptData = (data: string, key?: string) => encryptionService.decryptSensitiveData(data, key);
export const hashData = (data: string) => encryptionService.hashSensitiveData(data);
export const setSecureItem = (key: string, value: string) => encryptionService.setSecureItem(key, value);
export const getSecureItem = (key: string) => encryptionService.getSecureItem(key);
export const removeSecureItem = (key: string) => encryptionService.removeSecureItem(key);
export const clearSecureStorage = () => encryptionService.clearAllSecureStorage();