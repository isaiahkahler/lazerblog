import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import firebase from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import * as firebaseui from 'firebaseui';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react'
import useUsername from '../components/username'


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
    const [user, userLoading, userError] = useAuthState(firebase.auth());
    const username = useUsername(user, userLoading, userError);
    const [blogs, setBlogs] = useState<string[] | undefined>();
    const [firebaseError, setFirebaseError] = useState<Error | undefined>(undefined);
    const router = useRouter();

    // if username, get blogs
    useEffect(() => {
        (async () => {
            try {
                if(username) {
                    // user is registered, do they have a blog?
                    const userDoc = await firebase.firestore().collection('users').doc(username).get();
                    const userData = userDoc.data();
                    if(userDoc.exists && userData) {
                        setBlogs(userData.blogs);
                    }
                }
            } catch (error) {

            }
        })();
    }, [username]);

    // if blogs, redirect 
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
                    {(userError || firebaseError) ? <div>
                        <h1>An error occurred.</h1>
                        <p>{userError ? userError.message : firebaseError && firebaseError.message}</p>
                        <p>{userError ? userError.code : firebaseError && firebaseError.stack}</p>

                    </div> 
                    : <>
                        <h1 style={{ textAlign: 'center' }}>Sign in to continue to Lazer Blog.</h1>
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                    </>}
                </Container>
            </Layout>

        </div>
    )
}
