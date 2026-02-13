import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {colors, typography} from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  total,
  size = 180,
  strokeWidth = 10,
  label,
}) => {
  const progress = useSharedValue(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min(current / total, 1) : 0;

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [percentage, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.progressTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.progressFill}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={styles.currentValue}>{current}</Text>
        {label ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          <Text style={styles.totalLabel}>of {total} pages</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
  },
  currentValue: {
    ...typography.bigNumber,
    color: colors.textPrimary,
  },
  totalLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: -4,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: -4,
  },
});
