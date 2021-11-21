import router, { useRouter } from "next/router"
import Container from "../../components/container"
import Layout from "../../components/layout"
import Nav from "../../components/nav"
import Head from 'next/head'
import Button from '../../components/button'
import { UserBoundary } from "../../components/userBoundary"
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './editor.module.css'
import { useEffect, useState } from "react"
import { useStore } from "../../components/store"
import useRedirect from "../../components/useRedirect"
import { useSlugUID } from "../../components/useSlug"
import Input, { InputInvalidMessage, useCustomInputProps } from '../../components/input'
import firebase from '../../firebase'
import { URL } from "../../components/constants"
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import Link from 'next/link'


function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    return (
        <div className={styles.menuBar}>
            <button onClick={() => { editor.chain().focus().toggleBold().run() }}
                className={editor.isActive('bold') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().toggleItalic().run() }}
                className={editor.isActive('italic') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().toggleStrike().run() }}
                className={editor.isActive('strike') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="currentColor" d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43s.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13s-.53.21-.72.36c-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51s.35.36.43.57c.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75s-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58s.37.85.65 1.21c.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21V12z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().toggleCode().run() }}
                className={editor.isActive('code') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" />
                </svg>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch' }} onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run() }}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
                <h2 style={{ margin: 0 }}>Title</h2>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch' }} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                <h3 style={{ margin: 0, fontSize: '14px' }}>Subtitle</h3>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch' }} onClick={() => { editor.chain().focus().setParagraph().run() }}
                className={editor.isActive('paragraph') ? 'is-active' : ''}>
                <p style={{ margin: 0, fontSize: '14px' }}>Paragraph</p>
            </button>
            <button onClick={() => { editor.chain().focus().toggleBulletList().run() }}
                className={editor.isActive('bulletList') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().toggleOrderedList().run() }}
                className={editor.isActive('orderedList') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().toggleCodeBlock().run() }}
                className={editor.isActive('codeBlock') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M11 8H9V10C9 11.1 8.1 12 7 12C8.1 12 9 12.9 9 14V16H11V18H9C7.9 18 7 17.1 7 16V15C7 13.9 6.1 13 5 13V11C6.1 11 7 10.1 7 9V8C7 6.9 7.9 6 9 6H11V8M19 13C17.9 13 17 13.9 17 15V16C17 17.1 16.1 18 15 18H13V16H15V14C15 12.9 15.9 12 17 12C15.9 12 15 11.1 15 10V8H13V6H15C16.1 6 17 6.9 17 8V9C17 10.1 17.9 11 19 11V13Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().toggleBlockquote().run() }}
                className={editor.isActive('blockquote') ? 'is-active' : ''}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V21C8 21.6 8.4 22 9 22H9.5C9.7 22 10 21.9 10.2 21.7L13.9 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M11 13H7V8.8L8.3 6H10.3L8.9 9H11V13M17 13H13V8.8L14.3 6H16.3L14.9 9H17V13Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().setHorizontalRule().run() }}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21 11H3V9H21V11M21 13H3V15H21V13Z" />
                </svg>
            </button>
            <button onClick={() => { editor.chain().focus().undo().run() }}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M13.5 21H6V17H13.5C15.43 17 17 15.43 17 13.5S15.43 10 13.5 10H11V14L4 8L11 2V6H13.5C17.64 6 21 9.36 21 13.5S17.64 21 13.5 21Z" />
                </svg>
            </button>
            <button onClick={() => editor.chain().focus().redo().run()}>
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 13.5C3 9.36 6.36 6 10.5 6H13V2L20 8L13 14V10H10.5C8.57 10 7 11.57 7 13.5S8.57 17 10.5 17H18V21H10.5C6.36 21 3 17.64 3 13.5Z" />
                </svg>
            </button>
        </div>
    );
}

