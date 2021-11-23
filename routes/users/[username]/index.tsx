import usePostFeed from '@hooks/usePostFeed'
import { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { Post, PostWithInfo, User, Blog } from "@data/types"
import Layout from "../../../components/layout"
import Container from "../../../components/container"
import { getRandomSadEmoji } from "../../../components/randomEmoji"
import Button from "../../../components/button"
import { useState } from "react"
import { useEffect } from "react"
import PostFeed from "../../../components/postFeed"
import { supabase } from "@supabase"
import BlogDisplay from "@routes/[blogSlug]/blog"

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


  const userResponse = await supabase.from('users').select('*').eq('username', username);
  if (userResponse.error) throw userResponse.error
  const userData = userResponse.data[0] as User | null;

  const userBlogResponse = await supabase.from('blogs').select('*').eq('blog_slug', `users/${username}`);
  if(userBlogResponse.error) throw userResponse.error;
  const userBlogData = userBlogResponse.data[0] as Blog | null;

  if (!userData || !userBlogData) {
    console.log('check 2')
    return {
      props: {
        user: null,
        blog: null,
        posts: null,
      }
    }
  }


  // find posts made by this user
  const postsResponse = await supabase.from('posts').select('*').eq('user_id', userData.user_id).order('date', {ascending: false}).limit(10);
  if (postsResponse.error) throw postsResponse.error;
  const postsData = postsResponse.data as Post[];
  console.log('how many posts>??/?', postsData.length)


  // add posts 
  const postsWithInfo: PostWithInfo[] = [];
  for (const post of postsData) {
    if (!post.blog) {
      postsWithInfo.push({ post: post, user: null, blog: null })
      continue;
    }


    const blogResponse = await supabase.from('blogs').select('*').eq('blog_slug', post.blog);
    if (blogResponse.error) throw blogResponse.error;
    const blogData = blogResponse.data[0];

    postsWithInfo.push({ post: post, user: null, blog: blogData ? blogData as Blog : null })


  }
  console.log('check 3', postsWithInfo, postsData)

  return {
    props: {
      user: userData,
      blog:userBlogData,
      posts: postsWithInfo.length === 0 ? null : postsWithInfo,
    }
  };
}

interface UsersWrapperProps {
  user: User | null,
  blog: Blog | null,
  posts: PostWithInfo[] | null
}

export default function UsersWrapper({ user, blog, posts }: UsersWrapperProps) {
  const router = useRouter();
  const { username } = router.query;
  const [userIDValue, setUserIDValue] = useState(user ? user.user_id : '');
  const [usernameValue, setUsernameValue] = useState(user ? user.username : '');

  const postFeed = usePostFeed({
    query: supabase.from('posts').select('*').eq('user_id', user ? user.user_id : '').order('date', {ascending: false}),
    showBlog: true,
    loadOnScrollEnd: true,
    initialPostData: posts,
  });

  const reload = postFeed.reload;


  useEffect(() => {
    if (username !== usernameValue && user && typeof (username) === 'string') {
      console.log('change')
      setUsernameValue(username);
      reload();
    }
  }, [user, username, usernameValue, reload]);

  // useEffect(() => {
  //   console.log('new username', usernameValue)
  // }, [usernameValue]);

  if (!username) return null;
  if (typeof (username) !== 'string') return null;


  if (!user || !blog) return (
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
    <BlogDisplay blog={blog}>
      <PostFeed posts={postFeed.posts} loading={postFeed.loading} outOfPosts={postFeed.outOfPosts} disableOutOfPostsMessage />
    </BlogDisplay>
  );

}