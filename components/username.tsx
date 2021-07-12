import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from '../firebase'

export default function useUsername(user: firebase.User | null | undefined,
    userLoading: boolean, userError: firebase.auth.Error | undefined) {

    const [username, setUsername] = useState<string | undefined>();

    useEffect(() => {
        (async () => {
            try {
                if (user && !userLoading) {
                    const userDoc = await firebase.firestore().collection('usernames').doc(user.uid).get();
                    const userData = userDoc.data();
                    if(userDoc.exists && userData) {
                        setUsername(userData.username);
                    }
                }
            } catch (error) {

            }
        })();
    }, [user, userLoading, userError]);

    return username;
}