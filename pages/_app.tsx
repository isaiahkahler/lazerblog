import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StoreProvider } from 'easy-peasy'
import { store, useStoreActions, useStoreState } from '../components/store'
import firebase from '../firebase'
import React, { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
    return <StoreProvider store={store}><MyAppWrapper><Component {...pageProps} /></MyAppWrapper></StoreProvider>
}

function MyAppWrapper(props: { children?: React.ReactNode }) {

    const username = useStoreState(state => state.username);
    const setUser = useStoreActions(actions => actions.setUser);
    const setUsername = useStoreActions(actions => actions.setUsername);
    const setBlogs = useStoreActions(actions => actions.setBlogs);
    const setUserLoading = useStoreActions(actions => actions.setUserLoading)

    useEffect(() => {
        // when auth state changes, update user, username, and blog
        console.log('use effect', firebase.auth().currentUser);
        const unsub = firebase.auth().onAuthStateChanged(async (user) => {

            if (user) {
                setUser(user);
                    try {
                        const usernameRef = await firebase.firestore().collection('usernames').doc(user.uid).get();
                        const usernameData = usernameRef.data();
                        if (usernameRef.exists && usernameData) {
                            setUsername(usernameData.username);
                        } else {
                            setUsername(undefined);
                        }

                        const userRef = await firebase.firestore().collection('users').doc(username).get();
                        const userData = userRef.data();
                        if (userRef.exists && userData) {
                            setBlogs(userData.blogs);
                        } else {
                            setBlogs(undefined);
                        }

                    } catch (error) {

                    }
            } else {
                setUser(undefined);
                setUsername(undefined);
                setBlogs(undefined);
            }

            setUserLoading(false);

        }, (error) => {

        });
        return () => {
            unsub();
        }
    }, []);

    return (<>
        {props.children}
    </>);
}

export default MyApp
