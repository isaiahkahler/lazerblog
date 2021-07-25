import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Input from '../components/input'
import { useEffect, useState } from "react";
import firebase from '../firebase'
import buttonStyle from '../components/button/button.module.css'
import { useStoreActions, useStoreState } from "../components/store";
import { UserBoundary } from "../components/userBoundary";
import useRedirect from "../components/useRedirect";



function CreateUser() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState<boolean | undefined>();
    const [validUsername, setValidUsername] = useState<boolean>(false);

    const user = useStoreState(state => state.user);
    const username = useStoreState(state => state.username);
    const setUsername = useStoreActions(actions => actions.setUsername);
    const blogs = useStoreState(state => state.blogs);
    const redirect = useRedirect();

    // parse first and last name from sign up
    useEffect(() => {
        if(user) {
            if(!firstName && !lastName && user.displayName) {
                setFirstName(user.displayName.split(' ')[0]);
                setLastName(user.displayName.split(' ')[1]);
            }
        }
    }, [user, firstName, lastName]);

    // check if username is taken 
    useEffect(() => {
        (async () => {
            try {
                if(usernameInput && validUsername) {
                    const usernameDoc = await firebase.firestore().collection('users').doc(usernameInput).get();
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
    }, [usernameInput, validUsername]);

    // check if username is valid
    useEffect(() => {
        // only letters, numbers, and underscores
        const valid = new RegExp('^[a-zA-Z0-9_]{2,16}$'); 
        if(valid.test(usernameInput)) {
            setValidUsername(true);
        } else {
            setValidUsername(false);
        }
    }, [usernameInput]);

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
                        <Input value={usernameInput} setValue={setUsernameInput} id='username' label='Username' isValid={!formSubmitted || (!usernameTaken && validUsername)} invalidMessage={usernameInput.length === 0 ? "Please enter a username." : usernameTaken ? "The username already exists." : "Username must be 2-16 characters. Letters, numbers, and underscores only"} />
                        <div style={{display: 'flex', justifyContent: 'center', margin: '1rem 0'}}>
                            <input type="submit" value="continue" className={buttonStyle.button} style={{fontSize: '1.5em', fontWeight: 'bold', padding: '1rem'}} onClick={(event) => {
                                event.preventDefault();
                                setFormSubmitted(true);
                                (async () => {
                                    try { 
                                        if(user && usernameInput && !usernameTaken && validUsername) {
                                            const usernameDoc = await firebase.firestore().collection('users').doc(usernameInput).get();
                                            if(!usernameDoc.exists) {
                                                await firebase.firestore().collection('usernames').doc(user.uid).set({
                                                    username: usernameInput
                                                });
                                                setUsername(usernameInput);
                                                await firebase.firestore().collection('users').doc(usernameInput).set({
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    profilePicture: '',
                                                    blogs: [],
                                                    following: []
                                                });
                                                
                                                redirect(() => {
                                                    router.push('/create-blog');
                                                });
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
    const blogs = useStoreState(state => state.blogs);
    return(
        <UserBoundary onUserLoaded={(user, username) => {
            if(!user) { // nobody is logged in
                router.push('/login');
                return;
            }
            if(!username) return; // user is not registered, stay here
            if(blogs && blogs.length === 0) { // user is registered and needs to create first blog
                router.push('/create-blog')
            }
            // user is registered and has blogs
            router.push(`/users/${username}`);
        }}>
            <CreateUser />
        </UserBoundary>
    );
}