import { Locale } from "expo-localization";
import { useContext, useEffect, useState } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { View, StyleSheet, Text, Platform } from "react-native";
import { ACTION_COLOR_DARK, BACKGROUND_COLOR, COUNTRY_CODE_DEFINITIONS, DEVICE_NON_US_LOCALES, REM, ScaleContext } from "../../components/data/constants";
import { supabase } from "../../components/data/supabase";
import Button, { SquareButton } from "../../components/ui/button";
import Input from "../../components/ui/input";
import ShakeOnErrorView from "../../components/ui/shakeOnErrorView";
import P, { H1 } from "../../components/ui/text";


interface LoginFormFields {
  phone: string,
  callingCode?: string,
}


interface LoginProviderStepProps {
  setPhone: (phone: string) => void,
  setLoading: (loading: boolean) => void,
  nextStage: () => void
}

export default function LoginProviderStep({ setPhone, setLoading, nextStage }: LoginProviderStepProps) {
  // 🌎 device localization information
  const firstNonUSLocale = DEVICE_NON_US_LOCALES.length > 0 ? DEVICE_NON_US_LOCALES[0] : null;
  const [errorCount, setErrorCount] = useState(0);

  // 🕹️ form controller 
  const { control, formState: { isValid, errors, isSubmitting, isSubmitted }, handleSubmit, watch } = useForm<LoginFormFields>({});

  // 💪 sign in handler 
  const onSubmit = async (values: LoginFormFields) => {
    setLoading(true);
    const wellFormattedNumber = `${values.callingCode || '+1'}${values.phone.replace(/[^0-9]/g, '')}`;
    console.log('sending otp to', wellFormattedNumber)
    setPhone(wellFormattedNumber);
    // const { error } = await supabase.auth.signInWithOtp({
    //   phone: wellFormattedNumber
    // });
    // if (error) throw error;
    setTimeout(() => {
      nextStage();
      setLoading(false);
    }, 500);
  };

  // 💥 update error count when the user clicks submit again
  useEffect(() => {
    if (isSubmitting && (!!errors.callingCode || !!errors.phone)) {
      setErrorCount(errorCount + 1);
    }
  }, [errors.callingCode, errors.phone, isSubmitting]);
  useEffect(() => {
    if (isSubmitted && (!!errors.callingCode || !!errors.phone)) {
      setErrorCount(errorCount + 1);
    }
  }, [isSubmitted]);



  // 💥 stop loading on unmount
  useEffect(() => {
    return () => setLoading(false);
  }, []);

  // 💪 submit handler  (for correct OS)
  const submitHandler = Platform.OS === 'web' ? {
    onPress: handleSubmit(onSubmit)
  } : {
    onTouchStart: handleSubmit(onSubmit)
  };



  return (
    <>
      <H1>Login or Sign Up</H1>
      <P style={{ marginTop: REM / 4, marginBottom: REM }}>to do more on Reauthor</P>

      {/* 👉 input box(es) for phone number */}
      <ShakeOnErrorView changingError={errorCount}>
        <View style={[styles.inputContainer, { gap: REM / 2 }]}>
          {/* 👇 show a box for calling code if the first locale is not the US */}
          {firstNonUSLocale && <CallingCodeInput control={control} firstLocale={firstNonUSLocale} />}
          <PhoneNumberInput control={control} />
        </View>
      </ShakeOnErrorView>

      {/* 👉 continue button */}
      <SquareButton textStyle={{ textAlign: 'center' }} hasColor={isValid} {...submitHandler}>
        continue →
      </SquareButton>

      {/* 👉 horizontal rule with "or" */}
      <View style={[styles.horizontalRule, { marginVertical: REM }]}>
        <Text style={{ position: 'absolute', backgroundColor: BACKGROUND_COLOR, paddingHorizontal: REM / 2 }}>or</Text>
      </View>

      {/* 👉 third party auth provider buttons */}
      <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Apple
      </Button>
      <Button textStyle={{ fontWeight: 'bold', textAlign: 'center' }}>
        Sign in with Google
      </Button>
    </>
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
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  horizontalRule: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomColor: ACTION_COLOR_DARK,
    borderBottomWidth: 1,
  }
});