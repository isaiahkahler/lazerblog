import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import firebase from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import * as firebaseui from 'firebaseui';
import { useEffect, useState } from 'react'
import { useStore } from '../components/store'
import { UserBoundary } from '../components/userBoundary'
import useRedirect from '../components/useRedirect'

type SignInHandler = (userAuth: firebase.User) => void;

let onSignIn : SignInHandler = (userAuth) => {};

const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: (auth: any) => {
            const userAuth : firebase.User | undefined = auth.user && auth.user as firebase.User;
            if(userAuth) {
              onSignIn(userAuth);
            }
            return false;
        },
        signInFailure: (error) => { },
    }
}

function Login() {
    const router = useRouter();
    const user = useStore(state => state.user);

    onSignIn = (_userAuth) => {
        if(_userAuth && user.data) {
            router.push(`/users/${user.data.username}`);
        }
        if(_userAuth && !user.data) {
            router.push('/create-user')
        }
    }

    return (
        <div>
            <Head>
                <title>Sign in to reauthor</title>
                <meta name="description" content="Fast and Free Blogging Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout style={{ minHeight: "100vh", display: 'flex' }}>
                <Container style={{ alignItems: 'center' }}>
                    <h1 style={{ textAlign: 'center' }}>Sign in to continue to reauthor.</h1>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                </Container>
            </Layout>

        </div>
    )
}


export default function LoginWrapper() {
    const router = useRouter();
    const redirect = useRedirect();
    return (
        <UserBoundary 
        onUserLoaded={(user) => {
            // console.log('user loaded in login', user)
            if (!user.auth) return; // stay to log in
            if (!user.data) { // needs to register
                router.push('/create-user');
                return;
            }

            const userData = user.data;
            // code review: may want to send to /home instead
            // if (user.blogs && user.blogs.length === 0) { // needs to create first blog
            //     router.push('/create-blog');
            //     return;
            // }
            // redirect will redirect if the URL contains ?redirect=[new-route]
            // else, has blogs, go to user page
            redirect(() => {
                router.push(`/users/${userData.username}`);
            });
        }}
        >
            <Login />
        </UserBoundary>
    );
}