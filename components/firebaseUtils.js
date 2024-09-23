import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue, get, set } from 'firebase/database';
import { INITIAL_CREDITS } from '../app/constants';

export const handleLogout = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        console.log('User logged out successfully');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export const fetchUserData = (setUserData) => {
    const auth = getAuth();
    const db = getDatabase();
    const userRef = ref(db, 'users/' + auth.currentUser.uid);

    return onValue(userRef, async (snapshot) => {
        let data = snapshot.val();
        if (data) {
            if (data.credits === undefined || data.lastRefillDate === undefined) {
                data = {
                    ...data,
                    credits: data.credits !== undefined ? data.credits : INITIAL_CREDITS,
                    lastRefillDate: data.lastRefillDate !== undefined ? data.lastRefillDate : new Date().toISOString().split('T')[0]
                };
                await set(userRef, data);
            }
            setUserData(data);
        }
    });
};

export const fetchTransactions = async (userData, setTransactions) => {
    const db = getDatabase();

    const giveListArray = userData.giveList ?
        Object.entries(userData.giveList).map(([key, value]) => ({
            ...value,
            id: key
        })) : [];

    giveListArray.sort((a, b) => new Date(b.date) - new Date(a.date));

    const transactionsWithNames = await Promise.all(giveListArray.map(async (transaction) => {
        const senderSnapshot = await get(ref(db, `users/${transaction.user}`));
        const senderData = senderSnapshot.val();
        return {
            ...transaction,
            userName: senderData ? senderData.name : 'Unknown User'
        };
    }));

    setTransactions(transactionsWithNames);
};

export const checkAndRefillCredits = (userData, setUserData, setTimeUntilRefill) => {
    console.log("Checking and refilling credits");
    console.log("Current userData:", userData);

    const refillCredits = async () => {
        console.log("Attempting to refill credits");
        const auth = getAuth();
        const db = getDatabase();
        const userRef = ref(db, 'users/' + auth.currentUser.uid);

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        console.log("Last refill date:", userData.lastRefillDate);
        console.log("Today's date:", today);

        if (userData.lastRefillDate !== today) {
            console.log("Refill condition met. Updating credits.");
            const updatedUserData = {
                ...userData,
                lastRefillDate: today,
                credits: INITIAL_CREDITS
            };

            try {
                await set(userRef, updatedUserData);
                console.log("Firebase update successful");
                setUserData(updatedUserData);
                console.log("Credits refilled. New userData:", updatedUserData);
            } catch (error) {
                console.error("Firebase update failed:", error);
            }
        } else {
            console.log("Refill not needed. Last refill was today.");
        }
    };

    const updateTimeUntilRefill = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timeUntil = tomorrow - now;
        const hours = Math.floor(timeUntil / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilRefill(`${hours}h ${minutes}m`);

        console.log(`Time until next refill: ${hours}h ${minutes}m`);
    };

    // Call refillCredits immediately when the function is invoked
    refillCredits();

    // Then set up the interval for updating the time until next refill
    updateTimeUntilRefill();
    return setInterval(updateTimeUntilRefill, 60000); // Update every minute
};