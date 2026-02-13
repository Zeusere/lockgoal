import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGoalStore, useAuthStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';
import {saveSessionSnapshot} from '../../services/supabaseService';

export const CaptureScreen: React.FC = () => {
  const {dailyGoals, incrementGoalProgress, isGoalMet} = useGoalStore();
  const userId = useAuthStore(state => state.userId);

  const addProgress = async (goalId: string) => {
    incrementGoalProgress(goalId, 1);
    if (userId) {
      await saveSessionSnapshot(userId, {
        type: 'goal_progress',
        goalId,
        at: new Date().toISOString(),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Registrar progreso</Text>
        <Text style={styles.subtitle}>Suma avance en cada objetivo diario. Hasta completar todos, no se desbloquean apps.</Text>

        {dailyGoals.map(goal => (
          <View key={goal.id} style={styles.card}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalMeta}>{goal.progress}/{goal.target}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => addProgress(goal.id)}>
              <Text style={styles.addButtonText}>+1 completado</Text>
            </TouchableOpacity>
          </View>
        ))}

        {isGoalMet && <Text style={styles.done}>🎉 Todos los objetivos del día están completados.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.xl, paddingBottom: spacing.xxxl},
  title: {...typography.h2, color: colors.textPrimary},
  subtitle: {...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg},
  card: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md},
  goalTitle: {...typography.label, color: colors.textPrimary},
  goalMeta: {...typography.bodySmall, color: colors.textSecondary, marginTop: 4},
  addButton: {marginTop: spacing.md, alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  addButtonText: {...typography.labelSmall, color: colors.textInverse},
  done: {...typography.label, color: colors.primary, marginTop: spacing.lg},
});
