// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBbTNuPrr52R-ix2gs1vFufYq5zUJSeivM",
    authDomain: "aura-6e730.firebaseapp.com",
    databaseURL: "https://aura-6e730-default-rtdb.firebaseio.com",
    projectId: "aura-6e730",
    storageBucket: "aura-6e730.appspot.com",
    messagingSenderId: "1058748757062",
    appId: "1:1058748757062:web:883528e7417ceeeb6bc647",
    measurementId: "G-1L2N9RTRCY"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };