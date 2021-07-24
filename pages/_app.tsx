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

    const updateData = async (user: firebase.User | null) => {
        console.log('auth state changed')
        if(!user) {
            setUser(undefined);
            setUsername(undefined);
            setBlogs(undefined);
            setUserLoading(false);
            return;
        }

        setUser(user);
        try {
            const usernameRef = await firebase.firestore().collection('usernames').doc(user.uid).get();
            const usernameData = usernameRef.data();
            if (usernameRef.exists && usernameData) {
                setUsername(usernameData.username);
            } else {
                setUsername(undefined);
            }
            const _username = usernameRef.exists && usernameData ? usernameData.username : undefined;

            const userRef = await firebase.firestore().collection('users').doc(_username).get();
            const userData = userRef.data();
            if (userRef.exists && userData) {
                setBlogs(userData.blogs);
            } else {
                setBlogs(undefined);
            }
            // console.log('request: ', `/users/${_username}.blogs`)

        } catch (error) {

        }

        setUserLoading(false);
    }

    useEffect(() => {
        console.log('app wrapper effect')
        // when auth state changes, update user, username, and blog
        const unsub = firebase.auth().onAuthStateChanged(async (user) => {
            console.log('on auth state change???')
            updateData(user);

        }, (error) => {
            // code review: handle
        });

        // updateData(firebase.auth().currentUser);

        return () => {
            unsub();
        }
    }, []);

    return (<>
        {props.children}
    </>);
}

export default MyApp
