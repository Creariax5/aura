import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export const useFriendsData = () => {
    const [friendsData, setFriendsData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserCredits, setCurrentUserCredits] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    throw new Error('No authenticated user found');
                }
                setCurrentUserId(user.uid);

                const database = getDatabase();
                const usersRef = ref(database, 'users');

                const snapshot = await get(usersRef);
                if (!snapshot.exists()) {
                    throw new Error('No data available');
                }

                const data = snapshot.val();
                const formattedData = Object.entries(data)
                    .filter(([key]) => key !== user.uid)
                    .map(([key, value]) => ({
                        id: key,
                        name: value.name,
                        aura: value.aura,
                        email: value.email
                    }));

                setFriendsData(formattedData);
                setCurrentUserCredits(data[user.uid].credits || 0);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const handleAuraChange = async (userId, amount, setAlertMessage, setShowAlert) => {
        const creditsNeeded = Math.abs(amount);
        if (currentUserCredits < creditsNeeded) {
            setAlertMessage("You don't have enough credits for this action.");
            setShowAlert(true);
            return;
        }

        try {
            const database = getDatabase();
            const userRef = ref(database, `users/${userId}`);
            const currentUserRef = ref(database, `users/${currentUserId}`);

            const snapshot = await get(userRef);
            if (!snapshot.exists()) {
                throw new Error('User not found');
            }

            const userData = snapshot.val();
            const currentAura = userData.aura;
            const newAura = Math.max(0, currentAura + amount);

            const updates = {
                aura: newAura,
                [`giveList/${Date.now()}`]: {
                    user: currentUserId,
                    given: amount,
                    date: new Date().toISOString()
                }
            };

            await update(userRef, updates);

            // Update current user's credits
            const newCredits = currentUserCredits - creditsNeeded;
            await update(currentUserRef, { credits: newCredits });

            // Update local state
            setFriendsData(prevData =>
                prevData.map(friend =>
                    friend.id === userId ? { ...friend, aura: newAura } : friend
                )
            );
            setCurrentUserCredits(newCredits);
        } catch (err) {
            console.error('Error updating aura:', err);
            setError(err.message);
        }
    };

    return {
        friendsData,
        currentUserCredits,
        error,
        handleAuraChange
    };
};