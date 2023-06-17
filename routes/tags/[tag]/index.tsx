import TagDisplay from "./tag"
import usePostFeed from "@hooks/usePostFeed"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { Blog, Post, PostWithInfo, User } from "@data/types"
import Layout from "../../../components/layout"
import Container from "../../../components/container"
import { getRandomSadEmoji } from "../../../components/randomEmoji"
import Button from "../../../components/button"
import { useState } from "react"
import { useEffect } from "react"
import PostFeed from "../../../components/postFeed"
import { supabase } from "@supabase"

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('params', context.params);
  const { tag } = context.params ? context.params : { tag: undefined };
  console.log('tag', tag)

  if (!tag || typeof (tag) !== 'string') {
    console.log('check 1')
    return {
      props: {
        tag: null,
        posts: null,
      }
    }
  }


  const postsResponse = await supabase.from('posts').select('*').filter('tags', 'cs', `["${tag}"]`).order('date', {ascending: false}).limit(10);
  if (postsResponse.error) throw postsResponse.error;
  const posts = postsResponse.data as Post[];
  const postsWithData: PostWithInfo[] = [];
  for (const post of posts) {

    const userResponse = await supabase.from('users').select('*').eq('user_id', post.user_id);
    if (userResponse.error) throw userResponse.error;
    const userData = userResponse.data[0] as User;
    
    if(post.blog.includes('users/')) {
      postsWithData.push({ post: post, user: userData, blog: null })
      continue;
    }
    
    const blogResponse = await supabase.from('blogs').select('*').eq('blog_slug', post.blog);
    if(blogResponse.error) throw blogResponse.error;
    const blogData = blogResponse.data[0] as Blog;

    // console.log('user', post.user_id, userData)
    if (blogData && userData) {
      postsWithData.push({ post: post, user: userData, blog: blogData })
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
  console.log('tag', tag, 'initial data', posts)
  const router = useRouter();

  const [tagValue, setTagValue] = useState((tag && typeof (tag) === 'string') ? tag : '');

  
  const postFeed = usePostFeed({
    query: supabase.from('posts').select('*').filter('tags', 'cs', `["${tag}"]`).order('date', {ascending: false}),
    showBlog: true,
    showUser: true,
    loadOnScrollEnd: true,
    initialPostData: posts
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