import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ACCENT_COLOR, OVERLAY_COLOR, REM } from "../data/constants";

export function LoadingOverlay() {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const opacityTiming = Animated.timing(opacityAnim, {
    toValue: 1,
    useNativeDriver: true,
    duration: 250,
  });

  const rotationRange = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotationTiming = Animated.timing(rotationAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  });

  const rotationLoop = Animated.loop(rotationTiming);

  useEffect(() => {
    opacityTiming.start();
    rotationLoop.start();
  }, []);

  return (
    <Animated.View style={[styles.overlay, {opacity: opacityAnim}]} >
      <Animated.View style={[styles.icon, {transform: [{rotate: rotationRange}]}]}>
        <MaterialCommunityIcons name="loading" size={3 * REM} color={ACCENT_COLOR} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: OVERLAY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  icon: {
    backgroundColor: 'transparent'
  }
});