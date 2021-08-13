import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStoreActions, useStoreState } from "./store";
import { Post, PostWithInfo } from "./types";
import firebase from '../firebase'

interface UsePostFeedProps {
    query: firebase.firestore.Query<firebase.firestore.DocumentData>,
    showUser?: boolean,
    showBlog?: boolean,
    loadOnScrollEnd?: boolean,
    initialPostData?: PostWithInfo[] | null,
}

export default function usePostFeed({ query, showUser, showBlog, loadOnScrollEnd, initialPostData }: UsePostFeedProps) {

    const [postsWithData, setPostsWithData] = useState<PostWithInfo[]>(initialPostData ? initialPostData : []);
    const getUser = useStoreActions(actions => actions.getUser);
    const getBlog = useStoreActions(actions => actions.getBlog);
    const [lastQuery, setLastQuery] = useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | undefined>()
    const [outOfPosts, setOutOfPosts] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const queryOffset = initialPostData ? initialPostData.length : undefined;

    // get posts from firebase & update state 
    const fetchPosts = useCallback(async () => {
        try {
            const postsRef = lastQuery ? await query.startAfter(lastQuery).limit(10).get()
                : queryOffset ? await query.startAt(queryOffset).limit(10).get() 
                : await query.limit(10).get();
            console.log('run fetch of posts')
            setLastQuery(postsRef.docs[postsRef.docs.length - 1]);
            if (!postsRef.docs || postsRef.docs.length === 0) {
                setOutOfPosts(true);
                return;
            };
            const posts = postsRef.docs.map((doc) => doc.data() as Post);
            (async () => {
                const _postsWithData: PostWithInfo[] = [];
                for (const post of posts) {
                    const blog = showBlog ? await getBlog(post.blog) : undefined;
                    const user = showUser ? await getUser(post.author) : undefined;
                    _postsWithData.push({ post: post, user: user, blog: blog })
                }
                const newPostsWithData = [...postsWithData, ..._postsWithData];
                if (posts.length < 10) setOutOfPosts(true);
                setPostsWithData(newPostsWithData);
            })();
        } catch (error) {
            // code review: handle error
            console.error(error);
        }
    }, [getBlog, getUser, lastQuery, postsWithData, query, queryOffset, showBlog, showUser]);

    // if initial posts is less than 10, then out of posts
    useEffect(() => {
        if (initialPostData) {
            if (initialPostData.length < 10)
                setOutOfPosts(true);
        }
    }, [initialPostData]);

    // start loading if there's nothing 
    useEffect(() => {
        if (postsWithData.length === 0)
            setShouldLoad(true);
    }, [postsWithData]);
   
    // load more posts when triggered
    useEffect(() => {
        if (shouldLoad) {
            console.log('load more');
            fetchPosts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldLoad]);

     // after posts are updated, reset shouldLoad
     useEffect(() => {
        if (outOfPosts) {
            setShouldLoad(false);
            return;
        }
        if (shouldLoad)
            setShouldLoad(false);
        // code review: this effect relies on shouldLoad, but including it in 
        // the deps array will make fetchPosts run too many times when scrolling?
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postsWithData, outOfPosts]);

    // fetch more posts when the user scrolls to the bottom 
    useEffect(() => {
        if (loadOnScrollEnd) {
            const handleScroll = () => {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    // you're at the bottom of the page
                    if (!outOfPosts && !shouldLoad) {
                        // setGotUpdate(true);
                        setShouldLoad(true);
                    }
                }
            }

            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        }

        return () => { }
    }, [outOfPosts, shouldLoad, loadOnScrollEnd]);

    return {
        posts: postsWithData,
        fetchPosts: fetchPosts,
        loading: shouldLoad,
        outOfPosts: outOfPosts,
        reload: () => {
            setPostsWithData(initialPostData ? initialPostData : []);
            setLastQuery(undefined);
            // code review: which should it be?
            //setOutOfPosts(initialPostData ? initialPostData.length === 0 : false);
            setOutOfPosts(initialPostData ? initialPostData.length < 10 : false);
            setShouldLoad(false);
        }
    };
}