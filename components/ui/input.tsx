import { useEffect, useId, useRef, useState } from "react";
import { ViewStyle } from "react-native";
import { StyleProp, ViewProps } from "react-native";
import { Animated, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { ACCENT_COLOR, ACTION_COLOR, ACTION_COLOR_DARK, ACTION_COLOR_MEDIUM, BACKGROUND_COLOR, BORDER_RADIUS, ERROR_COLOR, REM, TEXT_COLOR } from "../data/constants";
import P from "./text";

interface InputProps {
  label?: string,
  rootStyle?: StyleProp<ViewStyle>,
  disabled?: boolean,
  error?: boolean
}

const LABEL_SCALE = 0.75;

export default function Input({ rootStyle, label, disabled, error, ...props }: InputProps & TextInputProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);

  const moveLabel = focused || !!(props.value);
  const borderColor = error ? ERROR_COLOR : (disabled ? ACTION_COLOR_DARK : (focused ? ACCENT_COLOR : TEXT_COLOR));
  const labelColor = error ? ERROR_COLOR : (disabled ? ACTION_COLOR_DARK : (moveLabel ? borderColor : TEXT_COLOR));
  const padding = label ? {
    paddingTop: REM,
    paddingBottom: (REM / 16) * 4
  } : {
    paddingTop: (REM / 16) * 10,
    paddingBottom: (REM / 16) * 10
  };

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0
  const translateXAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const translateYAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    const scaleUpTiming = Animated.timing(scaleAnim, {
      toValue: LABEL_SCALE,
      duration: 100,
      useNativeDriver: true,
    });
    const scaleDownTiming = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    });
    const translateXUpTiming = Animated.timing(translateXAnim, {
      // toValue: -(REM / 16) * 50,
      toValue: -(((labelWidth - (labelWidth * LABEL_SCALE))) * 2) / 3,
      // toValue: 0,
      duration: 100,
      useNativeDriver: true,
    });
    const translateXDownTiming = Animated.timing(translateXAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    });
    const translateYUpTiming = Animated.timing(translateYAnim, {
      toValue: -REM,
      // toValue: 0,
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
    <View style={[styles.root, rootStyle]}>

      {/* 👉 show a label that shrinks and moves up on focus */}
      {label && <View
        style={[styles.labelContainer]} >
        <Animated.Text
          nativeID={id}
          style={[
            styles.label,
            { color: labelColor },
            { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }, { translateX: translateXAnim }] }
          ]}
          onLayout={(e) => setLabelWidth(e.nativeEvent.layout.width)}
        >
          {label}
        </Animated.Text>
      </View>}

      <TextInput
        {...props}
        style={[
          styles.input,
          { borderColor: borderColor },
          disabled && styles.disabledInput,
          padding,
          props.style
        ]}
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
    marginVertical: (REM / 16) * 5,
    // backgroundColor: "rgba(255,0,0,0.2)"
  },
  labelContainer: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 2,

    backgroundColor: 'transparent',
    pointerEvents: 'none',
    userSelect: 'none'
  },
  label: {
    zIndex: 2,
    marginLeft: 0.75 * REM,
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: (REM / 16) * 18,
    width: 'auto',
  },
  input: {
    backgroundColor: ACTION_COLOR,
    borderRadius: (2 * BORDER_RADIUS) / 3,
    borderWidth: REM / 16,
    paddingHorizontal: (REM / 16) * 10,
    fontSize: (REM / 16) * 18,
  },
  disabledInput: {
    userSelect: 'none',
    pointerEvents: 'none',
    cursor: 'not-allowed',
    backgroundColor: ACTION_COLOR_MEDIUM,
    // color: ACTION_COLOR_DARK
  }
})