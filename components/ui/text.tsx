import { useContext } from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { REM } from "../data/constants";
import { TextContext } from "../data/contexts";

export default function P({children, ...rest}: TextProps) {
  const textStyles = useContext(TextContext);

  return (<Text {...rest} style={[styles.paragraph, textStyles]}>{children}</Text>)
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: REM,
  }
});