import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import firebase from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import * as firebaseui from 'firebaseui';
import { useEffect, useState } from 'react'
import { useStoreState } from '../components/store'
import { UserBoundary } from '../components/userBoundary'
import useRedirect from '../components/useRedirect'


const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
        signInSuccessWithAuthResult: (res) => {
            return false;
        },
        signInFailure: (error) => { },
    }
}

function Login() {

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
        <UserBoundary onUserLoaded={(userAuth, user) => {
            // console.log('user loaded in login', user, username)
            if (!userAuth) return; // stay to log in
            if (!user) { // needs to register
                router.push('/create-user');
                return;
            }
            // code review: may want to send to /home instead
            if (user.blogs && user.blogs.length === 0) { // needs to create first blog
                router.push('/create-blog');
                return;
            }
            // redirect will redirect if the URL contains ?redirect=[new-route]
            // else, has blogs, go to user page
            redirect(() => {
                router.push(`/users/${user.username}`);
            });
        }}>
            <Login />
        </UserBoundary>
    );
}