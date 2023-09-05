import { useEffect, useRef, useState } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { Platform } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SquareButton } from "../../components/ui/button";
import NumberSequenceInput from "../../components/ui/numberSequenceInput";
import ShakeOnErrorView from "../../components/ui/shakeOnErrorView";
import P, { H1 } from "../../components/ui/text";
import "react-native-url-polyfill/auto";

interface OTPInputFields {
  code: string
}

interface OTPVerificationStepProps {
  phone: string,
  nextStage: () => void,
  setLoading: (loading: boolean) => void,
}

// ✅ TODO: add react-hook-form for accessibility & web standards
export default function OTPVerificationStep({ phone, nextStage, setLoading }: OTPVerificationStepProps) {

  const { control, formState: {errors, isSubmitting, isSubmitted, isValid}, handleSubmit, reset } = useForm<OTPInputFields>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const onSubmit = async (fields: OTPInputFields) => {
    setLoading(true);
    // const { error, data: { user, session } } = await supabase.auth.verifyOtp({
    //   phone,
    //   token: fields.code,
    //   type: 'sms'
    // });
    // if (error) {
    //   setError(error.message);
    //   return;
    // }

    setTimeout(() => {
      nextStage();
      setLoading(false);
    }, 500);
  }

  const submitHandler = Platform.OS === 'web' ? {
    onPress: handleSubmit(onSubmit)
  } : {
    onTouchStart: handleSubmit(onSubmit)
  }

  // 💥 clear the overlay and input if there is an error
  useEffect(() => {
    if (!!errorMessage) return;
    setLoading(false);
    reset();
  }, [errorMessage])

  // 💥 stop loading on unmount
  useEffect(() => {
    return () => setLoading(false);
  }, [])

    // 💥 update error count when the user clicks submit again
    useEffect(() => {
      if (!errors.code) return;
      console.log('error is', errors.code)
      setErrorCount(errorCount + 1);
    }, [errors.code?.ref, isSubmitted]);
    useEffect(() => {
      if (!errors.code) return;
      setErrorCount(errorCount + 1);
    }, [isSubmitting]);

  return (
    <>
      <H1>Enter the code</H1>
      <P>We've sent a code to {phone}. </P>
      {/* <NumberSequenceInput lengthDigits={6} onChangeText={(text) => setCode(text)} /> */}
      <ShakeOnErrorView changingError={errorCount || !!errorMessage}>
        <OTPInput control={control} />
        {errorMessage && <P error>{errorMessage}</P>}
      </ShakeOnErrorView>
      <SquareButton hasColor={isValid} {...submitHandler}>continue →</SquareButton>
    </>
  );
}

function OTPInput({ control }: { control: Control<OTPInputFields> }) {

  const inputRef = useRef<TextInput>(null);

  // 💥 focus on mount
  useEffect(() => {
    if (!inputRef) return;
    inputRef.current?.focus();
  }, [inputRef]);

  const { field: { value, onChange }, fieldState: { error, invalid } } = useController({
    control,
    name: 'code',
    defaultValue: '',
    rules: {
      maxLength: 6,
      minLength: 6,
      pattern: /^[0-9]+$/g,
      required: true,
    }
  });

  return (
    <>
      <NumberSequenceInput ref={inputRef} error={!!error} lengthDigits={6} onChangeText={onChange} value={value} />
      {/* </ShakeOnErrorView> */}
      {error && <P error>This field is required.</P>}
    </>
  );
}