import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useStore } from '../data/store'
import React, { useCallback, useEffect, useState } from 'react'
import { Blog, User } from '@data/types'
import { supabase } from '@supabase'
import Nav from '../components/nav'
import Head from 'next/head'
import { ApiError, Session, Subscription } from '@supabase/gotrue-js'
import { RealtimeSubscription } from '@supabase/realtime-js'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'

function MyApp({ Component, pageProps }: AppProps) {
    return <MyAppWrapper><Component {...pageProps} /></MyAppWrapper>;
}

function MyAppWrapper(props: { children?: React.ReactNode }) {

    const setUser = useStore(state => state.setUser);
    const setUserLoading = useStore(state => state.setUserLoading);
    const title = useStore(state => state.title);
    const user = useStore(state => state.user);

    const [session, setSession] = useState<Session | null>(null);

    const [updateUserListeners, setUpdateUserListeners] = useState<string | null>(null);

    // code review 
    const shouldUpdateUser = session && session.user && (!user.data || user.data.user_id === session.user.id) && session.user !== user.auth;

    const updateUserData = useCallback((userData: User) => {
        setUser({
            ...user,
            data: userData
        });
    }, [setUser, user]);

    const updateUserBlogs = useCallback((blog: Blog) => {
        setUser({
            ...user,
            blogs: { ...user.blogs, [blog.blog_slug]: blog }
        })
    }, [setUser, user]);

    // delete
    useEffect(() => {
        console.log('blogs update', user.blogs);
    }, [user.blogs]);


    useEffect(() => {
        console.log('session update');
    }, [session])

    // auth state listener
    useEffect(() => {
        let authStateListener: {
            data: Subscription | null;
            error: ApiError | null;
        } = {
            data: null,
            error: null
        }
        setSession(supabase.auth.session())
        authStateListener = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('auth state changed', session?.user)
            setSession(session)
        })

        return () => {
            console.log('auth state cleanup');
            if (authStateListener.data) {
                authStateListener.data.unsubscribe();
            }
        }
    }, []);

    // set user data & activate listeners when auth object appears
    useEffect(() => {

        (async () => {
            // if session exists & there's a session user & the session user is not the same as current user (or nobody was logged in)
            // unsubscribe past user (if exists), and set new user listener 
            if (shouldUpdateUser && session && session.user) {
                console.log('updating user in app');

                // get user's data and blog
                const userResponse = await supabase.from('users').select('*').eq('user_id', session.user.id)
                if (userResponse.error) throw userResponse.error;
                const _user = userResponse.data[0] as User | null;
                const blogsResponse = await supabase.from('blogs').select('*').eq('user_id', session.user.id);
                if (blogsResponse.error) throw blogsResponse.error;
                const blogs = blogsResponse.data as Blog[];
                const blogsObj = (blogsResponse.data as Blog[]).reduce((previous, current, i) => ({ ...previous, [current.blog_slug]: current }), {});

                setUser({
                    data: _user,
                    auth: session.user,
                    blogs: blogsObj
                });

                setUserLoading(false);

                setUpdateUserListeners(session.user.id);
            }

            setUserLoading(false);

        })();
    }, [session, setUser, setUserLoading, shouldUpdateUser]);

    // here rico 👇
    // set listeners when activated & unsubscribe on cleanup
    useEffect(() => {

        let userListener: RealtimeSubscription | null = null;
        let blogsListener: RealtimeSubscription | null = null;

        if (updateUserListeners) {
            console.log('trying to set listeners, uid:', updateUserListeners)

            userListener = supabase.from(`users:user_id=eq.${updateUserListeners}`).on('*', (payload) => {
                console.log('user updated realtime', payload.new)
                if (payload.new) {
                    updateUserData(payload.new as User);
                }
            }).subscribe();

            const handleBlogsUpdate = (payload: SupabaseRealtimePayload<any>) => {
                if (payload.new) {
                    updateUserBlogs(payload.new as Blog);
                }
            }

            const handleBlogDelete = (payload: SupabaseRealtimePayload<any>) => {
                // code review: todo
                // remove old key from blogs array 
            }

            blogsListener = supabase.from(`blogs:user_id=eq.${updateUserListeners}`)
                .on('UPDATE', handleBlogsUpdate)
                .on('INSERT', handleBlogsUpdate)
                .on('DELETE', handleBlogDelete)
                .subscribe();
        }

        return () => {
            if (userListener) {
                console.log('cleaning up user listener')
                userListener.unsubscribe()
            }
            if (blogsListener) {
                console.log('cleaning up blog')
                blogsListener.unsubscribe();
            }
        }
    }, [updateUserBlogs, updateUserData, updateUserListeners])




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

