import React, { useState } from 'react';
import { Button, Input, YStack, Text } from 'tamagui';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

function SignInScreen({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Ajoutez un état pour le nom
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Ajoutez les informations de l'utilisateur à la Realtime Database
            const db = getDatabase();
            await set(ref(db, 'users/' + user.uid), {
                name: name,
                email: email,
                aura: 100, // Valeur initiale de l'aura
                credits: 1000,
                accountCreation: new Date().toISOString()
            });

            // Sign-up successful, Firebase will update the auth state
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <YStack backgroundColor="$background" f={1} jc="center" ai="center" p="$4" space>
            <Text fontSize="$6" fontWeight="bold">Sign Up</Text>
            <Input value={name} onChangeText={setName} placeholder="Name" width={200} />
            <Input value={email} onChangeText={setEmail} placeholder="Email" width={200} />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry width={200} />
            <Button onPress={handleSignUp}>Sign Up</Button>
            {error && <Text color="$red10">{error}</Text>}
            <Text>Already have an account?</Text>
            <Button variant="outlined" onPress={onSwitchToLogin}>Login</Button>
        </YStack>
    );
}

export default SignInScreen;