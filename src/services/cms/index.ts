// CMS Service - Main export with provider switching
import type { CMSProvider, CMSConfig, CMSProviderType } from './provider';
import { mockCMSProvider } from './mockProvider';

export * from './types';
export * from './provider';

// Current CMS configuration
let currentConfig: CMSConfig = {
  provider: 'mock',
};

// Provider instances cache
const providerInstances: Partial<Record<CMSProviderType, CMSProvider>> = {
  mock: mockCMSProvider,
};

// Get the current CMS provider
export const getCMSProvider = (): CMSProvider => {
  const provider = providerInstances[currentConfig.provider];
  if (!provider) {
    console.warn(`CMS provider "${currentConfig.provider}" not available, falling back to mock`);
    return mockCMSProvider;
  }
  return provider;
};

// Configure the CMS provider
export const configureCMS = (config: CMSConfig): void => {
  currentConfig = config;
  
  // Here you would initialize other providers based on config
  // Example for future WordPress integration:
  // if (config.provider === 'wordpress' && config.baseUrl) {
  //   providerInstances.wordpress = createWordPressProvider(config.baseUrl, config.apiKey);
  // }
};

// Get current configuration
export const getCMSConfig = (): CMSConfig => currentConfig;

// Register a custom provider
export const registerCMSProvider = (type: CMSProviderType, provider: CMSProvider): void => {
  providerInstances[type] = provider;
};

// Convenience exports for direct usage
export const cms = {
  get provider() {
    return getCMSProvider();
  },
  configure: configureCMS,
  getConfig: getCMSConfig,
  register: registerCMSProvider,
};

export default cms;
