import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import firebase from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import * as firebaseui from 'firebaseui';
import { useEffect, useState } from 'react'
import useUsername from '../components/username'
import { useStoreState } from '../components/store'
import { UserBoundary } from '../components/userBoundary'


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
                <title>Sign in to Lazer Blog</title>
                <meta name="description" content="Fast and Free Blogging Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout style={{ minHeight: "100vh", display: 'flex' }}>
                <Container style={{ alignItems: 'center' }}>
                    <h1 style={{ textAlign: 'center' }}>Sign in to continue to Lazer Blog.</h1>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                </Container>
            </Layout>

        </div>
    )
}


export default function LoginWrapper() {
    const router = useRouter();
    const blogs = useStoreState(state => state.blogs);
    return(
        <UserBoundary onUserLoaded={(user, username) => {
            if(!user) return; // stay to log in
            if(!username) { // needs to register
                router.push('/create-user');
                return;
            }
            if(blogs && blogs.length === 0) { // needs to create first blog
                router.push('/create-blog');
                return;
            }
            // has blogs, go to user page
            router.push(`/users/${username}`);
        }}>
            <Login />
        </UserBoundary>
    );
}