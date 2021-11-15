import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Input from '../components/input'
import { useEffect, useState } from "react";
import firebase from '../firebase'
// import buttonStyle from '../components/button/button.module.css'
import { useStore } from "../components/store";
import { UserBoundary } from "../components/userBoundary";
import useRedirect from "../components/useRedirect";
import { UserBase } from "../components/types";
import {InputButton} from "../components/button";



function CreateUser() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState<boolean | undefined>();
    const [validUsername, setValidUsername] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);

    const userAuth = useStore(state => state.userAuth);
    const user = useStore(state => state.user);
    const redirect = useRedirect();

    // parse first and last name from sign up
    useEffect(() => {
        if (userAuth) {
            if (!firstName && !lastName && userAuth.displayName) {
                setFirstName(userAuth.displayName.split(' ')[0]);
                setLastName(userAuth.displayName.split(' ')[1]);
            }
        }
    }, [userAuth, firstName, lastName]);


    // check if username is valid
    useEffect(() => {
        // only letters, numbers, and underscores
        const valid = new RegExp('^[a-zA-Z0-9_-]{2,16}$');
        if (valid.test(usernameInput)) {
            setValidUsername(true);
        } else {
            setValidUsername(false);
        }
    }, [usernameInput]);


    // check if username is taken after the user stops typing
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            try {
                //code review: strip characters that are not allowed (maybe make input controlled this way)
                if (usernameInput && validUsername) {
                    console.log(`checking if username ${usernameInput} is taken`);
                    const usernameDoc = await firebase.firestore().collection('users').doc(usernameInput).get();
                    if (usernameDoc.exists) {
                        console.log('username taken')
                        setUsernameTaken(true);
                    } else {
                        console.log('username not taken')
                        setUsernameTaken(false);
                    }
                } else {
                    setUsernameTaken(false);
                }
            } catch (error) {
                // code review: handle
                console.error('error checking if username is valid')
                console.error(error)
            }

        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [usernameInput, validUsername, setUsernameTaken]);



    return (
        <div>
            <Layout>
                <Container>
                    <h1>Create your profile.</h1>
                    <form>
                        <Input value={firstName} setValue={setFirstName} id='firstname' label='First Name' isValid={!formSubmitted || firstName.length !== 0} invalidMessage="Please enter your first name." />
                        <Input value={lastName} setValue={setLastName} id='lastname' label='Last Name' isValid={!formSubmitted || lastName.length !== 0} invalidMessage="Please enter your last name." />
                        <Input value={usernameInput} setValue={setUsernameInput} id='username' label='Username' autoComplete='off' isValid={!usernameTaken && (!formSubmitted || (!usernameTaken && validUsername))} invalidMessage={usernameInput.length === 0 ? "Please enter a username." : usernameTaken ? "The username already exists." : "Username must be 2-16 characters. Letters, numbers, hyphens, and underscores only"} />
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                            <InputButton value='continue' style={{position: 'absolute'}} disabled={loading} type='submit' onClick={(event) => {
                                event.preventDefault();
                                setFormSubmitted(true);

                                (async () => {
                                    try { 
                                        if(userAuth && usernameInput && !usernameTaken && validUsername) {
                                            setLoading(true);
                                            const usernameDoc = await firebase.firestore().collection('users').doc(usernameInput).get();
                                            if(!usernameDoc.exists) {
                                                await firebase.firestore().collection('usernames').doc(userAuth.uid).set({
                                                    username: usernameInput
                                                });
                                                await firebase.firestore().collection('users').doc(usernameInput).set({
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    profilePicture: '',
                                                    bannerImage: '',
                                                    blogs: [],
                                                    following: []
                                                } as UserBase);
                                                
                                                setTimeout(() => {
                                                    redirect(() => {
                                                        router.push('/create-blog');
                                                    });
                                                }, 1000);
                                            }
                                        }
                                    } catch (error) {

                                    }
                                })();


                            }} />
                        </div>
                    </form>
                </Container>
            </Layout>
        </div>
    );
}


export default function CreateUserWrapper() {
    const router = useRouter();
    return (
        <UserBoundary onUserLoaded={(userAuth, user) => {
            if (!userAuth) { // nobody is logged in
                router.push('/login');
                return;
            }
            if (!user) return; // user is not registered, stay here
            if (user.blogs && user.blogs.length === 0) { // user is registered and needs to create first blog
                router.push('/create-blog')
            }
            // user is registered and has blogs
            router.push(`/users/${user.username}`);
        }}>
            <CreateUser />
        </UserBoundary>
    );
}