import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { REM } from "../../components/data/constants";
import Container from "../../components/ui/container";
import Input from "../../components/ui/input";
import Layout from "../../components/ui/layout";
import P, { H1 } from "../../components/ui/text";

export default function Login() {
  return (
    <Layout>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons name='close' size={24} />
        </Pressable>
      </View>
      <Container style={{maxWidth: 22.5 * REM}}>
        <H1>Login or Sign Up</H1>
        <P>to do more on Reauthor</P>

        <Input placeholder="something" />
      </Container>
    </Layout>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    // alignItems: 'flex-end',
    position: 'absolute',
    right: 1 * REM,
    top: 1 * REM,
    // backgroundColor: 'rgba(255,0,0,0.2)'
  }
})