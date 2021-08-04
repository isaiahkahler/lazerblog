import Layout from '../../components/layout'
import Container from '../../components/container'
import Nav from '../../components/nav'
import { useRouter } from 'next/router'
import { CSSProperties, useEffect, useState } from 'react'
import firebase from '../../firebase'
import { GetServerSideProps } from 'next'
import Button, { TransparentButton } from '../../components/button'
import styles from './blog.module.css'
import Link from 'next/link'
import moment from 'moment'
import { useStoreState, useStoreActions } from '../../components/store'
import { Post } from '../../components/types'
import PostPreview from '../../components/postPreview'

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('params', context.params);
    const { blog } = context.params ? context.params : { blog: '404' };
    if (blog && typeof (blog) === 'string') {
        const blogRef = await firebase.firestore().collection('blogs').doc(blog).get();
        const blogData = blogRef.data();
        if (blogRef.exists && blogData) {

            const postCollection = firebase.firestore().collection('blogs').doc(blog).collection('posts');
            const postQuery = await postCollection.orderBy('date', 'desc').limit(10).get();

            const posts = postQuery.docs.map((doc) => {
                const data = doc.data();
                return data;
            });

            

            return {
                props: {
                    blog: {
                        name: blogData.name,
                        description: blogData.blogDescription,
                        brandImage: blogData.brandImage,
                        author: blogData.author,
                        tags: blogData.tags ? blogData.tags : []
                    },
                    posts: postQuery.docs.length === 0 ? [] : posts
                }
            };
        }
    }
    return { props: { blog: null } };
}

interface BlogProps {
    name: string,
    description: string | undefined,
    brandImage: string | undefined,
    author: string,
    posts: Post[] | undefined
}

interface BlogWrapperProps {
    blog: BlogProps | null,
    posts: Post[]
}

function Blog(props: BlogProps) {
    const router = useRouter();
    const { blog } = router.query;
    const username = useStoreState(state => state.username);
    const following = useStoreState(state => state.following);
    const doFollow = useStoreActions(actions => actions.doFollow);
    const doUnfollow = useStoreActions(actions => actions.doUnfollow);


    const centered: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' };
    const postUI = props.posts ? props.posts.map((post, index) => { return <PostPreview post={post} key={index} /> }) : <div style={centered}><p>This page is empty.</p></div>;

    return (
        <div>
            <div className={styles.banner} style={{ backgroundColor: props.brandImage ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: props.brandImage ? `url(${props.brandImage})` : 'none' }}>
                <h1>{props.name}</h1>
                <Link href={`/${blog}`}>
                    <a style={{ color: "#000" }}>/{blog}</a>
                </Link>
                <Link href={`/users/${props.author}`}>
                    <a style={{ color: "#000" }}>@{props.author}</a>
                </Link>
                <p style={{ maxWidth: '680px' }}>{props.description}</p>
                <TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                    // do they want to follow, unfollow, or edit? 
                    if(username === props.author) {
                        // edit profile
                        router.push('/edit-profile')
                        return;
                    }
                    if(following && typeof(blog) === 'string' && following.includes(blog)) {
                        // unfollow
                        doUnfollow(blog);
                        console.log('unfollow', blog)
                        return;
                    } else {
                        if(following && typeof(blog) === 'string') {
                            // follow
                            doFollow(blog);
                        console.log('follow', blog)

                            return;
                        }
                    }
                }}>
                    {username === props.author ? <p>edit profile</p> : following && typeof(blog) === 'string' && following.includes(blog) ? <p>unfollow</p> : <p>follow</p>} {/* change to say 'following' or 'edit' depending on user */}
                </TransparentButton>
            </div>
            <Layout>
                <Container>
                    {postUI}
                </Container>
            </Layout>
        </div>
    );
}

export default function BlogWrapper(props: BlogWrapperProps) {
    const router = useRouter();
    if (!props.blog) return (
        <div>
            <Nav />
            <Layout>
                <Container>
                    <h1>404 The page does not exist.</h1>
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

    return (<><Blog author={props.blog.author} brandImage={props.blog.brandImage} description={props.blog.description} name={props.blog.name} posts={props.posts} /></>);
}
