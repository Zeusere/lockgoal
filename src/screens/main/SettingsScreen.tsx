import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppCard, AVAILABLE_APPS, Button} from '../../components';
import {useAppStore, useGoalStore, useAuthStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';
import {saveSessionSnapshot, signUpWithEmail} from '../../services/supabaseService';

export const SettingsScreen: React.FC = () => {
  const {blockedAppIds, toggleApp} = useAppStore();
  const {dailyGoals, addGoal, updateGoal} = useGoalStore();
  const {isRegistered, setRegistered, userId} = useAuthStore();

  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddGoal = () => {
    const parsed = parseInt(goalTarget, 10);
    if (!goalTitle || parsed <= 0) {
      return;
    }
    addGoal(goalTitle, parsed);
    setGoalTitle('');
    setGoalTarget('1');
  };

  const handleRegister = async () => {
    try {
      const result = await signUpWithEmail(email, password);
      if (result.userId) {
        setRegistered(result.userId, email);
        await saveSessionSnapshot(result.userId, {
          blockedAppIds,
          dailyGoals,
          createdAt: new Date().toISOString(),
        });
        Alert.alert('Cuenta creada', 'Tu progreso ya está vinculado para gamificación.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo registrar. Revisa la configuración de Supabase.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Objetivos de hoy</Text>
        {dailyGoals.map(goal => (
          <View key={goal.id} style={styles.goalRow}>
            <TextInput value={goal.title} onChangeText={text => updateGoal(goal.id, {title: text})} style={styles.goalInputTitle} />
            <TextInput value={String(goal.target)} onChangeText={text => updateGoal(goal.id, {target: parseInt(text, 10) || 1})} style={styles.goalInputTarget} keyboardType="number-pad" />
          </View>
        ))}

        <View style={styles.addRow}>
          <TextInput placeholder="Nuevo objetivo" placeholderTextColor={colors.textTertiary} value={goalTitle} onChangeText={setGoalTitle} style={styles.newGoalTitle} />
          <TextInput value={goalTarget} onChangeText={setGoalTarget} style={styles.newGoalTarget} keyboardType="number-pad" />
          <TouchableOpacity onPress={handleAddGoal} style={styles.addPill}><Text style={styles.addPillText}>Añadir</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Apps bloqueadas</Text>
        <View style={styles.listCard}>
          {AVAILABLE_APPS.map(app => <AppCard key={app.id} app={app} selected={blockedAppIds.includes(app.id)} onToggle={toggleApp} />)}
        </View>

        <Text style={styles.sectionTitle}>Registro (después del onboarding+paywall)</Text>
        {isRegistered ? (
          <Text style={styles.registered}>Cuenta vinculada: {userId}</Text>
        ) : (
          <View style={styles.authCard}>
            <TextInput placeholder="Email" placeholderTextColor={colors.textTertiary} value={email} onChangeText={setEmail} style={styles.authInput} autoCapitalize="none" />
            <TextInput placeholder="Password" placeholderTextColor={colors.textTertiary} value={password} onChangeText={setPassword} style={styles.authInput} secureTextEntry />
            <Button title="Crear cuenta en Supabase" onPress={handleRegister} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.xl, paddingBottom: spacing.xxxl},
  title: {...typography.h2, color: colors.textPrimary},
  sectionTitle: {...typography.h4, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.sm},
  goalRow: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm},
  goalInputTitle: {flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, color: colors.textPrimary},
  goalInputTarget: {width: 70, backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, color: colors.textPrimary},
  addRow: {flexDirection: 'row', gap: spacing.sm, alignItems: 'center'},
  newGoalTitle: {flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, color: colors.textPrimary},
  newGoalTarget: {width: 60, backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, color: colors.textPrimary},
  addPill: {backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  addPillText: {...typography.labelSmall, color: colors.textInverse},
  listCard: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden'},
  authCard: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.sm},
  authInput: {backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.textPrimary},
  registered: {...typography.body, color: colors.primary},
});
