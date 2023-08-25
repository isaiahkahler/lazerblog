import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { OVERLAY_COLOR, REM } from "../../components/data/constants";
import Card from "../../components/ui/card";
import Layout from "../../components/ui/layout";
import Login from "./login";

export default function LoginWrapper() {
  const dimensions = useWindowDimensions();

  const handleClickAway = () => {
    router.canGoBack() ? router.back() : router.push('/')
  }

  return (
    // 👉 make a modal on web: wrapper with overlay color and clickAway listener
    <Pressable style={styles.rootView} onPress={handleClickAway}>
      {/* 👇 another pressable to cancel touch propagation */}
      <Pressable style={styles.touchArea}>
        <Card style={[styles.card, { minWidth: Math.min(dimensions.width * 0.9, 400) }]}>
          {/* 👇 close modal icon */}
          <ScrollView>
            <View style={styles.iconContainer}>
              <Pressable onPress={handleClickAway}>
                <MaterialCommunityIcons name='close' size={24} />
              </Pressable>
            </View>
            {/* 👇 the login UI */}
            <Layout>
              <Login />
            </Layout>
          </ScrollView>
        </Card>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: OVERLAY_COLOR,
    maxHeight: '100%'
  },
  touchArea: {
    maxHeight: '100%',
    padding: REM
  },
  card: {
    maxHeight: '100%'
  },
  iconContainer: {
    position: 'absolute',
    right: 1 * REM,
    top: 1 * REM,
    zIndex: 2
  }
})