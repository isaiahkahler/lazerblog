import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Button from "../../components/button"
import { URL } from "../../components/constants"
import Container from "../../components/container"
import Input, { InputLabel, useCustomInputProps } from "../../components/input"
import Layout from "../../components/layout"
import Nav from "../../components/nav"
import { useStore } from "../../data/store"
import { UserBoundary } from "../../components/userBoundary"
import { supabase } from "@supabase"
import { Draft, Post } from "@data/types"
import If from '@components/if'
import CircleProgress from "@components/circleProgress"


function Publish() {
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<any>();
    const [blogSlug, setBlogSlug] = useState('');
    const [postSlug, setPostSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const userStoreObject = useStore(state => state.user);
    const user = userStoreObject.data;
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!user) return;

            const draftResponse = await supabase.from('drafts').select('*').eq('user_id', user.user_id);
            if(draftResponse.error) throw draftResponse.error;
            const draftData = draftResponse.data[0] as Draft;

            if (draftData) {
                setTitle(draftData.title);
                setBlogSlug(draftData.post_to);
                setPostSlug(draftData.slug);
                setContent(draftData.content);
            }
        })();
    }, [user]);

    const handleClick = async () => {
        try {
            if (title && content && blogSlug && postSlug && user) {
                setLoading(true);
                const tags = !!tag ? tag.split(',').map(str => {
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
                }).filter(str => !!str) : [];

                const postResponse = await supabase.from('posts').insert([{
                    user_id: user.user_id,
                    post_slug: postSlug,
                    title: title,
                    description: description,
                    date: Date.now(),
                    content: content,
                    image: '',
                    tags: tags,
                    blog: blogSlug
                } as Post]);
                if(postResponse.error) throw postResponse.error;

                const deleteDraftResponse = await supabase.from('drafts').delete().eq('user_id', user.user_id);
                if(deleteDraftResponse.error) throw deleteDraftResponse.error;

                router.push(`/${blogSlug}/${postSlug}`)
            }
        } catch (error) {
            // code review: handle 
            console.error('firebase error', error)
        }
    }

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
                        <Button onClick={handleClick}>
                            <h2>publish</h2>
                        </Button>
                        <If value={loading}>
                            <span style={{position: 'absolute'}}>
                                <CircleProgress />
                            </span>
                        </If>
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
            router.push('/create-profile');
        }
    }}><Publish /></UserBoundary>);
}