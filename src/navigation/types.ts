import {NavigatorScreenParams} from '@react-navigation/native';

export type OnboardingStackParamList = {
  Welcome: undefined;
  SetGoal: undefined;
  SelectApps: undefined;
  Permissions: undefined;
  Ready: undefined;
};

export type MainTabParamList = {
  Today: undefined;
  Capture: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
