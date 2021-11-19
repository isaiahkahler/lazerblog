import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState, forwardRef } from "react";
import firebase from '../firebase'
// import buttonStyle from '../components/button/button.module.css'
import { useStore } from "../components/store";
import { UserBoundary } from "../components/userBoundary";
import useRedirect from "../components/useRedirect";
import { UserBase } from "../components/types";
import { InputButton } from "../components/button";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput, { InputInvalidMessage, InputLabel, useCustomInputProps } from "../components/input";
import CircleProgress from "../components/circleProgress";
import If from '../components/if'

interface FormInputs {
    firstName: string,
    lastName: string,
    username: string,
    bio: string
}

let typingDelayTimeout: NodeJS.Timeout | null = null;

interface CreateUserProps {
    submitHandler: (data: FormInputs) => void
}

function CreateUser({ submitHandler }: CreateUserProps) {
    const user = useStore(state => state.user);

    const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormInputs>({
        defaultValues: {
            firstName: user.auth ? user.auth.displayName?.split(' ')[0] : '',
            lastName: user.auth ? user.auth.displayName?.split(' ')[1] : ''
        }
    });

    const [usernameInput, setUsernameInput] = useState('');

    const [loading, setLoading] = useState(false);


    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        setLoading(true);
        submitHandler(data);
    };

    useEffect(() => {
        console.log('form state change', errors.firstName, errors.lastName, errors.username)
    }, [errors])


    const firstNameRequiredError = errors.firstName?.type === 'required';
    const firstNameMaxLengthError = errors.firstName?.type === 'maxLength';
    const firstNamePatternError = errors.firstName?.type === 'pattern';
    const firstNameError = firstNameRequiredError || firstNameMaxLengthError || firstNamePatternError;

    const lastNameRequiredError = errors.lastName?.type === 'required';
    const lastNameMaxLengthError = errors.lastName?.type === 'maxLength';
    const lastNamePatternError = errors.lastName?.type === 'pattern';
    const lastNameError = lastNameRequiredError || lastNameMaxLengthError || lastNamePatternError;

    const usernameRequiredError = errors.username?.type === 'required';
    const usernameLengthError = errors.username?.type === 'minLength' || errors.username?.type === 'maxLength';
    const usernamePatternError = errors.username?.type === 'pattern';
    const usernameTakenError = errors.username?.type === 'taken';
    const usernameError = usernameRequiredError || usernameLengthError || usernamePatternError || usernameTakenError;
    const usernameErrorWithoutValidate = usernameRequiredError || usernameLengthError || usernamePatternError;

    const bioLengthError = errors.bio?.type === 'maxLength';

    useEffect(() => {
        const _typingDelayTimeout = setTimeout(() => {
            if (usernameInput.length !== 0) {
                trigger('username');
            }
        }, 500);
        return () => {
            clearTimeout(_typingDelayTimeout);
        }
    }, [usernameInput, trigger]);


    return (
        <div>
            <Layout>
                <Container>
                    <h1>Create your profile.</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <InputLabel>First Name</InputLabel>
                        <input {...register('firstName', {
                            required: true,
                            minLength: 1,
                            maxLength: 25,
                            pattern: /^[a-zA-Z .'-]+$/
                        })} id='firstname' {...useCustomInputProps(!firstNameError)} />
                        <InputInvalidMessage isValid={!firstNameRequiredError}>Please enter your first name.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!firstNameMaxLengthError}>Max length is 25.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!firstNamePatternError}>Please enter a valid name without special characters.</InputInvalidMessage>


                        <InputLabel>Last Name</InputLabel>
                        <input {...register('lastName', {
                            required: true,
                            minLength: 1,
                            maxLength: 25,
                            pattern: /^[a-zA-Z .'-]+$/
                        })} id='lastname' {...useCustomInputProps(!lastNameError)} />
                        <InputInvalidMessage isValid={!lastNameRequiredError}>Please enter your last name.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!lastNameMaxLengthError}>Max length is 25.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!lastNamePatternError}>Please enter a valid name without special characters.</InputInvalidMessage>

                        <InputLabel>Username</InputLabel>
                        <input {...register('username', {
                            required: true,
                            minLength: 2,
                            maxLength: 16,
                            pattern: /^[a-zA-Z0-9_-]+$/,
                            onChange: event => setUsernameInput(event.target.value),
                            validate: {
                                taken: async (value) => {
                                    if (typingDelayTimeout) {
                                        clearTimeout(typingDelayTimeout);
                                    }

                                    return new Promise((resolve) => {
                                        typingDelayTimeout = setTimeout(async () => {
                                            try {
                                                if (value && !usernameErrorWithoutValidate) {
                                                    console.log(`checking if username ${value} is taken`);
                                                    const usernameDoc = await firebase.firestore().collection('users').doc(value).get();
                                                    if (usernameDoc.exists) {
                                                        console.log('username taken')
                                                        resolve(false);
                                                    } else {
                                                        console.log('username not taken')
                                                        resolve(true);
                                                    }
                                                } else {
                                                    resolve(true);
                                                }
                                            } catch (error) {
                                                console.error('error checking if username is valid')
                                                console.error(error)
                                                resolve(false);
                                            }

                                        }, 500);


                                    })
                                }
                            }
                        })} id='username' autoComplete='off' {...useCustomInputProps(!usernameError)} />
                        <InputInvalidMessage isValid={!usernameRequiredError}>Please enter a username.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!usernameLengthError && !usernamePatternError}>Username must be 2-16 characters. Letters, numbers, hyphens, and underscores only.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!usernameTakenError}>The username is taken.</InputInvalidMessage>

                        <InputLabel>Bio</InputLabel>
                        <textarea {...register('bio', {
                            maxLength: 200,
                        })} placeholder='optional' id='username' autoComplete='off' rows={3} {...useCustomInputProps(!bioLengthError)} />
                        <InputInvalidMessage isValid={!bioLengthError}>Max length is 200 characters.</InputInvalidMessage>


                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem 0' }}>
                            <InputButton value='continue' disabled={loading} type='submit' />
                            <If value={loading}>
                                <div style={{position: 'absolute'}}>
                                    <CircleProgress />
                                </div>
                            </If>
                        </div>
                    </form>
                </Container>
            </Layout>
        </div>
    );
}


export default function CreateUserWrapper() {
    const router = useRouter();
    const redirect = useRedirect();
    const user = useStore(state => state.user);

    const handleSubmit = (data: FormInputs) => {
        console.log('handleSubmit!!!');

            (async () => {
                try {
                    if (user.auth && data.username) {
                        const usernameDoc = await firebase.firestore().collection('users').doc(data.username).get();
                        if (!usernameDoc.exists) {
                            await firebase.firestore().collection('usernames').doc(user.auth.uid).set({
                                username: data.username
                            });
                            await firebase.firestore().collection('users').doc(data.username).set({
                                firstName: data.firstName,
                                lastName: data.lastName,
                                bio: data.bio,
                                profilePicture: '',
                                bannerImage: '',
                                blogs: [
                                    `users/${data.username}`
                                ],
                                following: []
                            } as UserBase);

                            setTimeout(() => {
                                redirect(() => {
                                    router.push(`/${data.username}`);
                                });
                            }, 1000);
                        }
                    }
                } catch (error) {
                    // code review: handle error
                }
            })();

    }

    return (
        <UserBoundary onUserLoaded={(user) => {
            if (!user.auth) { // nobody is logged in
                router.push('/login');
                return;
            }
            if (!user.data) return; 
            
            router.push(`/users/${user.data.username}`);
        }}>
            <CreateUser submitHandler={handleSubmit} />
        </UserBoundary>
    );
}