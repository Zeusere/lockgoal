import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {colors, typography, spacing, borderRadius} from '../../theme';
import {useGoalStore, useOnboardingStore} from '../../store';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SetGoal'>;

export const SetGoal: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [impact, setImpact] = useState('Quiero pasar de 0 a 1 en productividad esta semana');
  const setGoals = useGoalStore(state => state.setGoals);
  const nextStep = useOnboardingStore(state => state.nextStep);

  const handleContinue = () => {
    setGoals([
      {title: 'Bloque 1 de trabajo profundo', target: 1},
      {title: 'Bloque 2 de trabajo profundo', target: 1},
    ]);
    nextStep();
    navigation.navigate('SelectApps');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vamos a diseñar{`\n`}tu cambio</Text>
        <Text style={styles.subtitle}>Cuéntanos qué cambio quieres notar en pocos días.</Text>
        <View style={styles.box}>
          <TextInput
            value={impact}
            onChangeText={setImpact}
            multiline
            style={styles.input}
            placeholder="Ej: Terminar mis tareas antes de las 18:00"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Continuar" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, padding: spacing.xl, justifyContent: 'center'},
  title: {...typography.h1, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm},
  box: {marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md},
  input: {...typography.body, color: colors.textPrimary, minHeight: 120, textAlignVertical: 'top'},
  footer: {paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
});
