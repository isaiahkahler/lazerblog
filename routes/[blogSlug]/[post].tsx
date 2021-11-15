import moment from "moment"
import { GetServerSideProps } from "next"
import Link from "next/link"
import Container from "../../components/container"
import Layout from "../../components/layout"
import firebase from '../../firebase'
import { User } from '../../components/types'
import {getRandomSadEmoji} from '../../components/randomEmoji'
import PageNotFound from "../../components/404"


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { blogSlug, post } = context.params ? context.params : { blogSlug: '404', post: '404' };

    let blogPost = null;
    let blogUser = null;

    if (blogSlug && post && typeof (blogSlug) === 'string' && typeof (post) === 'string') {
        const blogRef = await firebase.firestore().collection('blogs').doc(blogSlug).collection('posts').doc(post).get();
        const blogData = blogRef.data();
        if (blogRef.exists && blogData) {

            blogPost = {
                title: blogData.title,
                description: blogData.description,
                date: blogData.date,
                image: blogData.image,
                tags: blogData.tags,
                content: blogData.content,
            };

            const userRef = await firebase.firestore().collection('users').doc(blogData.author).get();
            const userData = userRef.data();
            if (userRef.exists && userData) {
                blogUser = {username: blogData.author, ...userData};
            }
        }
    }
    return {
        props: {
            post: blogPost,
            user: blogUser
        }
    }
}

interface Post {
    title: string,
    description: string | undefined,
    date: number,
    image: string | undefined,
    tags: string[]
    content: string,
}


export default function Post({ post, user }: { post: Post | null, user: User | null }) {

    if (!post) {
        console.error('whats wrong with post', post)
        return (<PageNotFound />);
    }

    console.log('got user?', user);

    return (
        <div>
            <Layout>
                <Container>
                    <h1>{post.title}</h1>
                    {post.description ? <h2>{post.description}</h2> : null}
                    <p>{moment(post.date).calendar()} {user ? <>by {<Link href={`/users/${user.username}`}><a>{user.firstName} {user.lastName}</a></Link>}</> : undefined}</p>
                    {post.tags.length > 0 ? post.tags.map((tag, index) => <span key={index}><Link href={`/tags/${tag}`}><a style={{ margin: '0px 10px 0px 0px' }}>#{tag}</a></Link></span>) : null}
                    <hr style={{ margin: '2rem 0' }} />
                    <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                </Container>
            </Layout>
        </div>
    );
}