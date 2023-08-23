import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { ACCENT_COLOR_DARK, ACTION_COLOR, ACTION_COLOR_DARK, BORDER_RADIUS, REM } from "../data/constants";

export default function Input ({...props}: TextInputProps) {
  return (
    <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor='#bbb' />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: ACTION_COLOR,
    borderRadius: BORDER_RADIUS,
    marginTop: (REM/16)*5,
    marginBottom: (REM/16)*20,
    paddingHorizontal: (REM/16)*10,
    paddingVertical: (REM/16)*5,
    fontSize: (REM/16)*18,
    // outlineColor: ACCENT_COLOR_DARK,
    // outline: '1'
    // outline: `1 solid ${'#FF0000'}`
  },
})