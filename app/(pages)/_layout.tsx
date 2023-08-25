import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { APP_COLORS, REM, ScaleContext, ScreenNumberToSize, ScreenSizeContext, ScreenSizeToNumber } from '../../components/data/constants';
import { useStore } from '../../components/data/store';
import Button from '../../components/ui/button';
import { createBottomTabNavigator, BottomTabScreenProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
// import { ScreenComponentType } from '@react-navigation/core'
// import { ScreenComponentType } from '@react-navigation/bottom-tabs'
// import { ScreenComponentType } from '@react-navigation/elements'
// import { ScreenComponentType } from '@react-navigation/native'
// import { ScreenComponentType } from '@react-navigation/native-stack'
// import { ScreenComponentType } from '@react-navigation/routers'
import { ReactNode, useContext } from 'react';
import { H1, H2 } from '../../components/ui/text';
import Home from './index'
import Profile from './profile'
import Search from './search'

import createNavigatorFactory from '../../components/ui/nav'
// const Tabs = createBottomTabNavigator();
const Tabs = createNavigatorFactory();
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


interface NavMenuItem {
  name: string,
  icon: () => ReactNode,
  component: () => ReactNode,
  options: BottomTabNavigationOptions

}

export default function TabLayout() {
  const user = useStore(state => state.user);

  // const navMenuItems: NavMenuItem[] = [
  //   {
  //     name: "Home",
  //     icon: () => <MaterialCommunityIcons name='home' size={2 * REM} />,
  //     component: Home,
  //     options: {
  //       tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
  //     }
  //   },
  //   {
  //     name: "Search",
  //     icon: () => <MaterialCommunityIcons name='magnify' size={2 * REM} />,
  //     component: Search,
  //     options: {
  //       tabBarIcon: ({ color }) => <TabBarIcon name="magnify" color={color} />,
  //     }
  //   },
  //   {
  //     name: "Profile",
  //     icon: () => <MaterialCommunityIcons name='account-circle' size={2 * REM} />,
  //     component: Search,
  //     options: {
  //       tabBarButton: profileButton
  //     }
  //   },
  // ]

  return (
    <Tabs.Navigator tabBarStyle={{}} contentStyle={{}} >
      <Tabs.Screen
        name='home'
        component={Home}
        options={{
          icon: (props) => <MaterialCommunityIcons name='home' size={28} {...props} />
        }}
      />
      <Tabs.Screen
        name='search'
        component={Search}
        options={{
          icon: (props) => <MaterialCommunityIcons name='magnify' size={28} {...props} />
        }}
      />
      <Tabs.Screen
        name={'profile'}
        component={Profile} options={{
          icon: (props) => <MaterialCommunityIcons name={user ? 'account-circle' : 'arrow-right-circle'} size={28} {...props} />,
          children: user ? undefined : (props) => <ScaleContext.Provider value={0.9 * REM}><Button hasColor><Text>Sign Up</Text></Button></ScaleContext.Provider>,
          link: user ? undefined : '/login',
          title: user ? undefined : 'sign up' 
        }}
      />
      {user && <>
        <Tabs.Screen
          name='settings'
          component={() => <Text>settings</Text>}
          options={{
            icon: (props) => <MaterialCommunityIcons name='cog' size={28} {...props} />
          }}
        />
      </>}
    </Tabs.Navigator>

    // <View style={styles.root}>
    // {/* <View style={{ maxWidth: isLargeDisplay ? 42.5 * REM + 15.5 * REM : undefined, flex: 1 }}> */}

    // <Tabs.Navigator
    //   screenOptions={{
    //     // 👉 show vertical navigation if the screen is wide!
    //     tabBarStyle: {
    //       display: isLargeDisplay ? 'none' : undefined,
    //     },
    //     tabBarActiveTintColor: APP_COLORS[colorScheme ?? 'light'].tint,
    //     tabBarShowLabel: false,
    //     headerShown: false,

    //   }}
    //   tabBar={isLargeDisplay ? () => <LargeDisplayNav navMenuItems={navMenuItems} /> : undefined}

    // >

    //   {navMenuItems.map((item) => <Tabs.Screen
    //     name={item.name}
    //     component={item.component}
    //     options={{
    //       ...item.options,

    //     }}
    //     key={item.name}

    //   />)}

    // </Tabs.Navigator>
    // </View>
    // </View>
  );
}

// function LargeDisplayNav({navMenuItems}: {navMenuItems: NavMenuItem[]}) {
//   return (
//     <View style={styles.largeNav}>
//       {navMenuItems.map((item) => {

//         const Icon = item.options?.tabBarIcon || ((_: any) => <></>);

//         return (
//           <Button style={styles.navButton} key={item.name}>
//             <View style={styles.navButtonView}>
//               {Icon({ color: "#ff0000", focused: false, size: 28 })}
//               <H2>{item.name}</H2>
//             </View>
//           </Button>
//         )
//       })}
//     </View>
//   );
// }


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
    paddingTop: 200,
    // alignSelf: 'flex-start',

    // flexBasis: 1
    order: -1
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