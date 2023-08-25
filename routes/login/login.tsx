import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { URL } from "react-native-url-polyfill";
import { ACTION_COLOR_DARK, ScaleContext } from "../../components/data/constants";
import Button, { SquareButton } from "../../components/ui/button";
import Container from "../../components/ui/container";
import Input from "../../components/ui/input";
import NumberSequenceInput from "../../components/ui/numberSequenceInput";
import P, { H1 } from "../../components/ui/text";

export default function Login() {
  const REM = useContext(ScaleContext);
  const [phone, setPhone] = useState('');
  return (
    <Container style={{ maxWidth: 22.5 * REM }}>
      <H1>Login or Sign Up</H1>
      <P style={{ marginTop: REM / 4, marginBottom: REM }}>to do more on Reauthor</P>
      <View style={{ borderBottomWidth: 1, width: '90%', borderBottomColor: ACTION_COLOR_DARK, alignSelf: 'center' }} />
      {/* <P style={{ marginVertical: REM / 2, textAlign: 'center' }}>Sign in with:</P> */}


      {/* <P style={{ marginTop: REM / 4, marginBottom: REM }}>to do more on Reauthor</P> */}
      <View style={{ flexDirection: 'row' }}>
        {/* <Input textContentType="telephoneNumber" style={{width: '100%', fontSize: REM * 1.5, fontWeight: 'bold', letterSpacing: 4, fontVariant: ['tabular-nums']}} /> */}
        {/* ☑️ todo: detect region and modify number of digits to locale */}
        {/* <NumberSequenceInput lengthDigits={6} /> */}
      </View>
      <Input
      label='phone number'
        // placeholder="phone number"
        textContentType="telephoneNumber"
        keyboardType="number-pad"
        returnKeyType="done"
        style={{fontSize: 1.2 * REM, letterSpacing: 1.2}}
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />



      {/* <View style={{ flexDirection: 'row', gap: REM / 2, paddingHorizontal: REM, justifyContent: 'center', alignItems: 'flex-start' }}>
        <SquareButton style={styles.squareButton}>
          <MaterialCommunityIcons name='apple' size={REM * 3} />
        </SquareButton>
        <SquareButton style={styles.squareButton}>
          // <MaterialCommunityIcons name='google' size={REM * 3} />
          <Image source={{uri: "https://img.icons8.com/?size=512&id=17949&format=png"}} style={{width: REM * 3, height: REM * 3}}  />
        </SquareButton>
        <SquareButton style={styles.squareButton}>
          <MaterialCommunityIcons name='phone' size={REM * 3} />
        </SquareButton>
      </View> */}

      {/* <Input placeholder="email address" /> */}
      {/* <Button onPress={() => setCount(count + 1)}>Can you press me? {count}</Button> */}


      {/* <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Apple
      </Button>
      <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Google
      </Button>
      <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Phone Number
      </Button> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  squareButton: {
    aspectRatio: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});