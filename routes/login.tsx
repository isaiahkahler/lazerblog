import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { useRouter } from 'next/router'
import { supabase } from '@supabase'
import { useRef, useState } from 'react'
import { useStore } from '../data/store'
import { UserBoundary } from '../components/userBoundary'
import useRedirect from '../hooks/useRedirect'
import If from '@components/if'
import { InputInvalidMessage, InputLabel, useCustomInputProps } from '@components/input'
import { useForm } from 'react-hook-form'
import Button, { useCustomButtonProps } from '@components/button'
import GoogleIcon from '@components/icons/googleIcon'
import { SmallCircleProgress } from '@components/circleProgress'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

interface SignInUpFormInputs {
    usernameOrEmail: string,
    password: string,
    isSignIn: boolean
}

interface ForgotPasswordFormInputs {
    email: string
}


function Login() {

    const { register, formState: { errors }, handleSubmit, setValue, getValues } = useForm<SignInUpFormInputs>();
    const forgotPasswordForm = useForm<ForgotPasswordFormInputs>();

    const { executeRecaptcha } = useGoogleReCaptcha();

    const [formState, setFormState] = useState<'sign in' | 'reset password' | 'confirmation'>('sign in');

    const usernameEmailRequiredError = errors.usernameOrEmail?.type === 'required';
    const usernameEmailLengthError = errors.usernameOrEmail?.type === 'minLength';
    const usernameEmailPatternError = errors.usernameOrEmail?.type === 'pattern';
    const usernameEmailError = usernameEmailRequiredError || usernameEmailLengthError || usernameEmailPatternError;

    const passwordRequiredError = errors.password?.type === 'required';
    const passwordLengthError = errors.password?.type === 'minLength';
    const passwordPatternError = errors.password?.type === 'pattern';
    const passwordError = passwordRequiredError || passwordLengthError || passwordPatternError;

    const resetPasswordEmailRequiredError = forgotPasswordForm.formState.errors.email?.type === 'required';
    const resetPasswordEmailPatternError = forgotPasswordForm.formState.errors.email?.type === 'pattern';
    const resetPasswordEmailError = resetPasswordEmailRequiredError || resetPasswordEmailPatternError;

    const [loading, setLoading] = useState(false);

    const [passwordResetState, setPasswordResetState] = useState<'loading' | 'sent' | null>(null);

    const [loginError, setLoginError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const signInUpSubmitHandler = (data: SignInUpFormInputs) => {

        // console.log('is sign in?', data.isSignIn);
        // return;

        (async () => {
            try {
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
                    setLoading(false);
                    return;
                }

                setLoading(true);
                if (data.isSignIn) {
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
                        setLoading(false);
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
                        setLoading(false);
                        return;
                    };
                    setFormState('confirmation');
                }

                // setLoading(false);

                // activate the password form 
            } catch (error) {
                console.error(error)
                setLoading(false);
            }

        })();
    };

    const passwordResetHandler = (data: ForgotPasswordFormInputs) => {
        (async () => {
            try {
                if (!executeRecaptcha) return;
                if (passwordResetState === 'sent') return;
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

                setPasswordResetState('loading');

                await supabase.auth.api.resetPasswordForEmail(data.email, {
                    redirectTo: '/login'
                });

                setPasswordResetState('sent')


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

                    <h1 style={{ textAlign: 'center' }}>Sign in to continue to reauthor.</h1>


                    <div style={{ justifyContent: 'center', display: 'flex' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'min(90vw, 400px)', backgroundColor: '#fff', padding: '0 1rem 0.5rem 1rem', borderRadius: '7.5px', boxShadow: '0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)' }}>

                            <If value={formState === 'confirmation'}>
                                <h2>Almost there!</h2>
                                <p>check your email to complete sign up.</p>
                            </If>

                            <If value={formState === 'reset password'}>
                                <h2 style={{ marginBottom: 0 }}>reset password</h2>
                                <form onSubmit={forgotPasswordForm.handleSubmit(passwordResetHandler)} ref={formRef}>
                                    <InputLabel>Email</InputLabel>
                                    <input type='text' id='email' {...forgotPasswordForm.register('email', {
                                        required: true,
                                        pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    })} {...useCustomInputProps(!resetPasswordEmailError)} />
                                    <InputInvalidMessage isValid={!(resetPasswordEmailRequiredError)}>Please enter an email</InputInvalidMessage>
                                    <InputInvalidMessage isValid={!(resetPasswordEmailPatternError)}>Email is invalid</InputInvalidMessage>


                                    <If value={passwordResetState === 'sent'}>
                                        <p>If that account exists, an email was sent with password reset instructions.</p>
                                    </If>

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <a {...useCustomButtonProps()} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }} onClick={() => setFormState('sign in')}><p>cancel</p></a>
                                        </span>
                                        <span style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <input disabled={passwordResetState === 'sent'} {...useCustomButtonProps()} type='submit' style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', backgroundColor: passwordResetState === 'sent' ? "rgba(0,255,0,0.4)" : "rgba(0,0,255,0.2)", transition: '500ms' }} value={passwordResetState === 'sent' ? 'sent  ✅' : 'send reset link'} />
                                            <If value={passwordResetState === 'loading'}>
                                                <span style={{ position: 'absolute' }}><SmallCircleProgress /></span>
                                            </If>
                                        </span>
                                    </div>
                                </form>
                            </If>

                            <If value={formState === 'sign in'}>

                                <form onSubmit={handleSubmit(signInUpSubmitHandler)} ref={formRef}>
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

                                    <a style={{ display: 'block', textAlign: 'right' }} onClick={() => setFormState('reset password')}>Forgot password?</a>
                                    
                                    {/* invisible checkbox for isSignIn value */}
                                    <input type='checkbox' {...register('isSignIn')} style={{display: 'none'}} />
                                    
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Button disabled={action === 'sign in' && loading} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }} onClick={() => {
                                                if (formRef && formRef.current) {
                                                    action = 'sign in';
                                                    formRef.current.submit()
                                                }
                                            }}><p>sign in</p></Button> */}

                                            <input type='submit' disabled={getValues('isSignIn') && loading} style={{fontWeight: 'bold', width: '100%'}} value="sign in" {...useCustomButtonProps()} onClick={() => {setValue('isSignIn', true)}} />
                                            <If value={getValues('isSignIn') && loading}>
                                                <span style={{ position: 'absolute' }}><SmallCircleProgress /></span>
                                            </If>
                                        </span>
                                        <span style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Button disabled={action === 'sign up' && loading} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', backgroundColor: "rgba(0,0,255,0.2)" }} onClick={() => {
                                                if (formRef && formRef.current) {
                                                    action = 'sign up';
                                                    formRef.current.submit()
                                                }
                                            }}><p>sign up</p></Button> */}
                                            <input type='submit' value="sign up" disabled={!getValues('isSignIn') && loading} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', backgroundColor: "rgba(0,0,255,0.2)" }}  {...useCustomButtonProps()} onClick={() => {setValue('isSignIn', false)}} />
                                            <If value={!getValues('isSignIn') && loading}>
                                                <span style={{ position: 'absolute' }}><SmallCircleProgress /></span>
                                            </If>
                                        </span>
                                    </div>
                                </form>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '30px' }}>
                                    <div style={{ borderTop: '1px solid gray', width: '100%' }}></div>
                                    <p style={{ padding: '10px', backgroundColor: "#fff", position: 'absolute', margin: 0 }}>or</p>
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
                if (!user.auth) return; // stay to log in
                if (!user.data) { // needs to register
                    router.push('/create-profile');
                    return;
                }

                const userData = user.data;

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