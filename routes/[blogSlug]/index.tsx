import Layout from '../../components/layout'
import Container from '../../components/container'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Button from '../../components/button'
import { Blog, Post, PostWithInfo } from '@data/types'
import { getRandomSadEmoji } from '../../components/randomEmoji'
import BlogDisplay from './blog'
import usePostFeed from '@hooks/usePostFeed'
import PostFeed from '../../components/postFeed'
import PageNotFound from '../../components/404'
import { supabase } from '@supabase'


export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('params', context.params);
    const { blogSlug } = context.params ? context.params : { blogSlug: undefined };

    if (!blogSlug || typeof (blogSlug) !== 'string') {
        console.log('check 1', blogSlug, typeof(blogSlug))
        return {
            props: {
                blog: null,
                posts: null,
            }
        }
    }

    const blogResponse = await supabase.from('blogs').select('*').eq('blog_slug', blogSlug);
    if(blogResponse.error) throw blogResponse.error;
    const blogData = blogResponse.data[0] as Blog | null;

    if (!blogData) {
        console.log('check 2')
        return {
            props: {
                blog: null,
                posts: null,
            }
        }
    }

    const postsResponse = await supabase.from('posts').select('*').eq('blog', blogSlug).order('date', {ascending: false}).limit(10);
    if(postsResponse.error) throw postsResponse.error;
    const posts = postsResponse.data as Post[];
    const postsWithData: PostWithInfo[] = posts.map(post => {
        return {
            post: post,
            blog: null,
        };
    });
    console.log('check 3')

    return {
        props: {
            blog: blogData as Blog,
            posts: postsWithData.length === 0 ? null : postsWithData,
        }
    };
}


interface BlogWrapperProps {
    blog: Blog | null,
    posts: PostWithInfo[] | null
}

export default function BlogWrapper({blog, posts}: BlogWrapperProps) {
    const router = useRouter();
    const { blogSlug } = router.query;
    const [blogSlugValue, setBlogSlugValue] = useState((blogSlug && typeof (blogSlug) === 'string') ? blogSlug : '');
    const postFeed = usePostFeed({
      query: supabase.from('posts').select('*').eq('blog', blogSlug).order('date', {ascending: false}),
      loadOnScrollEnd: true,
      initialPostData: posts
    });


  useEffect(() => {
    if (blogSlug !== blogSlugValue && blog && typeof (blogSlug) === 'string')
    setBlogSlugValue(blogSlug);
  }, [blog, blogSlug, blogSlugValue]);

  useEffect(() => {
    console.log('new blogSlug', blogSlugValue)
    postFeed.reload();
  }, [blogSlugValue]);

    if (!blog) return (<PageNotFound />);

    return (
    <BlogDisplay blog={blog}>
        <PostFeed posts={postFeed.posts} loading={postFeed.loading} outOfPosts={postFeed.outOfPosts} disableOutOfPostsMessage />
    </BlogDisplay>
    );
}
