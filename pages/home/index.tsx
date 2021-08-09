
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useStoreActions, useStoreState } from "../../components/store"
import { UserBoundary } from "../../components/userBoundary"
import firebase from '../../firebase'
import { Blog, Post, PostWithInfo, User } from '../../components/types'
import Home from './home';



export default function HomeWrapper() {
    const router = useRouter();
    const user = useStoreState(state => state.user);
    // code review: does this affect performance 
    const _following = user?.following;
    const following = useMemo(() => _following ? _following : [], [_following]);
    const [postsWithData, setPostsWithData] = useState<PostWithInfo[]>([]);
    const getUser = useStoreActions(actions => actions.getUser);
    const getBlog = useStoreActions(actions => actions.getBlog);
    const [lastQuery, setLastQuery] = useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | undefined>()
    const [outOfPosts, setOutOfPosts] = useState(false);
    const [firstRequest, setFirstRequest] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);


    const fetchPosts = useCallback(async () => {
        try {
            if (following.length === 0) return;
            const postsRef = lastQuery ? await firebase.firestore().collectionGroup('posts').where('blog', 'in', following).orderBy('date', 'desc').startAfter(lastQuery).limit(10).get()
                : await firebase.firestore().collectionGroup('posts').where('blog', 'in', following).orderBy('date', 'desc').limit(10).get();
            setLastQuery(postsRef.docs[postsRef.docs.length - 1]);
            if (!postsRef.docs || postsRef.docs.length === 0) {
                setOutOfPosts(true);
                return;
            };
            const posts = postsRef.docs.map((doc) => doc.data() as Post);
            (async () => {
                const _postsWithData: PostWithInfo[] = [];
                for (const post of posts) {
                    const blog = await getBlog(post.blog);
                    if (!blog) return;
                    const user = await getUser(post.author);
                    if (!user) return;
                    _postsWithData.push({ post: post, user: user, blog: blog })
                }
                const newPostsWithData = [...postsWithData, ..._postsWithData];
                if (posts.length < 10) setOutOfPosts(true);
                setPostsWithData(newPostsWithData);
            })();
        } catch (error) {
            console.error(error);
        }
    }, [following, getBlog, getUser, lastQuery, postsWithData])

    // get the first set of posts
    useEffect(() => {
        if (outOfPosts) return;
        if (postsWithData.length === 0 && !shouldLoad && following.length !== 0) {
            setShouldLoad(true);
            // fetchPosts();
        }
    }, [postsWithData, outOfPosts, following, shouldLoad])

    // fetch more posts when the user scrolls to the bottom 
    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                // you're at the bottom of the page
                if (!outOfPosts && !shouldLoad) {
                    // setGotUpdate(true);
                    setShouldLoad(true);

                }
            }
        }

        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [outOfPosts, shouldLoad])

    useEffect(() => {
        if(shouldLoad) {
            console.log('load more');
            fetchPosts();
        }
    }, [shouldLoad]);

    useEffect(() => {
        if(postsWithData.length !== 0)
            setShouldLoad(false);
    }, [postsWithData, setShouldLoad])


    return (<UserBoundary onUserLoaded={(userAuth, user) => {
        if (!userAuth) {
            router.push('/login')
            return;
        }
        if (!user) {
            router.push('/create-user')
            return;
        }
    }}><Home posts={postsWithData} outOfPosts={outOfPosts} loading={shouldLoad} /></UserBoundary>);
}