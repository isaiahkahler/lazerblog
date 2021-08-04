import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StoreProvider } from 'easy-peasy'
import { store, useStoreActions, useStoreState } from '../components/store'
import firebase from '../firebase'
import React, { useEffect } from 'react'
import { User } from '../components/types'

function MyApp({ Component, pageProps }: AppProps) {
    return <StoreProvider store={store}><MyAppWrapper><Component {...pageProps} /></MyAppWrapper></StoreProvider>
}

function MyAppWrapper(props: { children?: React.ReactNode }) {

    const setUserAuth = useStoreActions(actions => actions.setUserAuth);
    const setUser = useStoreActions(actions => actions.setUser);
    const setUserLoading = useStoreActions(actions => actions.setUserLoading);

    useEffect(() => {
        // when auth state changes, update user, username, and blog
        let unsubDocListeners = () => { };
        let unsubOtherListener = () => {};
        const unsub = firebase.auth().onAuthStateChanged(async (userAuth) => {
            console.log('auth state changed')
            if (!userAuth) {
                setUserAuth(undefined);
                setUser(undefined);
                setUserLoading(false);
                return;
            }

            setUserAuth(userAuth);
            try {
                // set username
                const usernameRef = await firebase.firestore().collection('usernames').doc(userAuth.uid).get();
                const usernameData = usernameRef.data();
                const _username: string | undefined = usernameRef.exists && usernameData ? usernameData.username : undefined;
                
                if (!_username) {
                    setUser(undefined);
                    setUserLoading(false);
                    return;
                }

                // set blogs & following
                unsubDocListeners = firebase.firestore().collection('users').doc(_username).onSnapshot((doc) => {
                    const docData = doc.data();
                    if (doc.exists && docData) {
                        setUser({username: _username, ...docData} as User);
                    }
                    setUserLoading(false);
                }, (error) => {
                    //code review: handle
                    console.error(error);
                });

            } catch (error) {
                // code review:
                console.error(error)
            }

            // had to set this after the onSnapshot completes, given as a callback 
            // setUserLoading(false);

        }, (error) => {
            // code review: handle
        }, () => {
            console.log('wtf? completed')
        });

        // updateData(firebase.auth().currentUser);

        return () => {
            unsub();
            unsubDocListeners();
        }
    }, []);

    return (<>
        {props.children}
    </>);
}

export default MyApp
