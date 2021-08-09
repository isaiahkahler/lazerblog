import Head from "next/head"
import Container from "../../components/container"
import Layout from "../../components/layout"
import Nav from "../../components/nav"
import PostPreview from "../../components/postPreview"
import If from '../../components/if'
import { getRandomSadEmoji } from '../../components/randomEmoji'
import CircleProgress from '../../components/circleProgress'
import { PostWithInfo, User } from "../../components/types"
import Button, { TransparentButton } from "../../components/button"
import styles from './user.module.css'
import Link from "next/link"

interface UserProps {
    posts: PostWithInfo[],
    outOfPosts: boolean,
    loading: boolean,
    user: User,
}

export default function UserDisplay({ posts, outOfPosts, loading, user }: UserProps) {

    //todo: if posts length is zero, conditionally render a skeleton
    return (
        <div>
                    <div className={styles.banner} style={{ backgroundColor: '#eee' }}>
                        {/* <div className={styles.banner} style={{ backgroundColor: props.brandImage ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: props.brandImage ? `url(${props.brandImage})` : 'none' }}> */}
                        <h1>{user.firstName} {user.lastName}</h1>
                        {/* <Link href={`/${blog}`}>
                    <a style={{ color: "#000" }}>/{blog}</a>
                </Link> */}
                        {/* <Link href={`/users/${user.username}`}> */}
                        {/* <a style={{ color: "#000" }}> */}
                        <p>@{user.username}</p>
                        {/* </a> */}
                        {/* </Link> */}
                        {/* <p style={{ maxWidth: '680px' }}>{props.description}</p> */}
                        <p style={{ maxWidth: '680px' }}>description</p>
                        <TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                            // do they want to follow, unfollow, or edit? 
                            // if(user && user.username === props.author) {
                            //     // edit profile
                            //     router.push('/edit-profile')
                            //     return;
                            // }
                            // if(user && typeof(blog) === 'string' && user.following.includes(blog)) {
                            //     // unfollow
                            //     doUnfollow(blog);
                            //     console.log('unfollow', blog)
                            //     return;
                            // } else {
                            //     if(user && user.following && typeof(blog) === 'string') {
                            //         // follow
                            //         doFollow(blog);
                            //     console.log('follow', blog)

                            //         return;
                            //     }
                            // }
                        }}>
                            {/* {user && user.username === props.author ? <p>edit profile</p> : user && typeof(blog) === 'string' && user.following.includes(blog) ? <p>unfollow</p> : <p>follow</p>}  */}
                            <p>follow</p>
                        </TransparentButton>
                    </div>
            <Layout>
                <Container>
                    {posts ? posts.map((post, index) => <PostPreview post={post.post} key={index} blog={post.blog} />) : <div style={{ display: 'flex', justifyContent: 'center' }}><p>No posts to show...</p></div>}
                    <If value={outOfPosts && posts.length === 0}>
                        <p style={{ textAlign: 'center' }}>Nothing to show {getRandomSadEmoji()}</p>
                    </If>
                    <If value={loading && !outOfPosts}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircleProgress />
                        </div>
                    </If>
                </Container>
            </Layout>
        </div>
    );
}