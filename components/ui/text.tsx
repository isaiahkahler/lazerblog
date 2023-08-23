import { useContext } from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { ScaleContext } from "../data/constants";
// import { REM } from "../data/constants";
import { TextContext } from "../data/contexts";

export default function P({children, ...rest}: TextProps) {
  const textStyles = useContext(TextContext);
  const REM = useContext(ScaleContext);

  return (<Text {...rest} style={[styles.paragraph, {fontSize: REM}, textStyles, rest.style]}>{children}</Text>)
}

export function H1({children, ...rest}: TextProps) {
  const textStyles = useContext(TextContext);
  const REM = useContext(ScaleContext);

  return (<Text {...rest} style={[styles.h1, {fontSize: 2 * REM}, textStyles, rest.style]}>{children}</Text>)
}

export function H2({children, ...rest}: TextProps) {
  const textStyles = useContext(TextContext);
  const REM = useContext(ScaleContext);

  return (<Text {...rest} style={[styles.h2, {fontSize: 1.4 * REM}, textStyles, rest.style]}>{children}</Text>)
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
  }
});