import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {colors, typography, spacing, borderRadius} from '../../theme';
import {useTranslation} from '../../i18n/useTranslation';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const NUM_STEPS = 9;
const SLIDE_IMAGE_HEIGHT = SCREEN_HEIGHT * 0.38;

/** Imagen por paso. Usa GIF para movimiento real; si es PNG/JPG se añade un suave “breathing” con Reanimated. */
const SLIDE_IMAGES: ImageSourcePropType[] = [
  require('../../assets/step1.png'),
  require('../../assets/step2.png'),
  require('../../assets/step3.png'),
  require('../../assets/step4.png'),
  require('../../assets/step5.png'),
  require('../../assets/clock_onboarding.png'),
  require('../../assets/clock_onboarding.png'),
  require('../../assets/clock_onboarding.png'),
  require('../../assets/clock_onboarding.png'),
];
// Para movimiento por paso: añade en src/assets/ onboarding_step2.gif ... onboarding_step9.gif
// y sustituye arriba, ej: require('../../assets/onboarding_step2.gif'),

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStory'>;

interface SlideProps {
  index: number;
  onNext: () => void;
  isLast: boolean;
}

/** Imagen con animación sutil de “respiración” (scale 1 → 1.03 → 1). Los GIF se animan solos. */
function SlideImage({source}: {source: ImageSourcePropType}) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
        withTiming(1, {duration: 2000, easing: Easing.inOut(Easing.ease)})
      ),
      -1,
      true
    );
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({transform: [{scale: scale.value}]}));
  return (
    <Animated.View style={[styles.heroImageWrap, animatedStyle]}>
      <Image source={source} style={styles.heroImage} resizeMode="cover" />
    </Animated.View>
  );
}

function Slide1Content({onNext, isLast}: SlideProps) {
  const {t} = useTranslation();
  return (
    <>
      <SlideImage source={SLIDE_IMAGES[0]} />
      <View style={styles.slideContent}>
        <Text style={styles.slideTitle}>{t('story_step1_title')}</Text>
        <Text style={styles.slideDesc}>{t('story_step1_desc')}</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title={isLast ? t('story_cta') : t('story_next')}
          onPress={onNext}
        />
      </View>
    </>
  );
}

function Step8Metrics() {
  const {t} = useTranslation();
  const metrics = [
    {key: '1', icon: '📱', labelKey: 'story_step8_metric1', before: 100, after: 60, color: colors.primary},
    {key: '2', icon: '🔔', labelKey: 'story_step8_metric2', before: 100, after: 35, color: colors.primary},
    {key: '3', icon: '📈', labelKey: 'story_step8_metric3', before: 40, after: 100, color: colors.success},
  ];
  return (
    <View style={styles.metricsContainer}>
      {metrics.map(m => (
        <View key={m.key} style={styles.metricCard}>
          <Text style={styles.metricIcon}>{m.icon}</Text>
          <Text style={styles.metricLabel}>{t(m.labelKey)}</Text>
          <View style={styles.metricBars}>
            <View style={styles.metricBarRow}>
              <Text style={styles.metricBarLabel}>{t('story_step8_before')}</Text>
              <View style={styles.metricBarBg}>
                <View style={[styles.metricBarFill, {width: `${m.before}%`, backgroundColor: colors.border}]} />
              </View>
            </View>
            <View style={styles.metricBarRow}>
              <Text style={styles.metricBarLabel}>{t('story_step8_after')}</Text>
              <View style={styles.metricBarBg}>
                <View style={[styles.metricBarFill, {width: `${m.after}%`, backgroundColor: m.color}]} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function GenericSlide({index, onNext, isLast}: SlideProps) {
  const {t} = useTranslation();
  const titleKey = `story_step${index + 1}_title` as keyof typeof t;
  const descKey = `story_step${index + 1}_desc` as keyof typeof t;
  const showMetrics = index === 7; // step 8 (0-based)
  const imageSource = SLIDE_IMAGES[index];

  return (
    <>
      {imageSource ? <SlideImage source={imageSource} /> : null}
      <View style={styles.slideContent}>
        <Text style={styles.slideTitle}>{t(titleKey)}</Text>
        <Text style={styles.slideDesc}>{t(descKey)}</Text>
        {showMetrics && <Step8Metrics />}
      </View>
      <View style={styles.footer}>
        <Button
          title={isLast ? t('story_cta') : t('story_next')}
          onPress={onNext}
        />
      </View>
    </>
  );
}

function SlideItem({
  item,
  onNext,
}: {
  item: {key: string; index: number};
  onNext: () => void;
}) {
  const index = item.index;
  const isLast = index === NUM_STEPS - 1;
  if (index === 0) {
    return <Slide1Content index={0} onNext={onNext} isLast={isLast} />;
  }
  return (
    <GenericSlide index={index} onNext={onNext} isLast={isLast} />
  );
}

export const OnboardingStory: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = Array.from({length: NUM_STEPS}, (_, i) => ({key: `slide-${i}`, index: i}));

  const handleNext = () => {
    if (currentIndex >= NUM_STEPS - 1) {
      navigation.navigate('SetGoal');
      return;
    }
    const next = currentIndex + 1;
    setCurrentIndex(next);
    flatListRef.current?.scrollToIndex({index: next, animated: true});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <SlideItem item={item} onNext={handleNext} />
          </View>
        )}
        onMomentumScrollEnd={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(i);
        }}
        onScrollEndDrag={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(i);
        }}
      />
      <View style={styles.pagination}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  slide: {width: SCREEN_WIDTH, flex: 1, paddingHorizontal: spacing.xl},
  heroImageWrap: {
    height: SLIDE_IMAGE_HEIGHT,
    marginBottom: 0,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
  },
  heroImage: {width: '100%', height: '100%'},
  slideContent: {flex: 1, justifyContent: 'flex-start', paddingTop: 0, paddingBottom: spacing.md},
  slideTitle: {
    ...typography.h2,
    fontSize: 34,
    lineHeight: 40,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  slideDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {paddingVertical: spacing.lg, paddingBottom: spacing.xxl},
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {backgroundColor: colors.primary, width: 20},
  // Step 8 metrics
  metricsContainer: {marginTop: spacing.xxl, gap: spacing.lg},
  metricCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  metricIcon: {fontSize: 24, marginBottom: spacing.xs},
  metricLabel: {...typography.label, color: colors.textPrimary, marginBottom: spacing.sm},
  metricBars: {gap: spacing.sm},
  metricBarRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  metricBarLabel: {...typography.caption, color: colors.textTertiary, width: 95},
  metricBarBg: {flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.surfaceAlt, overflow: 'hidden'},
  metricBarFill: {height: '100%', borderRadius: 5},
});
