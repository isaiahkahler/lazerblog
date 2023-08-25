import { useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { ACTION_COLOR, BORDER_RADIUS, REM } from "../data/constants";

interface NumberSequenceInputProps {
  lengthDigits: number,

}

export default function NumberSequenceInput({ lengthDigits, ...rest }: NumberSequenceInputProps & TextInputProps) {
  const [userInput, setUserInput] = useState('');
  const [isLength, setIsLength] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const digits = new Array(lengthDigits).fill(0);
  const [rootWidth, setRootWidth] = useState(Dimensions.get('window').width);

  const handleOnBlur = () => {

  };

  // 👇 focus the text input on click
  const handlePress = () => {
    if (!inputRef) return;
    if (!inputRef.current) return;
    inputRef.current.focus();
  };

  return (
    <Pressable style={styles.root} onPress={handlePress} onLayout={(e) => setRootWidth(e.nativeEvent.layout.width)}>
      {digits.map((digit, index) => <View
        key={index} 
        style={[styles.digitBox, {width: (rootWidth * 0.8) / lengthDigits, aspectRatio: 0.75}]}
      >
        <Text style={styles.digitText}>{digit}</Text>
      </View>)}
      {/* <DigitsDisplay userInput={userInput} lengthDigits={lengthDigits} /> */}

      <TextInput
        {...rest}
        value={userInput}
        onChangeText={(text) => setUserInput(text)}
        maxLength={lengthDigits}
        keyboardType='number-pad'
        returnKeyType='done'
        ref={inputRef}
        onBlur={handleOnBlur}
        style={styles.textInput}
      />
    </Pressable>
  );
}

// interface DigitsDisplayProps {
//   lengthDigits: number,
//   userInput: string
// }

// function DigitsDisplay({ lengthDigits, userInput }: DigitsDisplayProps) {
//   const digits = new Array(lengthDigits).fill(0);
//   return (
//     <>
//       {digits.map((digit, index) => <View style={styles.digitBox}><Text style={styles.digitText}>{digit}</Text></View>)}
//     </>
//   );
// }

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: REM / 2
  },
  digitBox: {
    // backgroundColor: 'red'
    width: 2 * REM,
    height: 2.5 * REM,
    backgroundColor: ACTION_COLOR,
    borderRadius: BORDER_RADIUS / 2,
    justifyContent: 'center',
    alignItems: 'center'

  },
  digitText: {
    fontSize: 2 * REM
  },
  textInput: {
    opacity: 0,
    position: 'absolute'
  }
})