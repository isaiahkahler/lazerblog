import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import { REM } from '../../components/data/constants';
import Button from '../../components/ui/button';

import Mdi from '@expo/vector-icons/MaterialCommunityIcons'
import { Colors } from 'react-native/Libraries/NewAppScreen';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Mdi>['name'];
  color: string;
}) {
  return <Mdi size={28} 
  // style={{ marginBottom: -3 }} 
  {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: 'Home Tab',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      /> */}
      <Tabs.Screen
        name="two"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="magnify" color={color} />,
        }}
      />
      <Tabs.Screen

        name="login/index"
        options={{
          // title: '',
          tabBarShowLabel: false,
          // tabBarIcon: ({ color }) => <Button><Text style={{fontSize: 0.7 * REM}}>Sign Up</Text></Button>,
          // tabBarButton:() => <Button><Text style={{fontSize: 0.8 *  REM}}>Sign Up</Text></Button>,
          tabBarButton:() => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Button hasColor><Text style={{fontSize: 0.8 *  REM}}>Sign Up</Text></Button></View>
        }}
      />
    </Tabs>
  );
}
