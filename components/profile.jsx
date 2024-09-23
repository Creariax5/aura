import React, { useEffect, useState } from 'react';
import { Avatar, YStack, XStack, Text, Card, Button, ScrollView } from 'tamagui';
import { handleLogout, fetchUserData, fetchTransactions, checkAndRefillCredits } from './firebaseUtils';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [timeUntilRefill, setTimeUntilRefill] = useState('');

    useEffect(() => {
        const unsubscribe = fetchUserData(setUserData);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userData) {
            fetchTransactions(userData, setTransactions);
        }
    }, [userData]);

    useEffect(() => {
        if (userData) {
            const timer = checkAndRefillCredits(userData, setUserData, setTimeUntilRefill);
            return () => clearInterval(timer);
        }
    }, [userData]);

    if (!userData) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <YStack flex={1} padding="$4" paddingTop="$10" space="$4">
                <XStack space="$4" alignItems="center" justifyContent="space-between">
                    <XStack space="$4" alignItems="center">
                        <Avatar circular size="$10">
                            <Avatar.Image src="https://via.placeholder.com/150" />
                            <Avatar.Fallback backgroundColor="$gray5" />
                        </Avatar>
                        <YStack>
                            <Text fontSize="$6" fontWeight="bold">{userData.name}</Text>
                        </YStack>
                    </XStack>
                    <Button onPress={handleLogout} theme="red">Logout</Button>
                </XStack>

                <YStack>
                    <Text fontSize="$4" color="$gray11" >{userData.credits} credits</Text>
                    <Text fontSize="$3" color="$gray10">Refill in: {timeUntilRefill}</Text>
                </YStack>

                <Card bordered padded>
                    <Text fontSize="$8" fontWeight="bold" textAlign="center">{userData.aura}</Text>
                    <Text fontSize="$4" color="$gray11" textAlign="center">AURA</Text>
                </Card>

                <YStack space="$2">
                    {transactions.map((transaction) => (
                        <Card key={transaction.id} bordered padded>
                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$5" fontWeight="bold">
                                    {transaction.given > 0 ? '+' : ''}{transaction.given}
                                </Text>
                                <Text fontSize="$4" color="$gray11">de {transaction.userName}</Text>
                            </XStack>
                            <Text fontSize="$3" color="$gray10">
                                {new Date(transaction.date).toLocaleString()}
                            </Text>
                        </Card>
                    ))}
                </YStack>
            </YStack>
        </ScrollView>
    );
};

export default Profile;