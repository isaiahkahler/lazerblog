import { useContext } from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { ERROR_COLOR, ScaleContext } from "../data/constants";
// import { REM } from "../data/constants";
import { TextContext } from "../data/contexts";

interface CustomTextProps {
  error?: boolean
}

export default function P({children, error, ...rest}: CustomTextProps & TextProps) {
  const textStyles = useContext(TextContext);
  const scale = useContext(ScaleContext);
  const REM = error ? 0.8 * scale : scale;

  return (<Text {...rest} style={[styles.paragraph, {fontSize: REM}, textStyles, error && styles.error, rest.style]}>{children}</Text>)
}

export function H1({children, error, ...rest}: CustomTextProps & TextProps) {
  const textStyles = useContext(TextContext);
  const REM = useContext(ScaleContext);

  return (<Text {...rest} style={[styles.h1, {fontSize: 2 * REM}, textStyles, error && styles.error, rest.style]}>{children}</Text>)
}

export function H2({children, error, ...rest}: CustomTextProps & TextProps) {
  const textStyles = useContext(TextContext);
  const REM = useContext(ScaleContext);

  return (<Text {...rest} style={[styles.h2, {fontSize: 1.4 * REM}, textStyles, error && styles.error, rest.style]}>{children}</Text>)
}

const styles = StyleSheet.create({
  paragraph: {
    // fontSize: REM,
  },
  h1: {
    // fontSize: 2 * REM,
    fontWeight: 'bold'
  },
  h2: {
    // fontSize: 1.4 * REM,
    fontWeight: 'bold'
  },
  error: {
    color: ERROR_COLOR
  }
});