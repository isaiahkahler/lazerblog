import TagDisplay from "./tag"
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
  const { tag } = context.params ? context.params : { tag: undefined };

  if (!tag || typeof (tag) !== 'string') {
    console.log('check 1')
    return {
      props: {
        tag: null,
        posts: null,
      }
    }
  }


  const query = firebase.firestore().collectionGroup('posts').where('tags', 'array-contains', tag).orderBy('date', 'desc');
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
    const userRef = await firebase.firestore().collection('users').doc(post.author).get();
    const userData = userRef.data();
    console.log('user', post.author, userData)
    if (blogRef.exists && blogData && userRef.exists && userData) {
      postsWithData.push({ post: post, user: { username: post.author, ...userData as UserBase}, blog: { slug: post.blog, ...blogData as BlogBase } })
    }
  }
  console.log('check 3')

  return {
    props: {
      tag: tag,
      posts: postsWithData.length === 0 ? null : postsWithData,
    }
  };
}

interface TagWrapperProps {
  tag: string | null,
  posts: PostWithInfo[] | null
}

export default function TagWrapper({ tag, posts }: TagWrapperProps) {
  console.log('tag', tag)
  const router = useRouter();

  const [tagValue, setTagValue] = useState((tag && typeof (tag) === 'string') ? tag : '');


  const postFeed = usePostFeed({
    query: firebase.firestore().collectionGroup('posts').where('author', '==', tag).orderBy('date', 'desc'),
    showBlog: true,
    showUser: true,
    loadOnScrollEnd: true,
    initialPostData: posts,
    initialOrderKey: posts ? posts[posts.length - 1].post.date : null
  });


  useEffect(() => {
    if (tag !== tagValue && typeof (tag) === 'string')
      setTagValue(tag);
  }, [tag, tagValue]);

  useEffect(() => {
    console.log('new tag', tagValue)
    postFeed.reload();
  }, [tagValue]);

  if (!tag) return <p>error</p>;
  if (typeof (tag) !== 'string') return <p>error</p>;

  return (
    <TagDisplay tag={tag}>
      <PostFeed posts={postFeed.posts} loading={postFeed.loading} outOfPosts={postFeed.outOfPosts} disableOutOfPostsMessage />
    </TagDisplay>
  );

}