import { createContext, PropsWithChildren, useState } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT, ACCENT_TEXT_COLOR, ACTION_COLOR, ACTION_COLOR_LIGHT, BACKGROUND_COLOR, REM, TEXT_COLOR } from "../data/constants";
import { TextContext } from "../data/contexts";
import P from "./text";


type ButtonProps = { hasColor?: boolean };





export default function Button(props: ButtonProps & PropsWithChildren<PressableProps>) {
  const { hasColor, children, ...rest } = props;
  const [pressState, setPressState] = useState(false);
  // const accentStyles = {backgroundColor: pressState ? ACCENT_COLOR_LIGHT : ACCENT_COLOR };
  // const regularStyles = {backgroundColor: pressState ? ACTION_COLOR_LIGHT : ACTION_COLOR }
  // const colorProps: StyleProp<ViewStyle> = hasColor ? accentStyles : regularStyles;

  const textColorProps = hasColor ? { color: ACCENT_TEXT_COLOR } : { color: TEXT_COLOR };

  // const hoverProps = {}
  return (
    <Pressable
      {...rest}
      style={[styles.button, hasColor && styles.hasColor, pressState && styles.active]}
      onPressIn={() => setPressState(true)}
      onPressOut={() => setPressState(false)}
    >
      <TextContext.Provider value={textColorProps}>
        <P>
          {children}
        </P>
      </TextContext.Provider>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: ACTION_COLOR,
    border: 'none',
    borderRadius: 100,
    paddingHorizontal: REM,
    paddingVertical: REM / 2,
    marginVertical: REM / 2,
    minHeight: REM / 2
  },
  hasColor: {
    backgroundColor: ACCENT_COLOR,
    color: ACCENT_TEXT_COLOR
  },
  active: {
    
  }
})