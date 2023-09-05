import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text } from 'react-native';
import { REM, ScaleContext } from '../../components/data/constants';
import { useStore } from '../../components/data/store';
import Button from '../../components/ui/button';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { ReactNode } from 'react';
import Home from './index'
import Profile from './profile'
import Search from './search'

import createNavigatorFactory from '../../components/ui/nav'
import Settings from '../../routes/settings';

const Tabs = createNavigatorFactory();

export default function TabLayout() {
  const user = useStore(state => state.user);
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
          component={Settings}
          options={{
            icon: (props) => <MaterialCommunityIcons name='cog' size={28} {...props} />
          }}
        />
      </>}
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  largeNav: {
    width: 15.5 * REM,
    backgroundColor: 'rgba(0,0,255,0.2)',
    paddingHorizontal: REM / 2,
    display: 'flex',
    paddingTop: 200,
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