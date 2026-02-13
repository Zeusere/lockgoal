import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {colors, typography, spacing} from '../../theme';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export const Welcome: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.kicker}>LOCKGOAL</Text>
        <Text style={styles.title}>Menos dopamina rápida,{`\n`}más resultados reales</Text>
        <Text style={styles.subtitle}>Te llevamos de caos a foco en días: onboarding guiado, bloqueo real y ejecución diaria.</Text>
      </View>
      <View style={styles.footer}>
        <Button title="Empezar onboarding" onPress={() => navigation.navigate('SetGoal')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, justifyContent: 'center', padding: spacing.xl},
  kicker: {...typography.caption, color: colors.primary, letterSpacing: 1.2},
  title: {...typography.h1, color: colors.textPrimary, marginTop: spacing.md},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.md},
  footer: {paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
});
