import { User } from "../../components/types"
import usePostFeed from "../../components/usePostFeed"
import PostFeed from "../../components/postFeed"
import firebase from '../../firebase'
import Layout from "../../components/layout"
import Container from "../../components/container"

interface HomeFeedProps {
    user: User
}

export default function HomeFeed({ user }: HomeFeedProps) {
    const postFeed = usePostFeed({
        query: firebase.firestore().collectionGroup('posts')
            .where('blog', 'in', user.following)
            .orderBy('date', 'desc'),
        showUser: true,
        showBlog: true,
        loadOnScrollEnd: true,
    })

    return (
    <Layout>
        <Container>
            <h1 style={{marginBottom: 0}}>From Your Following</h1>
            <hr style={{marginBottom: '2rem'}} />
            <PostFeed posts={postFeed.posts} loading={postFeed.loading} outOfPosts={postFeed.outOfPosts} />
        </Container>
    </Layout>);
}