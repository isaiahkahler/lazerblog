import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import { TextArea } from "../components/input"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Input from '../components/input'
import { useEffect, useState } from "react";
import firebase from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth';
import buttonStyle from '../components/button/button.module.css'

export default function CreateBlog() {
    const router = useRouter();
    const [blogName, setBlogName] = useState('');
    const [blogSlug, setBlogSlug] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [user, userLoading, userError] = useAuthState(firebase.auth());
    const [blogNameTaken, setBlogNameTaken] = useState<boolean | undefined>();

    // redirect the user if necessary to avoid nav crashes 
    useEffect(() => {
        (async () => {
            try {
                if(user && !userLoading) {
                    const usernameDoc = await firebase.firestore().collection('usernames').doc(user.uid).get();
                    const usernameExists = usernameDoc.exists;
                    const username = usernameDoc.get('username');
                    if(usernameExists && username) {
                        // user is registered, may have other blogs
                    } else {
                        // user is not registered yet, send to /create-user
                        router.push('/create-user');
                    }
                } 
                if(!user && !userLoading) {
                    router.push('/');
                }
            } catch(error) {

            }
        })();
    }, [user, userLoading, userError]); 

    // check if blog name is taken 
    useEffect(() => {
        (async () => {
            try {
                if(blogName.length > 0) {
                    const blogNameDoc = await firebase.firestore().collection('blogs').doc(blogSlug).get();
                    if(blogNameDoc.exists) {
                        setBlogNameTaken(true);
                    } else {
                        setBlogNameTaken(false);
                    }
                }
            } catch (error) {

            }
        })();
    }, [blogName]);

    // convert the blog name to a URL-friendly slug
    useEffect(() => {
        let str = blogName;
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "àáäãâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
    
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    
        setBlogSlug(str);
    }, [blogName])

    return (
        <div>
            <Head>
                <title>Create Your Blog | Lazer Blog</title>
                <meta name="description" content="Fast and Free Blogging Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Nav />
            <Layout>
                <Container>
                    <h1>Create your new blog.</h1>
                    <form>
                        <Input value={blogName} setValue={setBlogName} id='blogname' label='Blog Name' isValid={!formSubmitted || (blogName.length !== 0 && !blogNameTaken)} invalidMessage={blogName.length === 0 ? "Please enter your blog name." : "The blog name is already taken."} />
                        {blogSlug && <p>Your blog will appear as https://lazerblog.com/{blogSlug}</p>}
                        <TextArea value={blogDescription} setValue={setBlogDescription} id='blogdescriiption' label="Blog Description" placeholder="optional" />
                        <div style={{display: 'flex', justifyContent: 'center', margin: '1rem 0'}}>
                            <input type="submit" value="continue" className={buttonStyle.button} style={{fontSize: '1.5em', fontWeight: 'bold', padding: '1rem'}} onClick={(event) => {
                                event.preventDefault();
                                setFormSubmitted(true);

                                (async () => {
                                    try {
                                        if(blogName && user){
                                            const blogNameDoc = await firebase.firestore().collection('blogs').doc(blogName).get();
                                            // if the blog name isn't taken
                                            if(!blogNameDoc.exists) {
                                                // create blog in blogs collection
                                                firebase.firestore().collection('blogs').doc(blogName).set({
                                                    author: user.uid,
                                                    blogDescription: blogDescription,
                                                    brandImage: '',
                                                });
                                                // add blog to user's profile
                                                const username = await (await firebase.firestore().collection('usernames').doc(user.uid).get()).data();
                                                if(username) {                                                    
                                                    const userDoc = await (await firebase.firestore().collection('users').doc(username.username).get()).data();
                                                    if(userDoc) {
                                                        userDoc.blogs.push(blogName);
                                                    }
                                                }
                                                firebase.firestore().collection('users')
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