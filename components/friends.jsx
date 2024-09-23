import React, { useState } from 'react';
import { Input, Button, XStack, YStack, Text, Avatar, Card, Dialog } from 'tamagui';
import { useFriendsData } from './useFriendsData';
import { AURA_CHANGE_AMOUNTS } from '../app/constants';

const FriendsPage = () => {
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const {
        friendsData,
        currentUserCredits,
        error,
        handleAuraChange
    } = useFriendsData();

    const handleCardPress = (index) => {
        setSelectedCardIndex(prevIndex => prevIndex === index ? null : index);
    };

    const handleSearchChange = (text) => {
        setSearchTerm(text);
    };

    const filteredFriends = friendsData.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <YStack flex={1} padding="$4" paddingTop="$10" space="$4">
            <Text>Your Credits: {currentUserCredits}</Text>
            <XStack marginBottom="$2">
                <Input
                    flex={1}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={handleSearchChange}
                />
                <Button marginLeft="$2">Add</Button>
            </XStack>
            <YStack space="$2">
                {filteredFriends.map((friend, index) => (
                    <YStack key={friend.id} space="$1">
                        <Card
                            bordered
                            padded
                            pressStyle={{ scale: 0.98 }}
                            onPress={() => handleCardPress(index)}
                        >
                            <YStack>
                                <XStack justifyContent="space-between" alignItems="center">
                                    <XStack alignItems="center" space="$2">
                                        <Avatar circular size="$4" />
                                        <Text fontSize="$4" fontWeight="bold">{friend.name}</Text>
                                    </XStack>
                                    <Text fontSize="$4" color="$gray11">{friend.aura} aura</Text>
                                </XStack>
                            </YStack>
                        </Card>
                        {selectedCardIndex === index && (
                            <XStack space="$1" marginTop="$1" marginBottom="$4" justifyContent="flex-end">
                                {AURA_CHANGE_AMOUNTS.map((amount) => (
                                    <Button
                                        key={amount}
                                        size="$3"
                                        theme={amount < 0 ? "red" : "green"}
                                        onPress={() => handleAuraChange(friend.id, amount, setAlertMessage, setShowAlert)}
                                    >
                                        <Text fontSize="$4" fontWeight="bold">{amount > 0 ? `+${amount}` : amount}</Text>
                                    </Button>
                                ))}
                            </XStack>
                        )}
                    </YStack>
                ))}
            </YStack>
            <Dialog open={showAlert} onOpenChange={setShowAlert}>
                <Dialog.Portal>
                    <Dialog.Overlay key="Overlay" />
                    <Dialog.Content key="Content">
                        <Dialog.Title key="title">Alert</Dialog.Title>
                        <Dialog.Description key="description">{alertMessage}</Dialog.Description>
                        <Dialog.Close asChild>
                            <Button key="close">OK</Button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </YStack>
    );
};

export default FriendsPage;