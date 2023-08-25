import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { URL } from "react-native-url-polyfill";
import { ACTION_COLOR, ACTION_COLOR_DARK, BACKGROUND_COLOR, COUNTRY_CODE_DEFINITIONS, DEVICE_HAS_NON_US_LOCALE, DEVICE_NON_US_LOCALES, ScaleContext } from "../../components/data/constants";
import Button, { SquareButton } from "../../components/ui/button";
import Container from "../../components/ui/container";
import Input from "../../components/ui/input";
import NumberSequenceInput from "../../components/ui/numberSequenceInput";
import ShakeOnErrorView from "../../components/ui/shakeOnErrorView";
import P, { H1 } from "../../components/ui/text";

export default function Login() {
  const REM = useContext(ScaleContext);
  const [inputPhone, setInputPhone] = useState('');
  const validPhone = inputPhone.length === 10; // TODO: add more phone validation

  const firstLocale = DEVICE_NON_US_LOCALES.length > 0 ? DEVICE_NON_US_LOCALES[0] : null;
  // const firstLocaleCallingCode = 

  const defaultCallingCode = '+' + (firstLocale && firstLocale.regionCode && firstLocale.regionCode in COUNTRY_CODE_DEFINITIONS && COUNTRY_CODE_DEFINITIONS[(firstLocale.regionCode as 'US')].calling_code.toString() || '1')
  const [callingCode, setCallingCode] = useState('')

  // 🔄 effect: phone number 10 digits max
  const handlePhoneInput = (input: string) => {
    if(/[^0-9()\s-]/.test(input)) return;
    if (input.replace(/[^0-9]/g, "").length > 10) {
      // reverse the string
      const reversed = input.split('').reverse();
      // find and remove the first digit
      reversed.splice(reversed.findIndex(item => !isNaN(parseFloat(item))) || 0, 1);
      // un-reverse string
      setInputPhone(reversed.reverse().join(''));
    } else {
      setInputPhone(input);
    }
  };

  const handleCallingCodeInput = (input: string) => {
    // if a non-allowed character
    if(/[^+0-9]/g.test(input)) return;
    // if doesn't start with +
    if(input.length > 0 && input[0] !== '+') {
      setCallingCode('+' + input);
      return;
    }
    // if a plus is somewhere else
    if(input.substring(1).indexOf('+') !== -1) {
      return;
    }
    setCallingCode(input);
  };

  return (
    <Container style={{ maxWidth: 22.5 * REM }}>
      <H1>Login or Sign Up</H1>
      <P style={{ marginTop: REM / 4, marginBottom: REM }}>to do more on Reauthor</P>
      <View style={{ width: '100%', flexDirection: 'row', gap: REM / 2 }}>
        {firstLocale && <Input
          placeholder={defaultCallingCode}
          keyboardType="number-pad"
          returnKeyType="done"
          style={{ fontSize: 1.2 * REM, letterSpacing: 1.2, width: REM * 4 }}
          value={callingCode}
          onChangeText={handleCallingCodeInput}
          maxLength={4}
        />}
        <Input
          label='phone number'
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          returnKeyType="done"
          style={{ fontSize: 1.2 * REM, letterSpacing: 1.2 }}
          rootStyle={{ flex: 1 }}
          value={inputPhone}
          onChangeText={handlePhoneInput}

        />
      </View>
      <SquareButton textStyle={{ textAlign: 'center' }} hasColor={validPhone}>
        continue →
      </SquareButton>

      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottomColor: ACTION_COLOR_DARK,
        borderBottomWidth: 1,
        marginVertical: REM
      }}>
        <Text style={{ position: 'absolute', backgroundColor: BACKGROUND_COLOR, paddingHorizontal: REM / 2 }}>or</Text>
      </View>


      <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Apple
      </Button>
      <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Google
      </Button>
    </Container>
  );
}

// const styles = StyleSheet.create({
//   squareButton: {
//     aspectRatio: 1,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });