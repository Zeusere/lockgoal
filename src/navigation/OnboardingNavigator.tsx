import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from './types';
import {Welcome} from '../screens/onboarding/Welcome';
import {SetGoal} from '../screens/onboarding/SetGoal';
import {SelectApps} from '../screens/onboarding/SelectApps';
import {Permissions} from '../screens/onboarding/Permissions';
import {Ready} from '../screens/onboarding/Ready';
import {Paywall} from '../screens/onboarding/Paywall';
import {colors} from '../theme';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SetGoal" component={SetGoal} />
      <Stack.Screen name="SelectApps" component={SelectApps} />
      <Stack.Screen name="Permissions" component={Permissions} />
      <Stack.Screen name="Paywall" component={Paywall} />
      <Stack.Screen name="Ready" component={Ready} />
    </Stack.Navigator>
  );
};
