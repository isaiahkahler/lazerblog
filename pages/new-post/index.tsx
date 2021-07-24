import { useRouter } from "next/router"
import Container from "../../components/container"
import Layout from "../../components/layout"
import Nav from "../../components/nav"
import { UserBoundary } from "../../components/userBoundary"
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './editor.module.css'
import { useEffect, useState } from "react"
import { useStoreState } from "../../components/store"

function MenuBar({ editor }: { editor: Editor | undefined }) {
    if (!editor) return null;

    return (
        <div>

        </div>
    );
}

function NewPost() {


    const blogs = useStoreState(state => state.blogs);

    useEffect(() => {
        console.log('blogs:', blogs)
    }, [blogs])


    if (!blogs) return <p>something is wrong</p>;

    const [postToBlog, setPostToBlog] = useState(blogs.length > 1 ? undefined : blogs[0])
    const [title, setTitle] = useState('');
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            })
        ],
    })

    if (!postToBlog) {
        return (
            <div>
                <Nav />
                <Layout>
                    <Container>
                        <h1>Choose a blog to post to.</h1>
                        {blogs.map((blog, index) => <a key={index} onClick={() => {setPostToBlog(blog)}}><h1>{blog}</h1></a>)}
                    </Container>
                </Layout>
            </div>
        );
    }

    return (
        <div>
            <Nav />
            <Layout>
                <Container>
                    <h1>Create a new post.</h1>
                    <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} className={styles.titleInput} />
                    {title ? <p>/{postToBlog}/{title}</p> : null}
                    <EditorContent editor={editor} placeholder='Start writing...' />
                </Container>
            </Layout>
        </div>
    );
}

export default function NewPostWrapper() {
    const router = useRouter();

    return (<UserBoundary onUserLoaded={(user, username, blogs) => {
        if (!user) { // nobody is logged in
            router.push({pathname: '/login', query: {redirect: 'new-post'}});
            return;
        }
        if (!username) { // user is not registered
            router.push({pathname: '/create-user', query: {redirect: 'new-post'}});
            return;
        }

        // if (!blogs) {
        //     router.push({pathname: '/create-blog', query: {redirect: 'new-post'}});

        // }
        console.log("WTFF, ", blogs)
        // if (!blogs) return; // this value shouldn't ever be undef
        // if (blogs.length === 0) {
        //     router.push('/create-blog')
        // }
    }}><NewPost /></UserBoundary>);
}