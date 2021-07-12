import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Box from "../components/box"
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
    const [backupBlogSlug, setBackupBlogSlug] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [user, userLoading, userError] = useAuthState(firebase.auth());
    const [blogSlugTaken, setBlogSlugTaken] = useState<boolean | undefined>();


    // redirect the user if necessary to avoid nav crashes 
    useEffect(() => {
        (async () => {
            try {
                if (user && !userLoading) {
                    const usernameDoc = await firebase.firestore().collection('usernames').doc(user.uid).get();
                    const usernameData = usernameDoc.data();
                    if (usernameDoc.exists && usernameData) {
                        // user is registered, may have other blogs
                    } else {
                        // user is not registered yet, send to /create-user
                        router.push('/create-user');
                    }
                }
                if (!user && !userLoading) {
                    router.push('/');
                }
            } catch (error) {

            }
        })();
    }, [user, userLoading, userError]);

    // convert the blog name to a URL-friendly slug
    useEffect(() => {
        let str = blogName;
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäãâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        setBlogSlug(str);
    }, [blogName])

    // check if blog slug is taken 
    useEffect(() => {
        (async () => {
            try {
                if (blogSlug.length > 0) {
                    const blogSlugDoc = await firebase.firestore().collection('blogs').doc(blogSlug).get();
                    if (blogSlugDoc.exists) {
                        setBlogSlugTaken(true);
                    } else {
                        setBlogSlugTaken(false);
                    }
                }
            } catch (error) {

            }
        })();
    }, [blogSlug]);

    // if the blog slug is taken, create a backup slug
    useEffect(() => {
        (async () => {
            try {
                if(blogSlug && blogSlugTaken) {
                    // add a number to the blog slug, then check if that is available
                    // if not, increase the number and try again 
                    // if it is available, set it as the backup
                    let found = false;
                    let index = 1;
                    while(!found) {
                        const backupSlugDoc = await firebase.firestore().collection('blogs').doc(blogSlug + index).get();
                        if(backupSlugDoc.exists) {
                            index++;
                        } else {
                            found = true;
                        }
                    }
                    setBackupBlogSlug(blogSlug + index);
                }
            } catch (error) {

            }
        })();
    }, [blogSlug, blogSlugTaken]);

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
                        <Input value={blogName} setValue={setBlogName} id='blogname' label='Blog Name' isValid={!formSubmitted || blogSlug.length !== 0} invalidMessage={"Please enter your blog name."} />
                        {blogSlug && <p>Your blog will appear as https://lazerblog.com/{blogSlugTaken ? backupBlogSlug : blogSlug}</p>}
                        {blogSlugTaken ? <Box style={{backgroundColor: "#f8a0b2", border: '2px solid #cc0f35'}}>The URL for this blog name is taken. To get a matching blog URL, change the blog name.</Box> : undefined}
                        <TextArea value={blogDescription} setValue={setBlogDescription} id='blogdescriiption' label="Blog Description" placeholder="optional" />
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                            <input type="submit" value="continue" className={buttonStyle.button} style={{ fontSize: '1.5em', fontWeight: 'bold', padding: '1rem' }} onClick={(event) => {
                                event.preventDefault();
                                setFormSubmitted(true);

                                (async () => {
                                    try {
                                        if (blogSlug && user) {
                                            const blogURL = blogSlugTaken ? backupBlogSlug : blogSlug;
                                            const blogURLDoc = await firebase.firestore().collection('blogs').doc(blogURL).get();
                                            if(!blogURLDoc.exists) {
                                                await firebase.firestore().collection('blogs').doc(blogURL).set({
                                                    name: blogName,
                                                    author: user.uid,
                                                    blogDescription: blogDescription,
                                                    brandImage: ''
                                                });
                                                router.push('/' + blogURL);
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