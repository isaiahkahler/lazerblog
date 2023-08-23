import { useContext } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { REM, ScreenSizeContext } from "../data/constants";
import {useWindowDimensions} from 'react-native';


export default function Container({ children, ...rest }: ViewProps) {
  const screenSizeContext = useContext(ScreenSizeContext);
  const screenSizeNumber = screenSizeContext && screenSizeContext.sizeNumber || 2; //default to MD
  const screenWidth = useWindowDimensions().width;

  return (
    <View style={styles.container}>
      <View {...rest} style={[styles.inner, { marginHorizontal: screenSizeNumber <= 2 ? screenWidth * 0.025 : 4 * REM, }, rest.style || false]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 42.5 * REM
  }
});