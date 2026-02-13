import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, typography, borderRadius, spacing} from '../theme';

export interface AppInfo {
  id: string;
  name: string;
  icon: string; // emoji as placeholder, replace with actual icons later
  color: string;
}

export const AVAILABLE_APPS: AppInfo[] = [
  {id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F'},
  {id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000'},
  {id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2'},
  {id: 'facebook', name: 'Facebook', icon: '👤', color: '#1877F2'},
  {id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000'},
  {id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00'},
  {id: 'reddit', name: 'Reddit', icon: '🤖', color: '#FF4500'},
  {id: 'netflix', name: 'Netflix', icon: '🎬', color: '#E50914'},
];

interface AppCardProps {
  app: AppInfo;
  locked?: boolean;
  selected?: boolean;
  onToggle?: (appId: string) => void;
  compact?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  locked = false,
  selected = false,
  onToggle,
  compact = false,
}) => {
  const handlePress = () => {
    onToggle?.(app.id);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactIconContainer, {backgroundColor: app.color + '15'}]}>
          <Text style={styles.compactIcon}>{app.icon}</Text>
          {locked && (
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
        <Text style={styles.compactName} numberOfLines={1}>
          {app.name}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, {backgroundColor: app.color + '15'}]}>
          <Text style={styles.icon}>{app.icon}</Text>
        </View>
        <Text style={styles.name}>{app.name}</Text>
      </View>
      {selected && (
        <View style={styles.checkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Full-size card (for settings/selection)
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  containerSelected: {
    backgroundColor: colors.surfaceAlt,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },

  // Compact card (for Today screen)
  compactContainer: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 72,
  },
  compactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactIcon: {
    fontSize: 26,
  },
  compactName: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lockIcon: {
    fontSize: 10,
  },
});
