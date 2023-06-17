import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState, forwardRef } from "react";
// import buttonStyle from '../components/button/button.module.css'
import { useStore } from "../data/store";
import { UserBoundary } from "../components/userBoundary";
import useRedirect from "../hooks/useRedirect";
import { Blog, User } from "@data/types";
import { InputButton } from "../components/button";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput, { InputInvalidMessage, InputLabel, useCustomInputProps } from "../components/input";
import CircleProgress from "../components/circleProgress";
import If from '../components/if'
import { supabase } from "@supabase";

export interface UserFormInputs {
    name: string,
    username: string,
    bio: string
}

let typingDelayTimeout: NodeJS.Timeout | null = null;

interface CreateProfileProps {
    submitHandler: (data: UserFormInputs) => void,
    initialData?: UserFormInputs
}

export function CreateProfile({ submitHandler, initialData }: CreateProfileProps) {
    const user = useStore(state => state.user);

    const { register, handleSubmit, formState: { errors }, trigger } = useForm<UserFormInputs>({
        defaultValues: initialData || undefined
    });

    const [usernameInput, setUsernameInput] = useState('');

    const [loading, setLoading] = useState(false);


    const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
        setLoading(true);
        submitHandler(data);
    };

    // useEffect(() => {
    //     console.log('form state change', errors.name, errors.lastName, errors.username)
    // }, [errors])


    const nameRequiredError = errors.name?.type === 'required';
    const nameMaxLengthError = errors.name?.type === 'maxLength';
    const namePatternError = errors.name?.type === 'pattern';
    const nameError = nameRequiredError || nameMaxLengthError || namePatternError;

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
                    {initialData ? <h1>Edit your profile.</h1> : <h1>Create your profile.</h1>}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <InputLabel>Your Name</InputLabel>
                        <input {...register('name', {
                            required: true,
                            minLength: 1,
                            maxLength: 25,
                            pattern: /^[a-zA-Z .'-]+$/
                        })} id='name' {...useCustomInputProps(!nameError)} />
                        <InputInvalidMessage isValid={!nameRequiredError}>Please enter your name.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!nameMaxLengthError}>Max length is 25.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!namePatternError}>Please enter a valid name without special characters.</InputInvalidMessage>

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
                                                    const { data, error } = await supabase.from('users').select('username').eq('username', value);
                                                    if (error) throw error;
                                                    if (!data) {
                                                        resolve(false);
                                                        return;
                                                    };
                                                    const usernameTaken = data.length !== 0;
                                                    if (usernameTaken) {
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
                                <div style={{ position: 'absolute' }}>
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


export default function CreateProfileWrapper() {
    const router = useRouter();
    const redirect = useRedirect();
    const user = useStore(state => state.user);

    const handleSubmit = (data: UserFormInputs) => {
        console.log('handleSubmit!!!');

        (async () => {
            try {
                if (user.auth && user.auth && data.username) {


                    const userResponse = await supabase.from('users').select('username').eq('username', data.username);
                    if(userResponse.error) throw userResponse.error;
                    if(userResponse && userResponse.data.length !== 0) throw new Error('username has just been taken. choose another.');

                    const newUserData: User = {
                        user_id: user.auth.id,
                        name: data.name,
                        // bio: data.bio,
                        username: data.username,
                        // banner_image: '',
                        profile_picture: ''
                    }

                    const newUserBlog: Blog = {
                        banner_image: '',
                        blog_slug: `users/${data.username}`,
                        description: data.bio,
                        name: data.name,
                        user_id: user.auth.id
                    }

                    const insertResponse = await supabase.from('users').insert([newUserData]);
                    if(insertResponse.error) throw insertResponse.error;
                    const insertBlogResponse = await supabase.from('blogs').insert([newUserBlog]);
                    if(insertBlogResponse.error) throw insertBlogResponse.error;

                    setTimeout(() => {
                        redirect(() => {
                            router.push(`/users/${data.username}`);
                        });
                    }, 1000);
                    
                }
            } catch (error) {
                // code review: handle error
                console.error('error inserting user:', error)
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
            <CreateProfile submitHandler={handleSubmit} />
        </UserBoundary>
    );
}