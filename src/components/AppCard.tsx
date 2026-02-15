import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors, typography, borderRadius, spacing} from '../theme';

export interface AppInfo {
  id: string;
  name: string;
  /** Dominio para obtener favicon (Google Favicon API) */
  domain: string;
  color: string;
}

const FAVICON_API = 'https://www.google.com/s2/favicons';
export const faviconUrl = (domain: string, size: number = 128) =>
  `${FAVICON_API}?domain=${domain}&sz=${size}`;

export const AVAILABLE_APPS: AppInfo[] = [
  {id: 'instagram', name: 'Instagram', domain: 'instagram.com', color: '#E4405F'},
  {id: 'tiktok', name: 'TikTok', domain: 'tiktok.com', color: '#000000'},
  {id: 'twitter', name: 'Twitter', domain: 'x.com', color: '#1DA1F2'},
  {id: 'facebook', name: 'Facebook', domain: 'facebook.com', color: '#1877F2'},
  {id: 'youtube', name: 'YouTube', domain: 'youtube.com', color: '#FF0000'},
  {id: 'snapchat', name: 'Snapchat', domain: 'snapchat.com', color: '#FFFC00'},
  {id: 'reddit', name: 'Reddit', domain: 'reddit.com', color: '#FF4500'},
  {id: 'netflix', name: 'Netflix', domain: 'netflix.com', color: '#E50914'},
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
  const [iconError, setIconError] = useState(false);
  const handlePress = () => onToggle?.(app.id);

  const iconUri = faviconUrl(app.domain);
  const icon = iconError ? (
    <View style={[styles.iconFallback, compact && styles.iconFallbackCompact]}>
      <Text style={[styles.iconFallbackText, compact && styles.iconFallbackTextCompact]}>{app.name[0]}</Text>
    </View>
  ) : (
    <Image
      source={{uri: iconUri}}
      style={compact ? styles.compactIcon : styles.icon}
      onError={() => setIconError(true)}
    />
  );

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactIconContainer, {backgroundColor: app.color + '15'}]}>
          {icon}
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
        <View style={[styles.iconContainer, {backgroundColor: app.color + '15'}]}>{icon}</View>
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
  container: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight},
  containerSelected: {backgroundColor: colors.surfaceAlt},
  leftContent: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  iconContainer: {width: 40, height: 40, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center'},
  icon: {width: 22, height: 22},
  name: {...typography.body, color: colors.textPrimary},
  checkContainer: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  checkmark: {color: colors.textInverse, fontSize: 14, fontWeight: '600'},
  compactContainer: {alignItems: 'center', gap: spacing.xs, width: 72},
  compactIconContainer: {width: 56, height: 56, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', position: 'relative'},
  compactIcon: {width: 28, height: 28},
  compactName: {...typography.caption, color: colors.textSecondary, textAlign: 'center'},
  lockBadge: {position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  lockIcon: {fontSize: 10},
  iconFallback: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  iconFallbackCompact: {width: 28, height: 28, borderRadius: 14},
  iconFallbackText: {...typography.caption, color: colors.textSecondary, fontWeight: '600'},
  iconFallbackTextCompact: {fontSize: 12},
});
