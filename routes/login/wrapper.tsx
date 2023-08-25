import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { REM } from "../../components/data/constants";
import Container from "../../components/ui/container";
import Input from "../../components/ui/input";
import Layout from "../../components/ui/layout";
import P, { H1 } from "../../components/ui/text";
import Login from "./login";

export default function LoginWrapper() {
  return (
    <Layout>
      {/* 👇 close modal icon */}
      <View style={styles.iconContainer}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/')}>
          <MaterialCommunityIcons name='close' size={24} />
        </Pressable>
      </View>
      {/* 👇 the login UI */}
      <ScrollView>
        <Login />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    right: 1 * REM,
    top: 1 * REM,
  }
})