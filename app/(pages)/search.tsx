import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function TabTwoScreen() {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  return (
    <View onLayout={(e) => {setHeight(e.nativeEvent.layout.height);setWidth(e.nativeEvent.layout.width)}} style={{flex: 1}}>
      <Text>
        Tab two screen

        My height is {height}
        My width is {width}
      </Text>
    </View>
  );
}
