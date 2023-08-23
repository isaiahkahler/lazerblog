import { createContext, forwardRef, PropsWithChildren, useContext, useState } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT, ACCENT_TEXT_COLOR, ACTION_COLOR, ACTION_COLOR_LIGHT, BACKGROUND_COLOR, ScaleContext, TEXT_COLOR } from "../data/constants";
import { TextContext } from "../data/contexts";
import P from "./text";


type ButtonProps = { hasColor?: boolean };

const Button = forwardRef<any, ButtonProps & PropsWithChildren<PressableProps>>((props, ref) => {

  const { hasColor, children, ...rest } = props;
  const [pressState, setPressState] = useState(false);

  const textColorProps = hasColor ? { color: ACCENT_TEXT_COLOR } : { color: TEXT_COLOR };

  const REM = useContext(ScaleContext);

  // const hoverProps = {}
  return (
    <Pressable
      {...rest}
      style={[styles.button, {
        paddingHorizontal: REM,
        paddingVertical: REM / 2,
        marginVertical: REM / 2,
        minHeight: REM / 2
      }, hasColor && styles.hasColor, pressState && styles.active, rest.style]}
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

});

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: ACTION_COLOR,
    border: 'none',
    borderRadius: 100,
  },
  hasColor: {
    backgroundColor: ACCENT_COLOR,
    color: ACCENT_TEXT_COLOR
  },
  active: {

  },
  buttonText: {
    pointerEvents: 'none'
  }
})