/**
 * Screen Time Module - JS Interface
 *
 * This module provides a bridge to the native iOS Screen Time API.
 * On non-iOS platforms or in development, it uses a mock implementation.
 *
 * The native Swift implementation uses:
 * - FamilyControls: For authorization to manage screen time
 * - ManagedSettings: For blocking/shielding apps
 * - DeviceActivity: For monitoring app usage
 */

import {NativeModules, Platform} from 'react-native';

interface ScreenTimeInterface {
  requestAuthorization: () => Promise<boolean>;
  isAuthorized: () => Promise<boolean>;
  blockApps: (appIdentifiers: string[]) => Promise<void>;
  unblockAllApps: () => Promise<void>;
}

// Mock implementation for development on non-iOS platforms
const MockScreenTimeModule: ScreenTimeInterface = {
  requestAuthorization: async () => {
    console.log('[ScreenTime Mock] Authorization requested');
    return true;
  },
  isAuthorized: async () => {
    console.log('[ScreenTime Mock] Checking authorization');
    return true;
  },
  blockApps: async (appIdentifiers: string[]) => {
    console.log('[ScreenTime Mock] Blocking apps:', appIdentifiers);
  },
  unblockAllApps: async () => {
    console.log('[ScreenTime Mock] Unblocking all apps');
  },
};

// Use native module on iOS if available, otherwise use mock
const ScreenTimeModule: ScreenTimeInterface =
  Platform.OS === 'ios' && NativeModules.ScreenTimeManager
    ? NativeModules.ScreenTimeManager
    : MockScreenTimeModule;

export default ScreenTimeModule;
