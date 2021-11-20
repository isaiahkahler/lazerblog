import { Blog, User } from '../../components/types'
import styles from './blog.module.css'
import Link from 'next/link'
import { useStore } from '../../components/store'
import { TransparentButton } from '../../components/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import Container from '../../components/container'
import If from '../../components/if'

interface BlogProps {
  blog: Blog
  children?: React.ReactNode
}

export default function BlogDisplay({ blog, children }: BlogProps) {
  const router = useRouter()
  const getUser = useStore((state) => state.getUser)
  const user = useStore((state) => state.user)
  const currentUser = user.data
  const doFollow = useStore((state) => state.doFollow)
  const doUnfollow = useStore((state) => state.doUnfollow)

  const [blogAuthor, setBlogAuthor] = useState<User>({
    firstName: '',
    lastName: '',
    bio: '',
    bannerImage: '',
    blogs: [],
    following: [],
    profilePicture: '',
    username: '',
  } as User)

  useEffect(() => {
    ;(async () => {
      if (blogAuthor.username !== '') return
      const _user = await getUser(blog.author)
      if (!_user) {
        // code review:
        throw new Error('oh the user ? what')
      }
      setBlogAuthor(_user)
    })()
  }, [getUser, blog, blogAuthor])

  return (
    <div>
      <div
        className={styles.banner}
        style={{
          backgroundColor: blog.brandImage
            ? 'rgba(255, 255, 255, 0.3)'
            : '#eee',
          backgroundImage: blog.brandImage ? `url(${blog.brandImage})` : 'none',
        }}
      >
        <h1>{blog.name}</h1>
        {/* <Link href={`/${blog.slug}`}><a style={{ color: "#000" }}>/{blog.slug}</a></Link> */}
        <p>/{blog.slug}</p>
        <span>
          From{' '}
          <Link href={`/users/${blog.author}`}>
            <a>
              {blogAuthor.firstName} {blogAuthor.lastName}
            </a>
          </Link>
        </span>
        <p style={{ maxWidth: '680px' }}>{blog.blogDescription}</p>
        {/* {user.data && (<TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                    // do they want to follow, unfollow, or edit? 
                    if (user.data && user.data.username === blog.author) {
                        // edit profile
                        router.push('/edit-profile')
                        return;
                    }
                    if (user.data && typeof (blog.slug) === 'string' && user.data.following.includes(blog.slug)) {
                        // unfollow
                        doUnfollow(blog.slug);
                        console.log('unfollow', blog.slug)
                        return;
                    } else {
                        // follow
                        doFollow(blog.slug);
                        console.log('follow', blog.slug);
                        return;
                    }
                }}>
                    {user.data.username === blog.author ? <p>edit profile</p> : user.data.following.includes(blog.slug) ? <p>unfollow</p> : <p>follow</p>}
                </TransparentButton>)} */}

        {/* {!user.data && <TransparentButton onClick={() => {
                    // code review / todo: add redirect 
                    router.push('/login');
                }}><p>sign in to follow</p></TransparentButton>} */}
      </div>
      <Layout>
        <Container>
          <If value={currentUser && currentUser.username === blog.author}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TransparentButton
                onClick={() => router.push('/new-post')}
                style={{ marginBottom: '2rem' }}
              >
                <p>write a new post</p>
              </TransparentButton>
            </div>
          </If>
          {children}
        </Container>
      </Layout>
    </div>
  )
}
