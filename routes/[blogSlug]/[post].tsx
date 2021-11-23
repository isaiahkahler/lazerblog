import moment from "moment"
import { GetServerSideProps } from "next"
import Link from "next/link"
import Container from "../../components/container"
import Layout from "../../components/layout"
import { User, Post, Blog } from '@data/types'
import {getRandomSadEmoji} from '../../components/randomEmoji'
import PageNotFound from "../../components/404"
import {supabase} from '@supabase'


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { blogSlug, post } = context.params ? context.params : { blogSlug: '404', post: '404' };

    let _post: Post | null = null;
    let _user = null;
    let _blog = null;


    if (blogSlug && post && typeof (blogSlug) === 'string' && typeof (post) === 'string') {

        const postResponse = await supabase.from('posts').select('*').eq('post_slug', post);
        if(postResponse.error) throw postResponse.error;
        const postData = postResponse.data[0];
        if (postData) {

            _post = postData as Post;

            const userResponse = await supabase.from('users').select('*').eq('user_id', _post.user_id);
            if(userResponse.error) throw userResponse.error;
            const userData = userResponse.data[0];
            if (userData) {
                _user = userData;
            }

            if(!postData.blog.includes('users/')) {
                const blogResponse = await supabase.from('blogs').select('*').eq('blog_slug', blogSlug);
                if(blogResponse.error) throw blogResponse.error;
                const blogData = blogResponse.data[0];
                _blog = blogData;
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
                    <p>{moment(post.date).calendar()} {user ? <>by {<Link href={`/users/${user.username}`}><a>{user.name}</a></Link>}</> : undefined} {blog ? <>in {<Link href={`/${blog.blog_slug}`}>{blog.name}</Link>}</> : undefined}</p>
                    {post.tags.length > 0 ? post.tags.map((tag, index) => <span key={index}><Link href={`/tags/${tag}`}><a style={{ margin: '0px 10px 0px 0px' }}>#{tag}</a></Link></span>) : null}
                    <hr style={{ margin: '2rem 0' }} />
                    <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    <hr style={{ margin: '2rem 0' }} />
                </Container>
            </Layout>
        </div>
    );
}