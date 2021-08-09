import moment from "moment"
import { GetServerSideProps } from "next"
import Link from "next/link"
import Container from "../../components/container"
import Layout from "../../components/layout"
import firebase from '../../firebase'


export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('params', context.params);
    const { blog, post } = context.params ? context.params : { blog: '404', post: '404' };
    if(blog && post && typeof(blog) === 'string' && typeof(post) === 'string') {
        const blogRef = await firebase.firestore().collection('blogs').doc(blog).collection('posts').doc(post).get();
        const blogData = blogRef.data();
        if(blogRef.exists && blogData) {
            return {
                props: {
                    post: {
                        title: blogData.title,
                        description: blogData.description,
                        date: blogData.date,
                        image: blogData.image,
                        tags: blogData.tags,
                        content: blogData.content,
                    }
                }
            }
        }
    }
    return {
        props: {
            post: null
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


export default function Post({post}: {post: Post}) {
    // code review:
    if(!post) return <p>null????????</p>;
    return(
        <div>
            <Layout>
                <Container>
                    <h1>{post.title}</h1>
                    {post.description ? <h2>{post.description}</h2> : null}
                    <p>{moment(post.date).calendar()}</p>
                    {post.tags.length > 0 ? post.tags.map((tag, index) => <span key={index}><Link href={`/tags/${tag}`}><a style={{margin: '0px 10px 0px 0px'}}>#{tag}</a></Link></span>) : null}
                    <div dangerouslySetInnerHTML={{__html: post.content}}></div>
                </Container>
            </Layout>
        </div>
    );
}