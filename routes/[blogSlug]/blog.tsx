import { Blog, User } from "@data/types";
import styles from './blog.module.css'
import Link from 'next/link'
import { useStore } from '../../data/store'
import { TransparentButton } from '../../components/button'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Container from "../../components/container";
import If from "../../components/if";
import { supabase } from '@supabase'


interface BlogProps {
    blog: Blog,
    children?: React.ReactNode
}

export default function BlogDisplay({ blog, children }: BlogProps) {
    const router = useRouter();
    const getUser = useStore(state => state.getUser);
    const user = useStore(state => state.user);
    const [following, setFollowing] = useState(false);
    const doFollow = useStore(state => state.doFollow);
    const doUnfollow = useStore(state => state.doUnfollow);
    const currentUser = user.data;
    const isUserBlog = blog.blog_slug.includes('users/');

    const [blogAuthor, setBlogAuthor] = useState<User>({
        name: '',
        bio: '',
        banner_image: '',
        profile_picture: '',
        username: '',
        user_id: ''
    } as User);

    // code review: do we want to user to be sent on load, or stored upon load to cache like this?
    // the other way is done in /tags
    useEffect(() => {
        (async () => {
            if (blogAuthor.username !== '') return;
            const _user = await getUser(blog.user_id);
            if (!_user) {
                // code review: 
                // throw new Error('oh the user ? what');
                console.log('WHAT why isnt there a user');
                return;
            }
            setBlogAuthor(_user);
        })();
    }, [getUser, blog, blogAuthor]);

    useEffect(() => {
        (async () => {
            if (!user.data) return;
            if(blog.blog_slug.includes('users/')) {
                // is a user follow
                const followingResponse = await supabase.from('user_follows').select('*').eq('follower_user_id', user.data.user_id);
                if (followingResponse.error) throw followingResponse.error;
                if (followingResponse.data[0] && followingResponse.data[0].following_user_id === blog.user_id) {
                    setFollowing(true);
                }
            } else {
                // is a blog follow
                const followingResponse = await supabase.from('blog_follows').select('*').eq('follower_user_id', user.data.user_id);
                if (followingResponse.error) throw followingResponse.error;
                if (followingResponse.data[0] && followingResponse.data[0].blog_slug === blog.blog_slug) {
                    setFollowing(true);
                }
            }

        })();
    }, [blog.blog_slug, user.data])


    return (
        <div>
            <div className={styles.banner} style={{ backgroundColor: blog.banner_image ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: blog.banner_image ? `url(${blog.banner_image})` : 'none' }}>
                <h1>{blog.name}</h1>
                {/* <Link href={`/${blog.slug}`}><a style={{ color: "#000" }}>/{blog.slug}</a></Link> */}
                <p>{isUserBlog ? `@${blog.blog_slug.substring('users/'.length)}` : `/${blog.blog_slug}`}</p>
                <If.not value={isUserBlog}>
                    <span>
                        From <Link href={`/users/${blogAuthor.username}`}><a>{blogAuthor.name}</a></Link>
                    </span>
                </If.not>
                <p style={{ maxWidth: '680px' }}>{blog.description}</p>
                {user.data && (<TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                    // do they want to follow, unfollow, or edit? 
                    if (user.data && user.data.user_id === blog.user_id) {
                        // edit profile
                        // router.push(router.asPath)
                        if(isUserBlog) {
                            router.push('/edit-profile');
                        } else {
                            router.push(`/edit-blog?blog=${blog.blog_slug}`)
                        }
                        console.log('as path:', router.asPath)
                        return;
                    }
                    if (user.data && typeof (blog.blog_slug) === 'string' && following) {
                        // unfollow
                        if(blog.blog_slug.includes('users/')) {
                            doUnfollow(blog.user_id, true);
                        } else {
                            doUnfollow(blog.blog_slug, false);
                        }
                        setFollowing(false);
                        console.log('unfollow', blog.blog_slug)
                        return;
                    } else {
                        // follow
                        
                        if(blog.blog_slug.includes('users/')) {
                            doFollow(blog.user_id, true);
                        } else {
                            doFollow(blog.blog_slug, false);
                        }
                        setFollowing(true);
                        console.log('follow', blog.blog_slug);
                        return;
                    }
                }}>
                    {user.data.user_id === blog.user_id ? (isUserBlog ? <p>edit profile</p> : <p>edit blog</p>) : following ? <p>unfollow</p> : <p>follow</p>}
                </TransparentButton>)}

                {!user.data && <TransparentButton onClick={() => {
                    // code review / todo: add redirect 
                    router.push('/login');
                }}><p>sign in to follow</p></TransparentButton>}

            </div>
            <Layout>
                <Container>
                    <If value={currentUser && currentUser.user_id === blog.user_id}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <TransparentButton onClick={() => router.push('/new-post')} style={{ marginBottom: '2rem' }}>
                                <p>write a new post</p>
                            </TransparentButton>
                        </div>
                    </If>
                    {children}
                </Container>
            </Layout>
        </div>
    );
}

