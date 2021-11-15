import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Box from "../components/box"
import { TextArea } from "../components/input"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Input from '../components/input'
import { useEffect, useState } from "react";
import firebase from '../firebase'
import buttonStyle from '../components/button/button.module.css'
import { useStore } from "../components/store"
import { UserBoundary } from "../components/userBoundary"
import useRedirect from "../components/useRedirect"
import { URL } from "../components/constants"
import useSlug, { useBackupSlug } from "../components/useSlug"

function CreateBlog() {
    const router = useRouter();
    const [blogName, setBlogName] = useState('');
    const [blogSlug, setBlogSlug] = useSlug();
    const [backupBlogSlug, blogSlugTaken] = useBackupSlug(blogSlug, async (newSlug) => {
        // code review: add wait time before searching, this will query firestore every key stroke
        const blogSlugDoc = await firebase.firestore().collection('blogs').doc(newSlug).get();
        return blogSlugDoc.exists;
    });
    const [blogDescription, setBlogDescription] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const userAuth = useStore(state => state.userAuth);
    const user = useStore(state => state.user);
    const redirect = useRedirect();

    return (
        <div>
            <Layout>
                <Container>
                    <h1>Create your new blog.</h1>
                    <form>
                        <Input value={blogName} setValue={value => {setBlogName(value); setBlogSlug(value)}} id='blogname' label='Blog Name' isValid={!formSubmitted || blogSlug.length !== 0} invalidMessage={"Please enter your blog name."} />
                        {blogSlug && <p>Your blog will appear as {URL}/{blogSlugTaken ? backupBlogSlug : blogSlug}</p>}
                        {blogSlugTaken ? <Box style={{backgroundColor: "#f8a0b2", border: '2px solid #cc0f35'}}>The URL for this blog name is taken. To get a matching blog URL, change the blog name.</Box> : undefined}
                        <TextArea value={blogDescription} setValue={setBlogDescription} id='blogdescriiption' label="Blog Description" placeholder="optional" />
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                            <input type="submit" value="continue" className={buttonStyle.button} style={{ fontSize: '1.5em', fontWeight: 'bold', padding: '1rem' }} onClick={(event) => {
                                event.preventDefault();
                                setFormSubmitted(true);

                                (async () => {
                                    try {
                                        if (blogSlug && userAuth && user) {
                                            const blogURL = blogSlugTaken ? backupBlogSlug : blogSlug;
                                            const blogURLDoc = await firebase.firestore().collection('blogs').doc(blogURL).get();
                                            if(!blogURLDoc.exists) {
                                                // add blog to 'blogs'
                                                await firebase.firestore().collection('blogs').doc(blogURL).set({
                                                    name: blogName,
                                                    author: user.username,
                                                    blogDescription: blogDescription,
                                                    brandImage: ''
                                                });
                                                // add blog to user     
                                                await firebase.firestore().collection('users').doc(user.username).set({
                                                    blogs: user.blogs ? [...user.blogs, blogSlug] : [blogSlug]
                                                }, {merge: true});

                                                // redirects if URL has ?redirect=[new-route]
                                                // else goes to /[blog]
                                                redirect(() => {
                                                    router.push('/' + blogURL);
                                                })
                                            }
                                        }
                                    } catch (error) {
                                        // code review: handle
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


export default function BlogWrapper() {
    const router = useRouter();
    return (
        <UserBoundary onUserLoaded={(user, username) => {
            if(user && username) return; // logged in and registered
            if(!user) { // needs to log in
                console.log('no user')
                router.push('/login')
                return;
            }
            if(!username) { // needs to register
                router.push('/create-user');
                return; 
            }
        }}>
            <CreateBlog/>
        </UserBoundary>
    );
}