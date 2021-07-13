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

export default function Login() {

    const router = useRouter();
    const user = useStoreState(state => state.user);
    const username = useStoreState(state => state.username);
    const blogs = useStoreState(state => state.blogs);

    useEffect(() => {
        if(user) {
            // user is already signed up, are they registered?
            if(username) {
                // user is registered, send to their page
                router.push(`/users/${username}`)
            } else {
                // user is not registered, send to /create-user
                router.push('/create-user')
            }
        } 
        // else user is not logged in, stay here 
    }, [user, username, blogs]);

    // if blogs exist, redirect 
    useEffect(() => {
        if(blogs) {
            if(blogs.length === 0) {
                // needs to create a blog, send to /create-blog
                router.push('/create-blog')
            } else {
                // has blogs already, send to user page
                router.push(`/users/${username}`)
            }
        }
    }, [blogs]);

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