function NewPost() {

    const redirect = useRedirect();
    const [postSlug, setPostSlug] = useSlugUID();
    const [submitted, setSubmitted] = useState(false);
    const userStoreObject = useStore(state => state.user);
    const user = userStoreObject.data;

    // code review: 

    // if there's only one blog, auto select it
    const [postToBlog, setPostToBlog] = useState(user && user.blogs && user.blogs.length === 1 ? user.blogs[0] : undefined)
    const [title, setTitle] = useState('');
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            CodeBlock,
            Placeholder
        ],
    });

    const customInputProps = useCustomInputProps(!submitted || title.length !== 0, styles.titleInput);

    // grab the saved draft, if there is one
    useEffect(() => {
        if (!editor) return;
        if (!user) return;

        (async () => {
            try {
                console.log('grab draft')
                const userRef = await firebase.firestore().collection('users').doc(user.username).get();
                const userData = userRef.data();
                if (userRef.exists && userData) {
                    if (userData.draft && userData.draft.title && userData.draft.content && userData.draft.postTo && userData.draft.slug) {
                        setPostToBlog(userData.draft.postTo);
                        setTitle(userData.draft.title);
                        setPostSlug(userData.draft.slug);
                        editor.commands.setContent(userData.draft.content);
                    } else {
                        console.log('cou;dnt grab')
                    }
                }
            } catch (error) {
                // code review: handle
                console.error(error)
            }
        })();
    }, [editor, user, setPostSlug]);

    
    if(!user) return <p>an error occured</p>;


    const setDraft = async () => {
        try {
            if (!editor) return;
            if(!postToBlog || !title || editor.isEmpty || !postSlug) {
                setSubmitted(true);
                return false;
            }
            await firebase.firestore().collection('users').doc(user.username).set({
                draft: {
                    postTo: postToBlog,
                    title: title,
                    content: editor.getHTML(),
                    slug: postSlug,
                }
            }, { merge: true });
            return true;
        } catch (error) {
            // code review: handle
            console.error(error);
        }
    }


    if (!postToBlog) {
        return (
            <div>
                <Layout>
                    <Container>
                        <h1>Choose a blog to post to.</h1>
                        {user.blogs.map((blog, index) => <a key={index} onClick={() => { setPostToBlog(blog) }}><h1>{blog}</h1></a>)}
                        <hr />
                        <h2>Or <Link href='/create-blog'><a>create a new blog</a></Link></h2>
                    </Container>
                </Layout>
            </div>
        );
    }


    return (
        <div>
            <Layout>
                <Container>

                    <h1>Create a new post at <a onClick={() => { setPostToBlog(undefined) }}>/{postToBlog}</a></h1>

                    <input value={title} onChange={event => {
                        setTitle(event.target.value);
                        setPostSlug(event.target.value);
                    }} placeholder='Title' {...customInputProps} />
                    <InputInvalidMessage isValid={!submitted || title.length !== 0}>Please enter a title.</InputInvalidMessage>

                    <MenuBar editor={editor} />
                    {/* code review: fix this invalid editor thing */}
                    <EditorContent className={(submitted && (editor && editor.isEmpty)) ? styles.invalidEditor : '' } editor={editor} placeholder='Start writing...' />
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                        <Button style={{ marginRight: '2rem' }} onClick={async () => {
                            const success = await setDraft();

                            if(success) {
                                // code review: should this page support ?redirect=[page]
                                // redirect(() => {
                                //     // to do and code review: change this back to / or /home when 
                                //     router.push(`/users/${user.username}`);
                                // });
                            }
                        }}>
                            <h2>save draft</h2>
                        </Button>
                        {editor && !editor.isEmpty && <Button style={{marginRight: '2rem', backgroundColor: "#f14668", color: "#fff"}} onClick={() => {
                            // code review: add an 'are you sure?' popup 
                            editor.commands.clearContent();
                            setTitle('');
                            setPostSlug('');
                            firebase.firestore().collection('users').doc(user.username).update({
                                draft: firebase.firestore.FieldValue.delete()
                            });
                        }}>
                            <h2>delete draft</h2>
                        </Button>}
                        <Button onClick={async () => {
                            const success = await setDraft();
                            if(success){
                                router.push(`/new-post/publish`);
                            }
                        }}>
                            <h2>finalize</h2>
                        </Button>
                    </div>
                </Container>
            </Layout>
        </div>
    );
}

export default function NewPostWrapper() {
    const router = useRouter();

    return (<UserBoundary onUserLoaded={(user) => {
        if (!user.auth) { // nobody is logged in
            console.log('nobody is logged in')
            router.push({ pathname: '/login', query: { redirect: 'new-post' } });
            return;
        }
        if (!user.data) { // user is not registered
            console.log('user is not registered')

            router.push({ pathname: '/create-user', query: { redirect: 'new-post' } });
            return;
        }
        if (!user.data.blogs) {
            console.log('no blog(s) to post to');
            router.push({ pathname: '/create-blog', query: { redirect: 'new-post' } });
            return;
        }
    }}><NewPost /></UserBoundary>);
}