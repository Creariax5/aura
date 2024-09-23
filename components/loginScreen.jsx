import React, { useState } from 'react';
import { Button, Input, YStack, Text } from 'tamagui';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

function LoginScreen({ onSwitchToSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Login successful
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <YStack backgroundColor="$background" f={1} jc="center" ai="center" p="$4" space>
            <Text fontSize="$6" fontWeight="bold">Login</Text>
            <Input value={email} onChangeText={setEmail} placeholder="Email" width={200} />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry width={200} />
            <Button onPress={handleLogin}>Login</Button>
            {error && <Text color="$red10">{error}</Text>}
            <Text>Don't have an account?</Text>
            <Button variant="outlined" onPress={onSwitchToSignIn}>Sign Up</Button>
        </YStack>
    );
}

export default LoginScreen;