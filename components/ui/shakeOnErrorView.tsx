import { useEffect, useRef, useState } from "react";
import { Animated, ViewProps } from "react-native";

interface ShakeOnErrorViewProps {
  error?: boolean,
  changingError?: any
}

export default function ShakeOnErrorView({ children, error, changingError, ...rest }: ShakeOnErrorViewProps & ViewProps) {
  const [width, setWidth] = useState(0);
  const shakeAmount = width * 0.025;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shakeTiming = Animated.sequence([
    Animated.timing(shakeAnim, {
      toValue: shakeAmount,
      duration: 50,
      useNativeDriver: true
    }),
    Animated.timing(shakeAnim, {
      toValue: -shakeAmount,
      duration: 100,
      useNativeDriver: true
    }),
    Animated.timing(shakeAnim, {
      toValue: shakeAmount,
      duration: 100,
      useNativeDriver: true
    }),
    Animated.timing(shakeAnim, {
      toValue: -shakeAmount,
      duration: 100,
      useNativeDriver: true
    }),
    Animated.timing(shakeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }),
  ]);

  useEffect(() => {
    if (error) {
      shakeTiming.start();
    } else {
      shakeTiming.reset();
    }
  }, [error]);

  useEffect(() => {
    if (changingError) {
      shakeTiming.start();
    } else {
      shakeTiming.reset();
    }
  }, [changingError]);

  return (
    <Animated.View
      style={{ transform: [{ translateX: shakeAnim }] }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {children}
    </Animated.View>
  )
}