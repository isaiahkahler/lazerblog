import { Blog, User } from "../../components/types";
import styles from './blog.module.css'
import Link from 'next/link'
import { useStoreState, useStoreActions } from '../../components/store'
import { TransparentButton } from '../../components/button'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Container from "../../components/container";


interface BlogProps {
  blog: Blog,
  children?: React.ReactNode
}

export default function BlogDisplay({blog, children}: BlogProps) {
  const router = useRouter();
  const getUser = useStoreActions(actions => actions.getUser);
  const user = useStoreState(state => state.user);
  const doFollow = useStoreActions(actions => actions.doFollow);
  const doUnfollow = useStoreActions(actions => actions.doUnfollow);

  const [blogAuthor, setBlogAuthor] = useState<User>({
    firstName: '',
    lastName: '',
    bannerImage: '',
    blogs: [],
    following: [],
    profilePicture: '',
    username: '',
  } as User);

  useEffect(() => {
    (async () => {
      if(blogAuthor.username !== '') return;
      const user = await getUser(blog.author);
      if(!user) {
        // code review: 
        throw new Error('oh the user ? what');
      }
      setBlogAuthor(user);
    })();
  }, [getUser, blog, blogAuthor]);


  return (
      <div>
          <div className={styles.banner} style={{ backgroundColor: blog.brandImage ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: blog.brandImage ? `url(${blog.brandImage})` : 'none' }}>
              <h1>{blog.name}</h1>
              <Link href={`/${blog.slug}`}>
                  <a style={{ color: "#000" }}>/{blog.slug}</a>
              </Link>
              <Link href={`/users/${blog.author}`}>
                  <a style={{ color: "#000" }}>{blogAuthor.firstName} {blogAuthor.lastName}</a>
              </Link>
              <p style={{ maxWidth: '680px' }}>{blog.blogDescription}</p>
              <TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                  // do they want to follow, unfollow, or edit? 
                  if(user && user.username === blog.author) {
                      // edit profile
                      router.push('/edit-profile')
                      return;
                  }
                  if(user && typeof(blog) === 'string' && user.following.includes(blog)) {
                      // unfollow
                      doUnfollow(blog);
                      console.log('unfollow', blog)
                      return;
                  } else {
                      if(user && user.following && typeof(blog) === 'string') {
                          // follow
                          doFollow(blog);
                      console.log('follow', blog)

                          return;
                      }
                  }
              }}>
                  {user && user.username === blog.author ? <p>edit profile</p> : user && typeof(blog) === 'string' && user.following.includes(blog) ? <p>unfollow</p> : <p>follow</p>} 
              </TransparentButton>
          </div>
          <Layout>
              <Container>
                  {children}
              </Container>
          </Layout>
      </div>
  );
}

