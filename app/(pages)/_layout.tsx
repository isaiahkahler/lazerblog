import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { APP_COLORS, REM, ScreenNumberToSize, ScreenSizeContext, ScreenSizeToNumber } from '../../components/data/constants';
import { useStore } from '../../components/data/store';
import Button from '../../components/ui/button';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useContext } from 'react';
import { H1, H2 } from '../../components/ui/text';


const Tabs = createBottomTabNavigator();
// import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useStore(state => state.user);
  const screenSizeContext = useContext(ScreenSizeContext);

  const profileButton = user ? undefined : () => (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Link href='/login' asChild>
      <Button hasColor>Sign Up</Button>
    </Link>
  </View>);


  const isLargeDisplay = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['lg'];

  return (
    <View style={styles.root}>
      {isLargeDisplay && <View style={styles.largeNav}>
        <Button style={styles.navButton}>
          <View style={styles.navButtonView}>
            <MaterialCommunityIcons name='home' size={2 * REM} />
            <H2>Home</H2>
          </View>
        </Button>
        <Button style={styles.navButton}>
          <View style={styles.navButtonView}>
            <MaterialCommunityIcons name='magnify' size={2 * REM} />
            <H2>Search</H2>
          </View>
        </Button>
        <Button style={styles.navButton}>
          <View style={styles.navButtonView}>
            <MaterialCommunityIcons name='account-circle' size={2 * REM} />
            <H2>Profile</H2>
          </View>
        </Button>
        <Button style={styles.navButton}>
          <View style={styles.navButtonView}>
            <MaterialCommunityIcons name='cog' size={2 * REM} />
            <H2>Settings</H2>
          </View>
        </Button>
      </View>}
      <View style={{maxWidth: isLargeDisplay ? 42.5 * REM + 15.5 * REM : undefined, flex: 1}}>

      <Tabs.Navigator
        screenOptions={{
          // 👉 show vertical navigation if the screen is wide!
          tabBarStyle: {
            display: isLargeDisplay ? 'none' : undefined,
          },
          tabBarActiveTintColor: APP_COLORS[colorScheme ?? 'light'].tint,
          tabBarShowLabel: false,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          component={() => <Text>home tab</Text>}
          options={{
            // title: 'Tab One',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="search"
          component={() => <Text>search tab</Text>}
          options={{
            // title: 'Tab Two',
            tabBarIcon: ({ color }) => <TabBarIcon name="magnify" color={color} />,
          }}
        />
        <Tabs.Screen
          component={() => <Text>profile tab</Text>}
          name="profile"
          options={{
            tabBarButton: profileButton
            // tabBarIcon: () => <View style={{flex:}}></View>

          }}
        />
        {/* <Tabs.Screen options={{}} /> */}
      </Tabs.Navigator>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(255,0,0,0.2)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: REM
  },
  largeNav: {
    width: 15.5 * REM,
    backgroundColor: 'rgba(0,0,255,0.2)',
    paddingHorizontal: REM / 2,
    display: 'flex',
    // justifyContent: 'center'
    paddingTop: 200
  },
  navButton: {
    alignSelf: 'flex-start'
  },
  navButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: REM / 2,
  }
})