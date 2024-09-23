import { Platform } from "react-native";
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { useFonts } from 'expo-font';
import LoginScreen from '../components/loginScreen';
import SignInScreen from '../components/signInScreen';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

if (Platform.OS === "web") {
  require("../tamagui-web.css");
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (!loaded || isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      {isAuthenticated ? (
        <Slot />
      ) : (
        showLogin ? (
          <LoginScreen onLogin={() => { }} onSwitchToSignIn={() => setShowLogin(false)} />
        ) : (
          <SignInScreen onSignIn={() => { }} onSwitchToLogin={() => setShowLogin(true)} />
        )
      )}
    </TamaguiProvider>
  );
}