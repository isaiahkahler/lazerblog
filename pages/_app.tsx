import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useStore } from '../data/store'
import React, { useEffect, useState } from 'react'
import { Blog, User } from '@data/types'
import { supabase } from '@supabase'
import Nav from '../components/nav'
import Head from 'next/head'
import { Session } from '@supabase/gotrue-js'
// import { RealtimeClient } from '@supabase/realtime-js'

function MyApp({ Component, pageProps }: AppProps) {
    return <MyAppWrapper><Component {...pageProps} /></MyAppWrapper>;
}

function MyAppWrapper(props: { children?: React.ReactNode }) {

    // const setUserAuth = useStore(state => state.setUserAuth);
    const setUser = useStore(state => state.setUser);
    const setUserLoading = useStore(state => state.setUserLoading);
    const title = useStore(state => state.title);
    const user = useStore(state => state.user);

    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        console.log('session', session);
        (async () => {
            if(session && session.user) {
                const userResponse = await supabase.from('users').select('*').eq('user_id', session.user.id)
                if (userResponse.error) throw userResponse.error;
                const user = userResponse.data[0] as User | null;
                const blogsResponse = await supabase.from('blogs').select('*').eq('user_id', session.user.id);
                if(blogsResponse.error) throw blogsResponse.error;
                const blogs = blogsResponse.data as Blog[];


                console.log('user!!', user);
                setUser({
                    data: user,
                    auth: session.user,
                    blogs: blogs
                });
            } else {
                setUser({
                    data: null,
                    auth: null,
                    blogs: null

                });
            }
            
            setUserLoading(false);

        })();
    }, [session, setUser, setUserLoading]);

    useEffect(() => {
        setSession(supabase.auth.session())
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('auth state changed', session?.user)

            setSession(session)
        })
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

