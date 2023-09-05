import { forwardRef, useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { ACCENT_COLOR, ACTION_COLOR, ACTION_COLOR_MEDIUM, BORDER_RADIUS, ERROR_COLOR, REM } from "../data/constants";

const GAP_SIZE = REM / 2;

interface NumberSequenceInputProps {
  lengthDigits: number,
  error?: boolean
}


const NumberSequenceInput = forwardRef<TextInput, NumberSequenceInputProps & TextInputProps>(({ lengthDigits, error, ...rest }, ref) => {

  const [userInput, setUserInput] = useState('');
  const digits = new Array(lengthDigits).fill('X');
  const [rootWidth, setRootWidth] = useState(Dimensions.get('window').width);

  const [isFocused, setIsFocused] = useState(false);

  for (let i = 0; i < userInput.length; i++) {
    digits[i] = userInput[i];
  }

  const highlightDigit = digits.findIndex((value) => value === 'X');

  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  // 👇 focus the text input on click
  const handlePress = () => {
    if (!ref) return;
    // @ts-expect-error TextInput ref type
    if (!ref.current) return;
    // @ts-expect-error TextInput ref type
    ref.current.focus();
  };

  // 💥 intercept the onChangeText prop and send it cleaned user input
  useEffect(() => {
    rest.onChangeText && rest.onChangeText(userInput);
  }, [rest.onChangeText, userInput]);

  return (
    <Pressable style={styles.root} onPress={handlePress} onLayout={(e) => setRootWidth(e.nativeEvent.layout.width)}>
      {digits.map((digit, index) => <View
        key={index}
        style={[
          styles.digitBox,
          {
            borderColor: error ? ERROR_COLOR : (index == highlightDigit && isFocused ? ACCENT_COLOR : 'transparent'),
            backgroundColor: index == highlightDigit && isFocused ? ACTION_COLOR_MEDIUM : ACTION_COLOR,
            width: (rootWidth - ((lengthDigits - 1) * GAP_SIZE)) / lengthDigits,
            aspectRatio: 0.75
          },
        ]}
      >
        <Text style={[styles.digitText]}>{digit !== 'X' && digit}</Text>
      </View>)}
      <TextInput
        {...rest}
        value={userInput}
        onChangeText={(text) => {
          setUserInput(text.replace(/[^0-9]/g, ''));
        }}
        maxLength={lengthDigits}
        keyboardType='number-pad'
        returnKeyType='done'
        ref={ref}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        style={styles.textInput}
      />
    </Pressable>
  );
});

export default NumberSequenceInput;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: GAP_SIZE
  },
  digitBox: {
    width: 2 * REM,
    height: 3 * REM,
    // backgroundColor: ACTION_COLOR,
    borderRadius: BORDER_RADIUS / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: REM / 2,
    borderWidth: (REM / 16) * 2,
  },
  digitText: {
    fontSize: 2 * REM
  },
  textInput: {
    opacity: 0,
    position: 'absolute'
  },
  highlightDigitBox: {
    borderWidth: (REM / 16) * 2,
  }
})