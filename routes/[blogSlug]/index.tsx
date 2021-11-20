import Layout from '../../components/layout'
import Container from '../../components/container'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import firebase from '../../firebase'
import { GetServerSideProps } from 'next'
import Button from '../../components/button'
import { Blog, Post, PostWithInfo, UserBase } from '../../components/types'
import { getRandomSadEmoji } from '../../components/randomEmoji'
import BlogDisplay from './blog'
import usePostFeed from '../../components/usePostFeed'
import PostFeed from '../../components/postFeed'
import PageNotFound from '../../components/404'

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('params', context.params)
  const { blogSlug } = context.params ? context.params : { blogSlug: undefined }

  if (!blogSlug || typeof blogSlug !== 'string') {
    console.log('check 1', blogSlug, typeof blogSlug)
    return {
      props: {
        blog: null,
        posts: null,
      },
    }
  }

  const blogRef = await firebase
    .firestore()
    .collection('blogs')
    .doc(blogSlug)
    .get()
  const blogData = blogRef.data()

  if (!blogRef.exists || !blogData) {
    console.log('check 2')
    return {
      props: {
        blog: null,
        posts: null,
      },
    }
  }

  const postsRef = await firebase
    .firestore()
    .collectionGroup('posts')
    .where('blog', '==', blogSlug)
    .orderBy('date', 'desc')
    .limit(10)
    .get()
  const posts = postsRef.docs.map((doc) => doc.data() as Post)
  const postsWithData: PostWithInfo[] = posts.map((post) => {
    return {
      post: post,
      blog: null,
      user: null,
    }
  })
  console.log('check 3')

  return {
    props: {
      blog: { slug: blogSlug, ...blogData } as Blog,
      posts: postsWithData.length === 0 ? null : postsWithData,
    },
  }
}

interface BlogWrapperProps {
  blog: Blog | null
  posts: PostWithInfo[] | null
}

export default function BlogWrapper({ blog, posts }: BlogWrapperProps) {
  const router = useRouter()
  const { blogSlug } = router.query
  const [blogSlugValue, setBlogSlugValue] = useState(
    blogSlug && typeof blogSlug === 'string' ? blogSlug : '',
  )
  const postFeed = usePostFeed({
    query: firebase
      .firestore()
      .collectionGroup('posts')
      .where(
        'blog',
        '==',
        blogSlug && typeof blogSlug === 'string' ? blogSlug : '',
      )
      .orderBy('date', 'desc'),
    loadOnScrollEnd: true,
    initialPostData: posts,
    initialOrderKey: posts ? posts[posts.length - 1].post.date : null,
  })

  useEffect(() => {
    if (blogSlug !== blogSlugValue && blog && typeof blogSlug === 'string')
      setBlogSlugValue(blogSlug)
  }, [blog, blogSlug, blogSlugValue])

  useEffect(() => {
    console.log('new blogSlug', blogSlugValue)
    postFeed.reload()
  }, [blogSlugValue])

  if (!blog) return <PageNotFound />

  return (
    <BlogDisplay blog={blog}>
      <PostFeed
        posts={postFeed.posts}
        loading={postFeed.loading}
        outOfPosts={postFeed.outOfPosts}
        disableOutOfPostsMessage
      />
    </BlogDisplay>
  )
}
