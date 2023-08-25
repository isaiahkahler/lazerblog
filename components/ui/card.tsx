import { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { BACKGROUND_COLOR, BORDER_RADIUS } from "../data/constants";

export default function Card ({children, style}: ViewProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: BACKGROUND_COLOR,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: BORDER_RADIUS,
  }
})