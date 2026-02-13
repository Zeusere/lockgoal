import {useState, useCallback} from 'react';
import ScreenTimeModule from '../native/ScreenTimeModule';
import {useGoalStore} from '../store/useGoalStore';
import {useAppStore} from '../store/useAppStore';

export const useScreenTime = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isGoalMet = useGoalStore(state => state.isGoalMet);
  const blockedAppIds = useAppStore(state => state.blockedAppIds);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authorized = await ScreenTimeModule.requestAuthorization();
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('Failed to request Screen Time authorization:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuthorization = useCallback(async () => {
    try {
      const authorized = await ScreenTimeModule.isAuthorized();
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('Failed to check authorization:', error);
      return false;
    }
  }, []);

  const syncBlockStatus = useCallback(async () => {
    if (!isAuthorized) {
      return;
    }

    try {
      if (isGoalMet) {
        await ScreenTimeModule.unblockAllApps();
      } else {
        await ScreenTimeModule.blockApps(blockedAppIds);
      }
    } catch (error) {
      console.error('Failed to sync block status:', error);
    }
  }, [isAuthorized, isGoalMet, blockedAppIds]);

  return {
    isAuthorized,
    isLoading,
    requestPermission,
    checkAuthorization,
    syncBlockStatus,
  };
};
