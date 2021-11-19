import moment from "moment"
import { GetServerSideProps } from "next"
import Link from "next/link"
import Container from "../../components/container"
import Layout from "../../components/layout"
import firebase from '../../firebase'
import { User, Post, Blog } from '../../components/types'
import {getRandomSadEmoji} from '../../components/randomEmoji'
import PageNotFound from "../../components/404"


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { blogSlug, post } = context.params ? context.params : { blogSlug: '404', post: '404' };

    let _post: Post | null = null;
    let _user = null;
    let _blog = null;


    if (blogSlug && post && typeof (blogSlug) === 'string' && typeof (post) === 'string') {
        const postRef = await firebase.firestore().collection('blogs').doc(blogSlug).collection('posts').doc(post).get();
        const postData = postRef.data();
        if (postRef.exists && postData) {

            _post = {
                // title: postData.title,
                // description: postData.description,
                // date: postData.date,
                // image: postData.image,
                // tags: postData.tags,
                // content: postData.content,
                ...postData as Post
            };

            const userRef = await firebase.firestore().collection('users').doc(postData.author).get();
            const userData = userRef.data();
            if (userRef.exists && userData) {
                _user = {username: postData.author, ...userData};
            }

            if(!postData.blog.includes('users/')) {
                const blogRef = await firebase.firestore().collection('blogs').doc(postData.blog).get();
                const blogData = blogRef.data();
                _blog = {...blogData as Blog}
            }
        }
    }
    return {
        props: {
            post: _post,
            user: _user,
            blog: _blog
        }
    }
}

// interface Post {
//     title: string,
//     description: string | undefined,
//     date: number,
//     image: string | undefined,
//     tags: string[]
//     content: string,
// }


export default function PostDisplay({ post, user, blog }: { post: Post | null, user: User | null, blog: Blog | null }) {

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
                    <p>{moment(post.date).calendar()} {user ? <>by {<Link href={`/users/${user.username}`}><a>{user.firstName} {user.lastName}</a></Link>}</> : undefined} {blog ? <>in {<Link href={`/${blog.slug}`}>{blog.name}</Link>}</> : undefined}</p>
                    {post.tags.length > 0 ? post.tags.map((tag, index) => <span key={index}><Link href={`/tags/${tag}`}><a style={{ margin: '0px 10px 0px 0px' }}>#{tag}</a></Link></span>) : null}
                    <hr style={{ margin: '2rem 0' }} />
                    <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    <hr style={{ margin: '2rem 0' }} />
                </Container>
            </Layout>
        </div>
    );
}