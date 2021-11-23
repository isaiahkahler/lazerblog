import { PostgrestBuilder, PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "../data/store";
import { Post, PostWithInfo } from '@data/types'


interface UsePostFeedProps {
    query: PostgrestFilterBuilder<any>,
    showUser?: boolean,
    showBlog?: boolean,
    loadOnScrollEnd?: boolean,
    initialPostData?: PostWithInfo[] | null,
    // initialOrderKey?: string | number | null
}

export default function usePostFeed({ query, showUser, showBlog, loadOnScrollEnd, initialPostData }: UsePostFeedProps) {

    const [postsWithData, setPostsWithData] = useState<PostWithInfo[]>(initialPostData ? initialPostData : []);
    const getUser = useStore(state => state.getUser);
    const getBlog = useStore(state => state.getBlog);
    const [lastQuery, setLastQuery] = useState<number | null>(null)
    const [outOfPosts, setOutOfPosts] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    // const queryOffset = initialPostData ? (initialOrderKey ? initialOrderKey : null) : null;

    // get posts from firebase & update state 
    const fetchPosts = useCallback(async () => {
        console.log('fetch posts')
        try {
            console.log('last query?', !!lastQuery, 'initial post data?', !!initialPostData)
            // console.log('query offset?', queryOffset);

            const postsResponse = await (lastQuery ? query.range(lastQuery, lastQuery + 10) : (initialPostData ? query.range(initialPostData.length, initialPostData.length+10) : query.limit(10)));
            if(postsResponse.error) throw postsResponse.error;
            const postsData = postsResponse.data as Post[];

            console.log('run fetch of posts', )

            setLastQuery(last => last ? last + postsData.length : postsData.length);


            if (postsData.length === 0) {
                console.log('set out of posts');
                setOutOfPosts(true);
                return;
            };
            (async () => {
                const _postsWithData: PostWithInfo[] = [];
                for (const post of postsData) {
                    const blog = showBlog ? await getBlog(post.blog) : undefined;
                    const user = showUser ? await getUser(post.user_id) : undefined;
                    _postsWithData.push({ post: post, user: user, blog: blog })
                }
                const newPostsWithData = [...postsWithData, ..._postsWithData];
                if (postsData.length < 10) setOutOfPosts(true);
                console.log('set posts with data')
                setPostsWithData(newPostsWithData);
            })();
        } catch (error) {
            // code review: handle error
            console.error(error);
        }
    }, [getBlog, getUser, initialPostData, lastQuery, postsWithData, query, showBlog, showUser]);

    // if initial posts is less than 10, then out of posts
    useEffect(() => {
        if (initialPostData) {
            if (initialPostData.length < 10)
                setOutOfPosts(true);
        }
    }, [initialPostData]);

    // start loading if there's nothing 
    useEffect(() => {
        if (postsWithData.length === 0){
            console.log('should load')
            setShouldLoad(true);
        }
    }, [postsWithData]);

    // load more posts when triggered
    useEffect(() => {
        if (shouldLoad) {
            console.log('load more', shouldLoad);
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
                        console.log('should load bc scroll end')
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
            setLastQuery(null);
            // code review: which should it be?
            //setOutOfPosts(initialPostData ? initialPostData.length === 0 : false);
            setOutOfPosts(initialPostData ? initialPostData.length < 10 : false);
            setShouldLoad(false);
        }
    };
}