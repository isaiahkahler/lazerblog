import { useEffect, useId, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { ACCENT_COLOR, ACTION_COLOR, ACTION_COLOR_DARK, BACKGROUND_COLOR, BORDER_RADIUS, REM, TEXT_COLOR } from "../data/constants";

interface InputProps {
  label?: string
}

export default function Input({ label, ...props }: InputProps & TextInputProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0
  const translateXAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const translateYAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const backgroundOpacityAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const moveLabel = focused || !!(props.value);

  useEffect(() => {
    const scaleUpTiming = Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    });
    const scaleDownTiming = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    });
    const translateXUpTiming = Animated.timing(translateXAnim, {
      toValue: -(REM/16)*20,
      duration: 100,
      useNativeDriver: true,
    });
    const translateXDownTiming = Animated.timing(translateXAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    });
    const translateYUpTiming = Animated.timing(translateYAnim, {
      toValue: -(REM/16)*15,
      duration: 100,
      useNativeDriver: true,
    });
    const translateYDownTiming = Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    });
    if (moveLabel) {
      scaleDownTiming.stop();
      translateXDownTiming.stop();
      translateYDownTiming.stop();
      scaleUpTiming.start();
      translateXUpTiming.start();
      translateYUpTiming.start();
    } else {
      scaleUpTiming.stop();
      translateXUpTiming.stop();
      translateYUpTiming.stop();
      scaleDownTiming.start();
      translateXDownTiming.start();
      translateYDownTiming.start();

    }
  }, [moveLabel])


  // const inputRef = useRef<TextInput>(null);
  return (
    <View style={styles.root}>

      {/* we want to hide the label when unfocused &  */}
      {label && <Animated.View
        style={[styles.labelContainer, {
          transform: [
            { scale: scaleAnim }, { translateY: translateYAnim }, { translateX: translateXAnim }]
        }]} >
        <Animated.View style={[styles.labelBackground, { opacity: backgroundOpacityAnim }]} />
        <Text nativeID={id} style={[styles.label, { color: moveLabel ? (focused ? ACCENT_COLOR : TEXT_COLOR) : ACTION_COLOR_DARK }]}>{label}</Text>
      </Animated.View>}

      <TextInput
        {...props}
        style={[styles.input, focused ? { borderColor: ACCENT_COLOR, borderWidth: (REM / 16), } : { borderColor: TEXT_COLOR, borderWidth: (REM / 16) }, props.style]}
        aria-labelledby={id}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    position: 'relative',
    marginTop: (REM / 16) * 5,
    marginBottom: (REM / 16) * 20,
  },
  labelContainer: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    userSelect: 'none'
  },
  label: {
    zIndex: 2,
    marginLeft: 0.75 * REM,
    pointerEvents: 'none',
    userSelect: 'none'
  },
  labelBackground: {
    backgroundColor: BACKGROUND_COLOR
  },
  input: {
    backgroundColor: ACTION_COLOR,
    borderRadius: (2 * BORDER_RADIUS) / 3,
    paddingHorizontal: (REM / 16) * 10,
    paddingTop: REM,
    paddingBottom: (REM / 16) * 4,
    fontSize: (REM / 16) * 18,
  },
})