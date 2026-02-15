export type GoalTypeId =
  | 'read_book'
  | 'studying'
  | 'watch_film'
  | 'hangout_friends'
  | 'work_out'
  | 'yoga'
  | 'custom';

/** unitKey is used for i18n: t('unit_' + unitKey) */
export interface GoalType {
  id: GoalTypeId;
  icon: string;
  unitKey: 'pages' | 'min';
  defaultTarget: number;
}

export const GOAL_TYPES: GoalType[] = [
  {id: 'read_book', icon: '📖', unitKey: 'min', defaultTarget: 30},
  {id: 'studying', icon: '📚', unitKey: 'min', defaultTarget: 30},
  {id: 'watch_film', icon: '🎬', unitKey: 'min', defaultTarget: 90},
  {id: 'hangout_friends', icon: '👥', unitKey: 'min', defaultTarget: 60},
  {id: 'work_out', icon: '💪', unitKey: 'min', defaultTarget: 45},
  {id: 'yoga', icon: '🧘', unitKey: 'min', defaultTarget: 30},
];

export const getGoalType = (id: GoalTypeId | string): GoalType | undefined =>
  GOAL_TYPES.find(t => t.id === id);
