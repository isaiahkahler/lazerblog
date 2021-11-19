import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Button from "../../components/button"
import { URL } from "../../components/constants"
import Container from "../../components/container"
import Input, { InputLabel, useCustomInputProps } from "../../components/input"
import Layout from "../../components/layout"
import Nav from "../../components/nav"
import { useStore } from "../../components/store"
import { UserBoundary } from "../../components/userBoundary"
import firebase from '../../firebase'


function Publish() {
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<any>();
    const [blogSlug, setBlogSlug] = useState('');
    const [postSlug, setPostSlug] = useState('');
    const userStoreObject = useStore(state => state.user);
    const user = userStoreObject.data;
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!user) return;

            if (user.draft) {
                setTitle(user.draft.title);
                setBlogSlug(user.draft.postTo);
                setPostSlug(user.draft.slug);
                setContent(user.draft.content);
            }
        })();
    }, [user]);

    return (
        <div>
            {/* <Nav /> */}
            <Layout>
                <Container>
                    <h1>Finalize your writing.</h1>
                    {title ? <p>{URL}/{blogSlug}/{postSlug}</p> : null}
                    <InputLabel>Add a one-line description.</InputLabel>
                    <input type="text" value={description} onChange={event => setDescription(event.target.value)} placeholder='optional, but recommended' id='description' {...useCustomInputProps()} />

                    <InputLabel>Add tags</InputLabel>
                    <input type="text" value={tag} onChange={event => setTag(event.target.value)} placeholder='up to five tags, separated by commas...' id='tags' {...useCustomInputProps()} />

                    <hr style={{ margin: '2rem 0' }} />
                    <h1>{title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    {/* {content} */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={async () => {
                            try {
                                console.log('title,', !!title, 'content', !!content, 'blog', !!blogSlug, 'post', !!postSlug)
                                if (title && content && blogSlug && postSlug && user) {

                                    const query = blogSlug.includes('users/') ? firebase.firestore().doc(blogSlug).collection('posts').doc(postSlug) : firebase.firestore().collection('blogs').doc(blogSlug).collection('posts').doc(postSlug);
                                    const postRef = await query.get();
                                    if (!postRef.exists) {
                                        await query.set({
                                            slug: postSlug,
                                            title: title,
                                            description: description,
                                            date: Date.now(),
                                            content: content,
                                            image: '',
                                            tags: !!tag ? tag.split(',').map(str => {
                                                let newStr = str.trim()
                                                var from = "àáäãâèéëêìíïîòóöôùúüûñç·/_,:;";
                                                var to = "aaaaaeeeeiiiioooouuuunc------";
                                                for (var i = 0, l = from.length; i < l; i++) {
                                                    newStr = newStr.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                                                }

                                                newStr = newStr.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                                                    .replace(/\s+/g, '-') // collapse whitespace and replace by -
                                                    .replace(/-+/g, '-'); // collapse dashes
                                                return newStr;
                                            }).filter(str => !!str) : [],
                                            author: user.username,
                                            blog: blogSlug,
                                        });
                                        await firebase.firestore().collection('users').doc(user.username).update({
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

    return (<UserBoundary onUserLoaded={(user) => {
        if (!user.data) {
            router.push('/login');
            return;
        }
        if (!user.data.username) {
            router.push('/create-user');
        }
    }}><Publish /></UserBoundary>);
}