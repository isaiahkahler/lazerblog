import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Button from '../components/button'
import Input from '../components/input'
import { useEffect, useState } from "react";
import firebase from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth';
import buttonStyle from '../components/button/button.module.css'



export default function CreateUser() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [user, userLoading, userError] = useAuthState(firebase.auth());
    const [usernameTaken, setUsernameTaken] = useState<boolean | undefined>();
    const [validUsername, setValidUsername] = useState<boolean>(false);


    // check that user is not already registered 
    useEffect(() => {
        (async () => {
            try {
                if(user && !userLoading) {
                    const usernameDoc = await firebase.firestore().collection('usernames').doc(user.uid).get();
                    const usernameData = usernameDoc.data();
                    if(usernameDoc.exists && usernameData) {
                        // user is registered, have they created a blog yet? 
                        const userDoc = await firebase.firestore().collection('users').doc(usernameData.username).get();
                        const userData = userDoc.data();
                        if(userDoc.exists && userData && userData.blogs.length > 0) {
                            // user is registered and already has a blog, send to their page
                            router.push(`/user/${username}`);
                        } else {
                            // user is registered but didn't create a blog yet, send to /create-blog
                            router.push('/create-blog')
                        }
                    }
                    // else user is not registered, stay here 
                }
            } catch (error) {

            }
        })();
    }, [user, userLoading, userError]);

    // parse first and last name from sign up
    useEffect(() => {
        if(user && !userLoading) {
            if(!firstName && !lastName && user.displayName) {
                setFirstName(user.displayName.split(' ')[0]);
                setLastName(user.displayName.split(' ')[1]);
            }
        }
    }, [user, userLoading, firstName, lastName]);

    // check if username is taken 
    useEffect(() => {
        (async () => {
            try {
                if(username && validUsername) {
                    const usernameDoc = await firebase.firestore().collection('users').doc(username).get();
                    if(usernameDoc.exists) {
                        setUsernameTaken(true);
                    } else {
                        setUsernameTaken(false);
                    }
                } else {
                    setUsernameTaken(false);
                }
            } catch (error) {

            }
        })();
    }, [username, validUsername]);

    // check if username is valid
    useEffect(() => {
        // only letters, numbers, and underscores
        const valid = new RegExp('^[a-zA-Z0-9_]{2,16}$'); 
        if(valid.test(username)) {
            setValidUsername(true);
        } else {
            setValidUsername(false);
        }
    }, [username]);

    return (
        <div>
            <Head>
                <title>Create Your Profile | Lazer Blog</title>
                <meta name="description" content="Fast and Free Blogging Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Nav />
            <Layout>
                <Container>
                    <h1>Create your profile.</h1>
                    <form>
                        <Input value={firstName} setValue={setFirstName} id='firstname' label='First Name' isValid={!formSubmitted || firstName.length !== 0} invalidMessage="Please enter your first name." />
                        <Input value={lastName} setValue={setLastName} id='lastname' label='Last Name' isValid={!formSubmitted || lastName.length !== 0} invalidMessage="Please enter your last name." />
                        <Input value={username} setValue={setUsername} id='username' label='Username' isValid={!formSubmitted || (!usernameTaken && validUsername)} invalidMessage={username.length === 0 ? "Please enter a username." : usernameTaken ? "The username already exists." : "Username must be 2-16 characters. Letters, numbers, and underscores only"} />
                        <div style={{display: 'flex', justifyContent: 'center', margin: '1rem 0'}}>
                            <input type="submit" value="continue" className={buttonStyle.button} style={{fontSize: '1.5em', fontWeight: 'bold', padding: '1rem'}} onClick={(event) => {
                                event.preventDefault();
                                setFormSubmitted(true);
                                (async () => {
                                    try { 
                                        if(user && username && !usernameTaken && validUsername) {
                                            const usernameDoc = await firebase.firestore().collection('users').doc(username).get();
                                            if(!usernameDoc.exists) {
                                                await firebase.firestore().collection('usernames').doc(user.uid).set({
                                                    username: username
                                                });
                                                await firebase.firestore().collection('users').doc(username).set({
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    profilePicture: '',
                                                    blogs: []
                                                });
                                                router.push('/create-blog')
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