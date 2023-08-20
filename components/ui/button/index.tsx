import { PropsWithChildren } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { ACCENT_COLOR, ACTION_COLOR, TEXT_COLOR } from "../../data/constants";


type ButtonProps = { hasColor?: boolean };

function getClassName(props: ButtonProps & any) {
  return `${styles.button} ${props.className ? props.className : ''}`
}

export default function Button(props: ButtonProps & PropsWithChildren<PressableProps>) {
  const { hasColor, children, ...rest } = props;
  // @ts-expect-error Object Assign Generic Type Error
  const colorProps: StyleProp<ViewStyle> = hasColor ? { ...rest.style, backgroundColor: ACCENT_COLOR, color: TEXT_COLOR } : undefined;
  return (
    <Pressable {...rest} style={[styles.button, colorProps]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: ACTION_COLOR,
    border: 'none',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
    minHeight: 8
  }
})