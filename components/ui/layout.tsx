"use client";
import { StyleSheet, View, ViewProps } from "react-native";
import { REM } from "../data/constants";

export default function Layout({ children }: ViewProps) {
  return (
    <View style={styles.layout}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    width: '100%',
    paddingVertical: 3 * REM,
    paddingHorizontal: 1.5 * REM
  }
})