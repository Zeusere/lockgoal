import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';

export interface DailyGoal {
  id: string;
  title: string;
  target: number;
  progress: number;
}

interface GoalState {
  dailyGoals: DailyGoal[];
  streak: number;
  lastCompletedDate: string | null;
  history: {date: string; completed: boolean}[];
  isGoalMet: boolean;

  addGoal: (title: string, target: number) => void;
  updateGoal: (id: string, updates: Partial<Pick<DailyGoal, 'title' | 'target'>>) => void;
  removeGoal: (id: string) => void;
  incrementGoalProgress: (id: string, amount?: number) => void;
  resetDailyProgress: () => void;
  setGoals: (goals: Array<{title: string; target: number}>) => void;
  checkAndUpdateStreak: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const computeGoalMet = (goals: DailyGoal[]) =>
  goals.length > 0 && goals.every(goal => goal.progress >= goal.target);

const id = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      dailyGoals: [{id: id(), title: 'Leer 20 páginas', target: 20, progress: 0}],
      streak: 0,
      lastCompletedDate: null,
      history: [],
      isGoalMet: false,

      addGoal: (title, target) => {
        const safeTarget = Math.max(1, target);
        set(state => {
          const dailyGoals = [...state.dailyGoals, {id: id(), title, target: safeTarget, progress: 0}];
          return {dailyGoals, isGoalMet: computeGoalMet(dailyGoals)};
        });
      },

      updateGoal: (goalId, updates) => {
        set(state => {
          const dailyGoals = state.dailyGoals.map(goal =>
            goal.id === goalId
              ? {
                  ...goal,
                  ...updates,
                  target: updates.target ? Math.max(1, updates.target) : goal.target,
                  progress:
                    updates.target && goal.progress > updates.target
                      ? updates.target
                      : goal.progress,
                }
              : goal,
          );
          return {dailyGoals, isGoalMet: computeGoalMet(dailyGoals)};
        });
      },

      removeGoal: goalId => {
        set(state => {
          const dailyGoals = state.dailyGoals.filter(goal => goal.id !== goalId);
          return {dailyGoals, isGoalMet: computeGoalMet(dailyGoals)};
        });
      },

      incrementGoalProgress: (goalId, amount = 1) => {
        const state = get();
        const dailyGoals = state.dailyGoals.map(goal =>
          goal.id === goalId
            ? {...goal, progress: Math.min(goal.progress + amount, goal.target)}
            : goal,
        );

        const isGoalMet = computeGoalMet(dailyGoals);
        const today = getTodayString();
        const becameCompleted = isGoalMet && !state.isGoalMet;

        if (!becameCompleted) {
          set({dailyGoals, isGoalMet});
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak =
          state.lastCompletedDate === yesterdayStr
            ? state.streak + 1
            : state.lastCompletedDate === today
              ? state.streak
              : 1;

        set({
          dailyGoals,
          isGoalMet,
          streak: newStreak,
          lastCompletedDate: today,
          history: [...state.history, {date: today, completed: true}],
        });
      },

      resetDailyProgress: () => {
        set(state => ({
          dailyGoals: state.dailyGoals.map(goal => ({...goal, progress: 0})),
          isGoalMet: false,
        }));
      },

      setGoals: goals => {
        const dailyGoals = goals.map(goal => ({
          id: id(),
          title: goal.title,
          target: Math.max(1, goal.target),
          progress: 0,
        }));
        set({dailyGoals, isGoalMet: false});
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (
          state.lastCompletedDate !== today &&
          state.lastCompletedDate !== yesterdayStr
        ) {
          set({streak: 0});
        }

        const lastEntry = state.history[state.history.length - 1];
        if (!lastEntry || lastEntry.date !== today) {
          set({
            dailyGoals: state.dailyGoals.map(goal => ({...goal, progress: 0})),
            isGoalMet: false,
          });
        }
      },
    }),
    {
      name: 'lockgoal-goals',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
