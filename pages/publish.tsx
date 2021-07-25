import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Button from "../components/button"
import { URL } from "../components/constants"
import Container from "../components/container"
import Input from "../components/input"
import Layout from "../components/layout"
import Nav from "../components/nav"
import { useStoreState } from "../components/store"
import { UserBoundary } from "../components/userBoundary"
import firebase from '../firebase'


function Publish() {
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<any>();
    const [blogSlug, setBlogSlug] = useState('');
    const [postSlug, setPostSlug] = useState('');
    const username = useStoreState(state => state.username);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!username) return;
            const userRef = await firebase.firestore().collection('users').doc(username).get();
            const userData = userRef.data();
            if (userRef.exists && userData && userData.draft) {
                setTitle(userData.draft.title);
                setBlogSlug(userData.draft.postTo);
                setPostSlug(userData.draft.slug);
                setContent(userData.draft.content);
            } else {
                // error code review: 
                router.push('/new-post');
            }
        })();
    }, [username]);

    return (
        <div>
            <Nav />
            <Layout>
                <Container>
                    <h1>Finalize your writing.</h1>
                    {title ? <p>{URL}/{blogSlug}/{postSlug}</p> : null}
                    <Input value={description} setValue={setDescription} label='Add a one-line description.' placeholder='optional, but recommended' id='description' />
                    <Input value={tag} setValue={setTag} label='Add tags' placeholder='up to five...' id='tags' />
                    <hr style={{ margin: '2rem 0' }} />
                    <h1>{title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    {/* {content} */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={async () => {
                            try {
                                console.log('title,', !!title, 'content', !!content, 'blog', !!blogSlug, 'post', !!postSlug)
                                if(title && content && blogSlug && postSlug) {
                                    const postRef = await firebase.firestore().collection('blogs').doc(blogSlug).collection('posts').doc(postSlug).get();
                                    if(!postRef.exists) {
                                        await firebase.firestore().collection('blogs').doc(blogSlug).collection('posts').doc(postSlug).set({
                                            date: Date.now(),
                                            description: description,
                                            author: username,
                                            image: '',
                                            tags: !!tag ? tag.split(',').map(str => str.trim()) : [],
                                            title: title,
                                            content: content
                                        });
                                        await firebase.firestore().collection('users').doc(username).update({
                                            draft: firebase.firestore.FieldValue.delete()
                                        });

                                        router.push(`/${blogSlug}/${postSlug}`)
                                    } else {
                                        // code review
                                        console.log('else')
                                    }
                                }
                            } catch (error) {
                                // code review: handle 
                                console.error('firebase error', error)
                            }
                        }}>
                            <h2>publish</h2>
                        </Button>
                    </div>
                </Container>
            </Layout>
        </div>
    );
}

export default function PublishWrapper() {
    const router = useRouter();

    return (<UserBoundary onUserLoaded={(user, username) => {
        if(!user) {
            router.push('/login');
            return;
        }
        if(!username) {
            router.push('/create-user');
        }
    }}><Publish /></UserBoundary>);
}