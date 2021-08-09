import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import Container from "../../components/container"
import Layout from "../../components/layout"
import Nav from "../../components/nav"
import { useStoreActions, useStoreState } from "../../components/store"
import { UserBoundary } from "../../components/userBoundary"
import firebase from '../../firebase'
import { Blog, Post, PostWithInfo, User } from '../../components/types'
import PostPreview from "../../components/postPreview"
import { action } from "easy-peasy"
import If from '../../components/if'
import { getRandomSadEmoji } from '../../components/randomEmoji'
import CircleProgress from '../../components/circleProgress'

interface HomeProps {
    posts: PostWithInfo[],
    outOfPosts: boolean,
    loading: boolean,
}

export default function Home({ posts, outOfPosts, loading }: HomeProps) {

    //todo: if posts length is zero, conditionally render a skeleton

    return (
        <div>
            <Layout>
                <Container>
                    {posts ? posts.map((post, index) => <PostPreview post={post.post} key={index} blog={post.blog} user={post.user} />) : <div style={{ display: 'flex', justifyContent: 'center' }}><p>No posts to show...</p></div>}
                    <If value={outOfPosts && posts.length !== 0}>
                        <p style={{ textAlign: 'center' }}>No more posts to show {getRandomSadEmoji()}</p>
                    </If>
                    <If value={outOfPosts && posts.length === 0}>
                        <p style={{ textAlign: 'center' }}>Nothing to show {getRandomSadEmoji()}</p>
                    </If>
                    <If value={loading}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircleProgress />
                        </div>
                    </If>
                </Container>
            </Layout>
        </div>
    );
}