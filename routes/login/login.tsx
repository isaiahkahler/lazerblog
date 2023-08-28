import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Locale } from "expo-localization";
import { useContext, useEffect, useState } from "react";
import { useController, useForm, Control } from "react-hook-form";
import { Image, StyleSheet, Text, View } from "react-native";
import { URL } from "react-native-url-polyfill";
import { ACTION_COLOR, ACTION_COLOR_DARK, BACKGROUND_COLOR, COUNTRY_CODE_DEFINITIONS, DEVICE_HAS_NON_US_LOCALE, DEVICE_NON_US_LOCALES, ERROR_COLOR, ScaleContext } from "../../components/data/constants";
import { supabase } from "../../components/data/supabase";
import Button, { SquareButton } from "../../components/ui/button";
import Container from "../../components/ui/container";
import Input from "../../components/ui/input";
import NumberSequenceInput from "../../components/ui/numberSequenceInput";
import ShakeOnErrorView from "../../components/ui/shakeOnErrorView";
import P, { H1 } from "../../components/ui/text";


interface LoginFormFields {
  phone: string,
  callingCode?: string,
}

export default function Login() {
  const REM = useContext(ScaleContext);

  // 🌎 get device localization information to add and input for calling codes if needed
  const firstLocale = DEVICE_NON_US_LOCALES.length > 0 ? DEVICE_NON_US_LOCALES[0] : null;

  // 🕹️ form controller 
  const { control, formState: { isValid }, handleSubmit } = useForm<LoginFormFields>({});

  // 💥 sign in handler 
  const onSubmit = async (values: LoginFormFields) => {
    const wellFormattedNumber = `${values.callingCode || ''}${values.phone.replace(/[^0-9]/g, '')}`;
    console.log('well formatted number:', wellFormattedNumber)


    // const { error } = await supabase.auth.signInWithOtp({
    //   phone: wellFormattedNumber
    // });
    // if (error) throw error;
    
  }

  return (
    <Container style={{ maxWidth: 22.5 * REM }}>
      <H1>Login or Sign Up</H1>
      <P style={{ marginTop: REM / 4, marginBottom: REM }}>to do more on Reauthor</P>
      <View style={{ width: '100%', flexDirection: 'row', gap: REM / 2, alignItems: 'flex-start' }}>
        {/* {firstLocale && <Input
          placeholder={defaultCallingCode}
          keyboardType="number-pad"
          returnKeyType="done"
          style={{ fontSize: 1.2 * REM, letterSpacing: 1.2, width: REM * 4 }}
          value={callingCode}
          onChangeText={handleCallingCodeInput}
          maxLength={4}
        />} */}
        {firstLocale && <CallingCodeInput control={control} firstLocale={firstLocale} />}

        <PhoneNumberInput control={control} />

      </View>
      <SquareButton textStyle={{ textAlign: 'center' }} hasColor={isValid} onPress={handleSubmit(onSubmit)}>
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

interface CallingCodeInputProps {
  control: Control<LoginFormFields>,
  firstLocale: Locale | null
}

function CallingCodeInput({ control, firstLocale }: CallingCodeInputProps) {
  const REM = useContext(ScaleContext);
  const defaultCallingCode = '+' + (firstLocale && firstLocale.regionCode && firstLocale.regionCode in COUNTRY_CODE_DEFINITIONS && COUNTRY_CODE_DEFINITIONS[(firstLocale.regionCode as 'US')].calling_code.toString() || '1')
  const { field: { value, onChange }, fieldState: { error, invalid } } = useController({
    control,
    name: 'callingCode',
    defaultValue: defaultCallingCode,
    rules: {
      maxLength: 4,
      pattern: /^\+\d{1,3}$/
    }
  });

  // const errorMessage = error && (error.type === 'pattern') ? 'Invalid'

  return (
    <View style={{ flexDirection: 'column' }}>
      <Input
        placeholder={defaultCallingCode}
        keyboardType="number-pad"
        returnKeyType="done"
        style={{ fontSize: 1.2 * REM, letterSpacing: 1.2, width: REM * 4 }}
        value={value}
        onChangeText={(text) => onChange(`+${text.replace(/[^0-9]/g, "")}`)}
        error={invalid}
        maxLength={4}
      />
      {error && <P error>Invalid.</P>}
    </View>
  );
}

const PHONE_NUMBER_MAX_LENGTH = 15;
function PhoneNumberInput({ control }: { control: Control<LoginFormFields> }) {
  const REM = useContext(ScaleContext);

  const { field: { value, onChange }, fieldState: { error, invalid } } = useController({
    control,
    name: 'phone',
    defaultValue: '',
    rules: {
      maxLength: PHONE_NUMBER_MAX_LENGTH,
      pattern: /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      required: true,
    }
  });

  const errorMessage = error && (error.type === 'required' ? 'This field is required.' : 'Please enter a valid phone number.')


  return (
    <View style={styles.inputWrapper}>
      <Input
        label='phone number'
        inputMode='tel'
        autoComplete="tel"
        keyboardType="number-pad"
        returnKeyType="done"
        style={{ fontSize: 1.2 * REM, letterSpacing: 1.2 }}
        rootStyle={{ flex: 1 }}
        value={value}
        onChangeText={(text) => onChange(text.replace(/[^0-9()\s-\.]/g, ""))}
        error={invalid}
        maxLength={PHONE_NUMBER_MAX_LENGTH}
      />
      {errorMessage && <P error>{errorMessage}</P>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'column',
    flex: 1
  }
});