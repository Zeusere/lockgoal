import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './types';
import {TodayScreen} from '../screens/main/TodayScreen';
import {CaptureScreen} from '../screens/main/CaptureScreen';
import {SettingsScreen} from '../screens/main/SettingsScreen';
import {colors, typography} from '../theme';
import {useTranslation} from '../i18n/useTranslation';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({icon, label, focused}) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

const TodayTabIcon = ({focused}: {focused: boolean}) => {
  const {t} = useTranslation();
  return <TabIcon icon="📋" label={t('tab_today')} focused={focused} />;
};

const CaptureTabIcon = ({focused}: {focused: boolean}) => {
  const {t} = useTranslation();
  return <TabIcon icon="📸" label={t('tab_capture')} focused={focused} />;
};

const SettingsTabIcon = ({focused}: {focused: boolean}) => {
  const {t} = useTranslation();
  return <TabIcon icon="⚙️" label={t('tab_settings')} focused={focused} />;
};

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarIcon: TodayTabIcon,
        }}
      />
      <Tab.Screen
        name="Capture"
        component={CaptureScreen}
        options={{
          tabBarIcon: CaptureTabIcon,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    height: 85,
    paddingTop: 8,
    paddingBottom: 28,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  tabLabelFocused: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
