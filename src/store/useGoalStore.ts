import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';
import {GoalType} from '../components/GoalCard';

interface DailyProgress {
  date: string; // ISO date string YYYY-MM-DD
  current: number;
  completed: boolean;
}

interface GoalState {
  // Goal configuration
  goalType: GoalType;
  dailyTarget: number;

  // Progress
  todayProgress: number;
  streak: number;
  lastCompletedDate: string | null;
  history: DailyProgress[];

  // Computed
  isGoalMet: boolean;

  // Actions
  setGoalType: (type: GoalType) => void;
  setDailyTarget: (target: number) => void;
  incrementProgress: (amount?: number) => void;
  resetDailyProgress: () => void;
  checkAndUpdateStreak: () => void;
}

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      // Default state
      goalType: 'reading',
      dailyTarget: 20,
      todayProgress: 0,
      streak: 0,
      lastCompletedDate: null,
      history: [],
      isGoalMet: false,

      setGoalType: (type: GoalType) => set({goalType: type}),

      setDailyTarget: (target: number) => set({dailyTarget: target}),

      incrementProgress: (amount = 1) => {
        const state = get();
        const newProgress = state.todayProgress + amount;
        const isGoalMet = newProgress >= state.dailyTarget;
        const today = getTodayString();

        set({
          todayProgress: newProgress,
          isGoalMet,
        });

        // If goal just completed, update streak
        if (isGoalMet && !state.isGoalMet) {
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
            streak: newStreak,
            lastCompletedDate: today,
            history: [
              ...state.history,
              {date: today, current: newProgress, completed: true},
            ],
          });
        }
      },

      resetDailyProgress: () => {
        set({
          todayProgress: 0,
          isGoalMet: false,
        });
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // If last completed date is not today or yesterday, reset streak
        if (
          state.lastCompletedDate !== today &&
          state.lastCompletedDate !== yesterdayStr
        ) {
          set({streak: 0});
        }

        // If it's a new day, reset progress
        const lastEntry = state.history[state.history.length - 1];
        if (!lastEntry || lastEntry.date !== today) {
          set({
            todayProgress: 0,
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
