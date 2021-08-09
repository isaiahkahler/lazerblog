import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStoreActions, useStoreState } from "./store";
import { Post, PostWithInfo } from "./types";
import firebase from '../firebase'

interface UsePostFeedProps {
  query?: firebase.firestore.Query<firebase.firestore.DocumentData> | null,
  showUser?: boolean,
  showBlog?: boolean,
  loadOnScrollEnd?: boolean, 
  initialPostData?: PostWithInfo[] | null,
}

export default function usePostFeed({query, showUser, showBlog, loadOnScrollEnd, initialPostData}: UsePostFeedProps) {

  const router = useRouter();
  const user = useStoreState(state => state.user);
  // code review: does this affect performance 
  // const _following = user?.following;
  // const following = useMemo(() => _following ? _following : [], [_following]);
  const [postsWithData, setPostsWithData] = useState<PostWithInfo[]>(initialPostData ? initialPostData : []);
  const getUser = useStoreActions(actions => actions.getUser);
  const getBlog = useStoreActions(actions => actions.getBlog);
  const [lastQuery, setLastQuery] = useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | undefined>()
  const [outOfPosts, setOutOfPosts] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [queryOffset, setQueryOffset] = useState(initialPostData ? initialPostData.length : 0);

  useEffect(() => {
    if(initialPostData) {
      if(initialPostData.length < 10)
        setOutOfPosts(true);
        // setQueryOffset()
    }
  }, [initialPostData])

  const fetchPosts = useCallback(async () => {
    try {
        if(!query) return;
        const postsRef = lastQuery ? await query.startAfter(lastQuery).limit(10).get()
            : await query.startAt(queryOffset).limit(10).get();
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
        console.error(error);
    }
}, [getBlog, getUser, lastQuery, postsWithData, query, showBlog, showUser])

// get the first set of posts
useEffect(() => {
    if (outOfPosts) return;
    if (!shouldLoad) {
        setShouldLoad(true);
        // fetchPosts();
    }
}, [postsWithData, outOfPosts, shouldLoad])

// fetch more posts when the user scrolls to the bottom 
useEffect(() => {
    if(loadOnScrollEnd) {
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
    }

    return () => {}
}, [outOfPosts, shouldLoad, loadOnScrollEnd])

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

  return {
    posts: postsWithData, 
    fetchPosts: fetchPosts,
    loading: shouldLoad,
    outOfPosts: outOfPosts,
    reload: () => {
      setPostsWithData(initialPostData ? initialPostData : []);
      setLastQuery(undefined);
      setOutOfPosts(initialPostData ? initialPostData.length === 0 : false);
      setShouldLoad(false); 
    }
  };
}