import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import {RootStackParamList} from './types';
import {OnboardingNavigator} from './OnboardingNavigator';
import {TabNavigator} from './TabNavigator';
import {useOnboardingStore} from '../store';
import {useGoalStore} from '../store';
import {colors} from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isOnboardingComplete = useOnboardingStore(state => state.isComplete);
  const checkAndUpdateStreak = useGoalStore(
    state => state.checkAndUpdateStreak,
  );

  // Check streak status on app launch
  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.background},
        }}>
        {isOnboardingComplete ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingNavigator}
            options={{animation: 'fade'}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
