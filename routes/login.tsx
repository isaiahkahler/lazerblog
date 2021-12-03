import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import { supabase } from '@supabase'
import { Auth } from '@supabase/ui'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../data/store'
import { UserBoundary } from '../components/userBoundary'
import useRedirect from '../hooks/useRedirect'
import If from '@components/if'
import { InputInvalidMessage, InputLabel, useCustomInputProps } from '@components/input'
import { useForm } from 'react-hook-form'
import Button, { useCustomButtonProps } from '@components/button'
import AppleIcon from '@components/icons/appleIcon'
import GoogleIcon from '@components/icons/googleIcon'
import CircleProgress, { SmallCircleProgress } from '@components/circleProgress'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

interface FormInputs {
    usernameOrEmail: string,
    password: string
}

let action: 'sign in' | 'sign up' | null = null;

export function onThingy(token: string) {
    console.log('on thingy!!', token)
}

function Login() {

    const router = useRouter();
    const [completed, setCompleted] = useState(false);

    const user = useStore(state => state.user);

    const { register, formState: { errors }, handleSubmit } = useForm<FormInputs>();

    const { executeRecaptcha } = useGoogleReCaptcha();

    const [formState, setFormState] = useState<'sign in' | 'reset' | 'confirmation' | 'third party'>('sign in');

    const usernameEmailRequiredError = errors.usernameOrEmail?.type === 'required';
    const usernameEmailLengthError = errors.usernameOrEmail?.type === 'minLength';
    const usernameEmailPatternError = errors.usernameOrEmail?.type === 'pattern';
    const usernameEmailError = usernameEmailRequiredError || usernameEmailLengthError || usernameEmailPatternError;

    const passwordRequiredError = errors.password?.type === 'required';
    const passwordLengthError = errors.password?.type === 'minLength';
    const passwordPatternError = errors.password?.type === 'pattern';
    const passwordError = passwordRequiredError || passwordLengthError || passwordPatternError;

    const [loading, setLoading] = useState(false);

    const [loginError, setLoginError] = useState<string | null>(null);
    const ref = useRef<HTMLFormElement>(null);

    const submitHandler = (data: FormInputs) => {
        (async () => {
            try {

                console.log('form success, data:', data, action, !!executeRecaptcha)
                if (!action) return;
                if (!executeRecaptcha) return;
                const recaptchaResponse = await fetch('/api/verify-recaptcha', {
                    headers: {
                        token: await executeRecaptcha()
                    },
                    method: 'post'
                });
                const recaptchaResponseObj = await recaptchaResponse.json();
                if (!('score' in recaptchaResponseObj) || recaptchaResponseObj.score < 0.5) {
                    setLoginError('You might be a bot! Reload and try again if you\'re not');
                    return;
                }

                setLoading(true);
                if (action === 'sign in') {
                    // is an email
                    const signInResponse = await supabase.auth.signIn({
                        email: data.usernameOrEmail,
                        password: data.password
                    }, {
                        redirectTo: '/login'
                    });
                    if (signInResponse.error) {
                        console.error(signInResponse.error)
                        setLoginError(signInResponse.error.message);
                        return;
                    };
                } else {
                    // sign up 
                    const signUpResponse = await supabase.auth.signUp({
                        email: data.usernameOrEmail,
                        password: data.password
                    }, {
                        redirectTo: '/login'
                    });
                    if (signUpResponse.error) {
                        console.error(signUpResponse.error);
                        setLoginError(signUpResponse.error.message);
                        return;
                    };
                    setFormState('confirmation');
                }

                action = null;
                // setLoading(false);

                // activate the password form 
            } catch (error) {
                console.error(error)
            }

        })();


    };

    return (
        <div>
            <Head>
                <title>Sign in to reauthor</title>
                <meta name="description" content="Fast and Free Blogging Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout style={{ minHeight: "100vh", display: 'flex', backgroundColor: "#e9ecf2" }}>
                <Container style={{ alignItems: 'center' }}>

                    {/* <If value={completed}>
                        <h1>Almost there.</h1>
                        <h2>check your email to complete sign up. </h2>
                    </If> */}
                    <h1 style={{ textAlign: 'center' }}>Sign in to continue to reauthor.</h1>



                    {/* <Auth.UserContextProvider supabaseClient={supabase}>
                            <Auth supabaseClient={supabase} />
                    </Auth.UserContextProvider> */}

                    <div style={{ justifyContent: 'center', display: 'flex' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'min(90vw, 400px)', backgroundColor: '#fff', padding: '0 1rem 0.5rem 1rem', borderRadius: '7.5px', boxShadow: '0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)' }}>

                            <If value={formState === 'confirmation'}>
                                <h2>Almost there!</h2>
                                <p>check your email to complete sign up.</p>
                            </If>
                            <If value={formState === 'sign in'}>

                                <form onSubmit={handleSubmit(submitHandler)} ref={ref}>
                                    <InputLabel>Email</InputLabel>
                                    <input type='text' id='usernameEmail' {...register('usernameOrEmail', {
                                        required: true,
                                        minLength: 2,
                                        pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    })} {...useCustomInputProps(!usernameEmailError)} />
                                    <InputInvalidMessage isValid={!(usernameEmailRequiredError)}>Please enter an email</InputInvalidMessage>
                                    <InputInvalidMessage isValid={!(usernameEmailPatternError)}>Email is invalid</InputInvalidMessage>

                                    <InputLabel style={{ marginTop: 0 }}>Password</InputLabel>
                                    <input type='password' id='password' {...register('password', {
                                        required: true,
                                        minLength: 8,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
                                    })} {...useCustomInputProps(!passwordError)} />
                                    <InputInvalidMessage isValid={!(passwordRequiredError)}>Please enter a password</InputInvalidMessage>
                                    <InputInvalidMessage isValid={!(passwordLengthError)}>Password must be at least 8 characters</InputInvalidMessage>
                                    <InputInvalidMessage isValid={!(passwordPatternError)}>Password must be 8 characters or more, with at least one uppercase and lowercase letter, and number.</InputInvalidMessage>
                                    <InputInvalidMessage isValid={!(loginError)} style={{ textAlign: 'center' }}>{loginError}</InputInvalidMessage>

                                    <a style={{ display: 'block', textAlign: 'right' }}>Forgot password?</a>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button disabled={action === 'sign in' && loading} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }} onClick={() => {
                                                if (ref && ref.current) {
                                                    action = 'sign in';
                                                    ref.current.requestSubmit()
                                                }
                                            }}><p>sign in</p></Button>
                                            <If value={action === 'sign in' && loading}>
                                                <span style={{ position: 'absolute' }}><SmallCircleProgress /></span>

                                            </If>
                                        </span>
                                        <span style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button disabled={action === 'sign up' && loading} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', backgroundColor: "rgba(0,0,255,0.2)" }} onClick={() => {
                                                if (ref && ref.current) {
                                                    action = 'sign up';
                                                    ref.current.requestSubmit()
                                                }
                                            }}><p>sign up</p></Button>
                                            <If value={action === 'sign up' && loading}>
                                                <span style={{ position: 'absolute' }}><SmallCircleProgress /></span>
                                            </If>
                                        </span>
                                    </div>
                                </form>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '30px' }}>
                                    <div style={{ borderTop: '1px solid gray', width: '100%' }}></div>
                                    <p style={{ padding: '10px', backgroundColor: "#fff", position: 'absolute' }}>or</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'stretch', flexDirection: 'column' }}>
                                    <Button style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
                                        supabase.auth.signIn({
                                            provider: 'google'
                                        }, {
                                            redirectTo: '/login'
                                        });
                                    }}>
                                        <span style={{ marginRight: '1rem', padding: 0 }}>
                                            <GoogleIcon size='20px' />
                                        </span>
                                        <span>Continue with Google</span>

                                    </Button>
                                    {/* <Button style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
                                        supabase.auth.signIn({
                                            provider: 'apple'
                                        });
                                    }}>


                                        <span style={{ marginRight: '1rem', padding: 0 }}>
                                            <AppleIcon size='20px' />
                                        </span>

                                        <span>Continue with Apple</span>
                                    </Button> */}
                                </div>
                            </If>
                        </div>
                    </div>


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
        ><GoogleReCaptchaProvider
            reCaptchaKey={RECAPTCHA_KEY}
            // language="[optional_language]"
            scriptProps={{
                async: false, // optional, default to false,
                defer: false, // optional, default to false
                appendTo: 'head', // optional, default to "head", can be "head" or "body",
                nonce: undefined, // optional, default undefined

            }}
        >
                <Login />
            </GoogleReCaptchaProvider>
        </UserBoundary>
    );
}