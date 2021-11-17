import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useStore } from '../components/store'
import firebase from '../firebase'
import React, { useEffect } from 'react'
import { User } from '../components/types'
import Nav from '../components/nav'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return <MyAppWrapper><Component {...pageProps} /></MyAppWrapper>;
}

function MyAppWrapper(props: { children?: React.ReactNode }) {

    // const setUserAuth = useStore(state => state.setUserAuth);
    const setUser = useStore(state => state.setUser);
    const setUserLoading = useStore(state => state.setUserLoading);
    const title = useStore(state => state.title);

    useEffect(() => {
        // when auth state changes, update user, username, and blog
        let unsubUserListener = () => { };
        let unsubUsernameListener = () => { };

        const unsub = firebase.auth().onAuthStateChanged(async (userAuth) => {
            console.log('auth state changed', userAuth);

            if (!userAuth) {
                // setUserAuth(null);
                // setUser(null);
                setUser({
                    data: null,
                    auth: null
                })
                setUserLoading(false);
                return;
            }

            console.log('some console log in the middle')

            // setUserAuth(userAuth);
            try {
                // set username

                console.log('trying to get username')

                unsubUsernameListener = firebase.firestore().collection('usernames').doc(userAuth.uid).onSnapshot((usernameRef) => {

                    console.log('inside username listener')

                    // const usernameRef = await firebase.firestore().collection('usernames').doc(userAuth.uid).get();
                    const usernameData = usernameRef.data();
                    const _username: string | undefined = usernameRef.exists && usernameData ? usernameData.username : undefined;

                    if (!_username) {
                        console.log('couldnt get username')
                        // setUser(null);
                        // setUserAuth(null);
                        setUser({
                            data: null,
                            auth: userAuth
                        })
                        setUserLoading(false);
                        return;
                    }

                    console.log('got username')

                    // set blogs & following
                    unsubUserListener = firebase.firestore().collection('users').doc(_username).onSnapshot((doc) => {
                        console.log('user state changed')
                        const docData = doc.data();
                        if (doc.exists && docData) {
                            setUser({
                                data: { username: _username, ...docData } as User,
                                auth: userAuth
                            });
                            // setUserAuth(userAuth);
                            setUserLoading(false);
                        } else {
                            // setUser(null);
                            // setUserAuth(userAuth);
                            setUser({
                                data: null,
                                auth: userAuth
                            })
                            setUserLoading(false);
                        }
                    }, (error) => {
                        //code review: handle
                        console.error(error);
                    });


                }, (error) => { // end username listener
                    console.error('error username listener', error);
                });


            } catch (error) {
                // code review:
                console.error(error)
            }




            // had to set this after the onSnapshot completes, given as a callback 
            // setUserLoading(false);

        }, (error) => {
            // code review: handle
        });

        // updateData(firebase.auth().currentUser);

        return () => {
            unsub();
            unsubUserListener();
        }
    }, []);

    return (<>
        <Head>
            <title>{title}</title>
            <meta name="description" content="Fast and Free Blogging Service" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        {props.children}
    </>);
}

export default MyApp

