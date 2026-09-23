import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const BURST_DURATION_MS = 850;
const BURST_DELAY_STEP_MS = 24;
const BURST_CLEANUP_DELAY_MS = 4_000;

const PARTICLE_SIZE = 30;
const PARTICLE_ORIGIN_BOTTOM_OFFSET = 108;
const OVERLAY_Z_INDEX = 10;
const BURST_PROGRESS_COMPLETE = 1;
const PARTICLE_START_OPACITY = 1;
const PARTICLE_START_SCALE = 0.55;
const PARTICLE_SCALE_GROWTH = 0.65;

// Each vector is the particle's final offset.
const PARTICLES = [
  { emoji: "🎉", x: -110, y: -115, rotation: -35 },
  { emoji: "✨", x: -78, y: -155, rotation: 25 },
  { emoji: "🎊", x: -42, y: -125, rotation: 40 },
  { emoji: "💫", x: 0, y: -175, rotation: -20 },
  { emoji: "🎉", x: 42, y: -130, rotation: 30 },
  { emoji: "✨", x: 78, y: -160, rotation: -25 },
  { emoji: "🎊", x: 110, y: -112, rotation: 35 },
  { emoji: "⭐️", x: 0, y: -105, rotation: 15 },
];

/**
 * Animates one emoji from the burst origin outward, rotating and shrinking its
 * opacity as it travels. The shared progress value keeps all animated styles
 * on Reanimated's UI thread; the index adds a small cascade between particles.
 */
function CelebrationParticle({
  emoji,
  x,
  y,
  rotation,
  index,
}: (typeof PARTICLES)[number] & { index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * BURST_DELAY_STEP_MS,
      withTiming(BURST_PROGRESS_COMPLETE, {
        duration: BURST_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );

    return () => cancelAnimation(progress);
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: PARTICLE_START_OPACITY - progress.value,
    transform: [
      { translateX: x * progress.value },
      { translateY: y * progress.value },
      { rotate: `${rotation * progress.value}deg` },
      {
        scale: PARTICLE_START_SCALE + progress.value * PARTICLE_SCALE_GROWTH,
      },
    ],
  }));

  return (
    <Animated.Text style={[styles.particle, animatedStyle]}>
      {emoji}
    </Animated.Text>
  );
}

/**
 * Full-screen, non-interactive overlay shown after a document is saved.
 * `onComplete` removes the overlay after the animation has fully faded away.
 */
export function CelebrationAnimation({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { width } = useWindowDimensions();

  useEffect(() => {
    const timeout = setTimeout(onComplete, BURST_CLEANUP_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={[styles.origin, { left: width / 2 - PARTICLE_SIZE / 2 }]}>
        {PARTICLES.map((particle, index) => (
          <CelebrationParticle key={index} {...particle} index={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: OVERLAY_Z_INDEX,
  },
  origin: {
    position: "absolute",
    bottom: PARTICLE_ORIGIN_BOTTOM_OFFSET,
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
  },
  particle: {
    position: "absolute",
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
    fontSize: PARTICLE_SIZE,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
