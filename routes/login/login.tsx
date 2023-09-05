import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ACCENT_COLOR, REM, ScaleContext } from "../../components/data/constants";
import { SquareButton } from "../../components/ui/button";
import Container from "../../components/ui/container";
import Layout from "../../components/ui/layout";
import { LoadingOverlay } from "../../components/ui/loading";
import Stepper, { useStepperControl } from "../../components/ui/stepper";
import P, { H1 } from "../../components/ui/text";
import LoginProviderStep from "./loginProviderStep";
import OTPVerificationStep from "./otpVerificationStep";


interface LoginProps {
  handleClickAway: () => void
}

export default function Login({ handleClickAway }: LoginProps) {
  const REM = useContext(ScaleContext);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState<string>('');


  // 🔢 stepper controller
  const [stage, nextStage, previousStage, setStage] = useStepperControl(3);



  return (
    <>
      {/* 👇 loading overlay */}
      {loading && <LoadingOverlay />}

      <ScrollView style={styles.scrollArea}>
        {/* 👇 close modal icon */}
        <View style={styles.iconContainer}>
          <Pressable onPress={handleClickAway}>
            <MaterialCommunityIcons name='close' size={24} />
          </Pressable>
        </View>
        {/* 👇 the login UI */}
        <Layout style={{ minHeight: '100%' }}>
          <Container style={{ maxWidth: 22.5 * REM }}>
            <Stepper.Provider stage={stage}>
              <Stepper.Screen stage={0}>
                <LoginProviderStep setPhone={setPhone} setLoading={setLoading} nextStage={nextStage} />
              </Stepper.Screen>
              <Stepper.Screen stage={1}>
                <OTPVerificationStep phone={phone} nextStage={nextStage} setLoading={setLoading} />
              </Stepper.Screen>
              <Stepper.Screen stage={2}>
                <H1>Almost there.</H1>
                <P>Finish setting up your account to </P>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: REM }}>
                  <MaterialCommunityIcons name="check-circle-outline" color={ACCENT_COLOR} size={4 * REM} />
                </View>
                <SquareButton onPress={() => { setStage(0) }}>reset</SquareButton>

              </Stepper.Screen>
            </Stepper.Provider>
          </Container>
        </Layout>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    right: 1 * REM,
    top: 1 * REM,
    zIndex: 2
  },
  scrollArea: {
    overflow: 'hidden',
    minHeight: '100%'
  }
});