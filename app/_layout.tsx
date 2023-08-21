import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useStore } from '../components/data/store';
import { ScreenSizeContext } from '../components/data/constants';
import '@expo/match-media'
import { useMediaQuery } from "react-responsive";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


const reauthorTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    primary: '#6173fb',
    background: '#fafafa',
    card: 'rgb(255, 255, 255)',
    text: '#0a0a0a',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
}


const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!);



function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const session = useStore(state => state.session);
  const setSession = useStore(state => state.setSession);
  const setUser = useStore(state => state.setUser);



  const isXS = useMediaQuery({ query: '(max-width: 575px)' }); // 0 - 575 xs
  const isSM = useMediaQuery({ query: '(max-width: 767px)' }); // 576 - 767 sm
  const isMD = useMediaQuery({ query: '(max-width: 991px)' }); // 768 - 991 md
  const isLG = useMediaQuery({ query: '(max-width: 1199px)' }); // 992 - 1199 lg
  const screenSize = isXS ? 'xs' : (isSM ? 'sm' : (isMD ? 'md' : (isLG ? 'lg' : 'xl'))) // 1200+ xl
  const screenSizeNumber = isXS ? 1 : (isSM ? 2 : (isMD ? 3 : (isLG ? 4 : 5)))


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session && session.user) {
        setUser(session.user);
      } else if (!session) {
        setUser(null);
      }
    })

    return () => subscription.unsubscribe()
  }, []);

  useEffect(() => {
    console.log('session is', session)
  }, [session]);


  setSession(null);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : reauthorTheme}>
      <ScreenSizeContext.Provider value={{size: screenSize, sizeNumber: screenSizeNumber}}>
        <Stack>
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </ScreenSizeContext.Provider>
    </ThemeProvider>
  );
}
