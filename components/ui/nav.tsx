import {
  View,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  CommonActions,
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,

} from '@react-navigation/native';
import { ReactNode, useContext, useState } from 'react';
import { ACCENT_COLOR, ACCENT_TEXT_COLOR, ACTION_COLOR, ACTION_COLOR_DARK, ACTION_COLOR_LIGHT, BACKGROUND_COLOR, REM, ScreenSizeContext, ScreenSizeToNumber } from '../data/constants';
import { ViewProps } from 'react-native';
import { TextStyle } from 'react-native';
import P, { H1, H2 } from './text';
import Button from './button';
import Container from './container';
import Layout from './layout';
import { router } from 'expo-router';
import { useIsExtraLargeScreenSize } from '../hooks/screensize';


// Props accepted by the view
type TabNavigationConfig = {
  tabBarStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  children2?: ReactNode
};

// Supported screen options
type TabNavigationOptions = {
  title?: string,
  icon?: (style?: ViewStyle | TextStyle) => ReactNode,
  children?: (style?: ViewStyle | TextStyle) => ReactNode,
  link?: string,
};

// Map of event name and the type of data (in event.data)
//
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type TabNavigationEventMap = {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  TabNavigationOptions,
  TabNavigationEventMap
> &
  TabRouterOptions &
  TabNavigationConfig;

function TabNavigator({
  initialRouteName,
  children,
  screenOptions,
  tabBarStyle,
  contentStyle
}: Props) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      TabNavigationOptions,
      TabNavigationEventMap
    >(TabRouter, {

      children,
      screenOptions,
      initialRouteName,
    });

  const screenSizeContext = useContext(ScreenSizeContext);

  const verticalNavbar = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['lg'];
  const isExtraLargeScreenSize = useIsExtraLargeScreenSize();


  const onNavigationButtonPress = (route: typeof state.routes[0], currentlyFocused: boolean, link?: string) => {
    if (link) {
      // navigation.dispatch({
      //   ...CommonActions.navigate(link)
      // });
      router.push(link);
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
      data: {
        isAlreadyFocused: currentlyFocused,
      },
    });

    if (!event.defaultPrevented) {
      navigation.dispatch({
        ...CommonActions.navigate(route),
        target: state.key,
      });
    }
  };

  return (
    <NavigationContent>
      <View style={[styles.navRoot, { flexDirection: verticalNavbar ? 'row' : 'column' }]}>
        {/* 👉 render the contents of the tab */}
        <View style={[
          verticalNavbar ? styles.tabContainerVertical : styles.tabContainerHorizontal,
          isExtraLargeScreenSize && styles.tabContainerXL,
          contentStyle
        ]}>
          {state.routes.map((route, i) => (
            <View
              key={route.key}
              style={[StyleSheet.absoluteFill, { display: i === state.index ? 'flex' : 'none' }]}
            >
              {descriptors[route.key].render()}
            </View>
          ))}
        </View>
        {/* 👉 the nav bar */}
        <View style={[verticalNavbar ? styles.tabBarVertical : styles.tabBarHorizontal, tabBarStyle]}>
          {/* 👇 vertical layout if the screen is wide */}
          {verticalNavbar &&
            <ScrollView style={{ flex: 1 }}>
              <Layout style={{ flex: 1 }} >
                {state.routes.map((route) => {
                  const options = descriptors[route.key].options;
                  const icon = options.icon || (() => <></>);
                  const currentlyFocused = route.key === state.routes[state.index].key;

                  return (
                    <Button
                      hasColor={currentlyFocused}
                      key={route.key}
                      onPress={(e) => { onNavigationButtonPress(route, currentlyFocused, options.link) }}
                      style={styles.tabBarVerticalButton}
                    >
                      <View style={styles.tabBarVerticalButtonContents}>
                        {icon({ color: currentlyFocused ? ACCENT_TEXT_COLOR : ACTION_COLOR_DARK })}
                        {/* <H2 style={{ color: currentlyFocused ? ACCENT_COLOR : ACTION_COLOR_DARK }}>{options.title || route.name}</H2> */}
                        <H2 style={{ color: currentlyFocused ? ACCENT_TEXT_COLOR : ACTION_COLOR_DARK }}>{options.title || route.name}</H2>
                      </View>
                    </Button>
                  );
                })}
              </Layout>
            </ScrollView>
          }
          {/* 👇 horizontal layout if the screen is narrow */}
          {!verticalNavbar && state.routes.map((route) => {
            const options = descriptors[route.key].options;
            const hasChild = !!options.icon || !!options.children;
            const icon = options.children || options.icon || (() => <></>);
            const currentlyFocused = route.key === state.routes[state.index].key;
            return (
              <Pressable
                key={route.key}
                onPress={() => onNavigationButtonPress(route, currentlyFocused, options.link)}
                style={styles.tabBarHorizontalButton}
              >
                <View style={styles.tabBarHorizontalButtonContents} pointerEvents='none'>
                  {icon({ color: currentlyFocused ? ACCENT_COLOR : ACTION_COLOR_DARK })}
                  {(!verticalNavbar && !hasChild) && <P style={{ color: currentlyFocused ? ACCENT_COLOR : ACTION_COLOR_DARK }}>{options.title || route.name}</P>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  TabNavigationOptions,
  TabNavigationEventMap,
  typeof TabNavigator
>(TabNavigator);

const styles = StyleSheet.create({
  navRoot: {
    flex: 1,
    justifyContent: 'center'
    // paddingHorizontal: REM
  },
  tabContainerVertical: {
    maxWidth: 42.5 * REM, flex: 1
  },
  tabContainerHorizontal: {
    flex: 1
  },
  tabContainerXL: {
    maxWidth: (42.5 + 15.5) * REM
  },
  tabBarHorizontal: {
    flexDirection: 'row',
    borderTopColor: '#dfdfdf',
    borderTopWidth: REM / 16,
    minHeight: REM * 3,

    // flex: 1,
  },
  tabBarVerticalButton: {
    alignSelf: 'flex-start'
  },
  tabBarHorizontalButton: {
    flex: 1
  },
  tabBarHorizontalButtonContents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarVertical: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',

    order: -1,
    maxWidth: 15.5 * REM,
    justifyContent: 'flex-start'
  },
  tabBarVerticalButtonContents: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: REM / 2,
    paddingVertical: REM / 3,
    paddingLeft: REM / 4,
    paddingRight: REM / 3
  },
});