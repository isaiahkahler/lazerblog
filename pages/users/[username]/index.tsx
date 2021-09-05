import UserDisplay from "./user"
import usePostFeed from "../../../components/usePostFeed"
import firebase from '../../../firebase'
import { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { BlogBase, Post, PostWithInfo, User, UserBase } from "../../../components/types"
import Layout from "../../../components/layout"
import Container from "../../../components/container"
import { getRandomSadEmoji } from "../../../components/randomEmoji"
import Button from "../../../components/button"
import { useState } from "react"
import { useEffect } from "react"
import PostFeed from "../../../components/postFeed"

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('params', context.params);
  const { username } = context.params ? context.params : { username: undefined };

  if (!username || typeof (username) !== 'string') {
    console.log('check 1')
    return {
      props: {
        user: null,
        posts: null,
      }
    }
  }

  const userRef = await firebase.firestore().collection('users').doc(username).get();
  const userData = userRef.data();

  if (!userRef.exists || !userData) {
    console.log('check 2')
    return {
      props: {
        user: null,
        posts: null,
      }
    }
  }


  const query = firebase.firestore().collectionGroup('posts').where('author', '==', username).orderBy('date', 'desc');
  const postsRef = await query.limit(10).get();
  const posts = postsRef.docs.map(doc => doc.data() as Post);
  const postsWithData: PostWithInfo[] = [];
  for (const post of posts) {
    if(post.blog.includes('users/')) {
      postsWithData.push({ post: post, user: null, blog: null })
      continue;
    }
    const blogRef = await firebase.firestore().collection('blogs').doc(post.blog).get();
    const blogData = blogRef.data();
    if (blogRef.exists && blogData) {
      postsWithData.push({ post: post, user: null, blog: { slug: post.blog, ...blogData as BlogBase } })
    }
  }
  console.log('check 3')

  return {
    props: {
      user: { username: username, ...userData },
      posts: postsWithData.length === 0 ? null : postsWithData,
    }
  };
}

interface UsersWrapperProps {
  user: User | null,
  posts: PostWithInfo[] | null
}

export default function UsersWrapper({ user, posts }: UsersWrapperProps) {
  const router = useRouter();
  const { username } = router.query;
  const [usernameValue, setUsernameValue] = useState((username && typeof (username) === 'string') ? username : '');
  const postFeed = usePostFeed({
    query: firebase.firestore().collectionGroup('posts').where('author', '==', usernameValue).orderBy('date', 'desc'),
    showBlog: true,
    loadOnScrollEnd: true,
    initialPostData: posts
  });


  useEffect(() => {
    if (username !== usernameValue && user && typeof (username) === 'string')
      setUsernameValue(username);
  }, [user, username, usernameValue]);

  useEffect(() => {
    console.log('new username', usernameValue)
    postFeed.reload();
  }, [usernameValue, postFeed]);

  if (!username) return null;
  if (typeof (username) !== 'string') return null;


  if (!user) return (
    <div>
      <Layout>
        <Container>
          <h1>{getRandomSadEmoji()} The user does not exist.</h1>
          <p>Was the URL spelled correctly?</p>
          <Button onClick={() => {
            router.back();
          }}>
            <h2>← go back</h2>
          </Button>
        </Container>
      </Layout>
    </div>
  );


  return (
    <UserDisplay user={user}>
      <PostFeed posts={postFeed.posts} loading={postFeed.loading} outOfPosts={postFeed.outOfPosts} disableOutOfPostsMessage />
    </UserDisplay>
  );

}