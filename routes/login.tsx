import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import { supabase } from '@supabase'
import { Auth } from '@supabase/ui'
import { useEffect, useState } from 'react'
import { useStore } from '../data/store'
import { UserBoundary } from '../components/userBoundary'
import useRedirect from '../hooks/useRedirect'
import If from '@components/if'


function Login() {

    const router = useRouter();
    const { completed } = router.query;

    const user = useStore(state => state.user);


    return (
        <div>
            <Head>
                <title>Sign in to reauthor</title>
                <meta name="description" content="Fast and Free Blogging Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout style={{ minHeight: "100vh", display: 'flex' }}>
                <Container style={{ alignItems: 'center' }}>

                    <If value={completed}>
                        <h1>Almost there.</h1>
                        <h2>check your email to complete sign up. </h2>
                    </If>
                    <If.not value={completed}>
                        <h1 style={{ textAlign: 'center' }}>Sign in to continue to reauthor.</h1>

                        <Auth.UserContextProvider supabaseClient={supabase}>
                            <Container>
                                <Auth supabaseClient={supabase} redirectTo='/login?completed=true' />
                            </Container>
                        </Auth.UserContextProvider>
                    </If.not>

                </Container>
            </Layout>

        </div>
    )
}

// function AuthBasic() {
//     return (
//         <Auth.UserContextProvider supabaseClient={supabase}>
//             <Container supabaseClient={supabase}>
//                 <Auth supabaseClient={supabase} />
//             </Container>
//         </Auth.UserContextProvider>
//     )
// }


export default function LoginWrapper() {
    const router = useRouter();
    const redirect = useRedirect();
    return (
        <UserBoundary
            onUserLoaded={(user) => {
                // console.log('user loaded in login', user)
                if (!user.auth) return; // stay to log in
                if (!user.data) { // needs to register
                    router.push('/create-profile');
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