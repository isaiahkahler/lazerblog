import Layout from '../../components/layout'
import Container from '../../components/container'
import Nav from '../../components/nav'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import firebase from '../../firebase'
import { GetServerSideProps } from 'next'
import Button from '../../components/button'
import styles from './blog.module.css'

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('params', context.params);
    const { blog } = context.params ? context.params : { blog: '404' };
    if (blog && typeof (blog) === 'string') {
        const blogRef = await firebase.firestore().collection('blogs').doc(blog).get();
        const blogData = blogRef.data();
        if (blogRef.exists && blogData) {
            return {
                props: {
                    blog: {
                        name: blogData.name,
                        description: blogData.blogDescription,
                        brandImage: blogData.brandImage,
                        author: blogData.author
                    }
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
}

interface BlogWrapperProps {
    blog: BlogProps | null
}

function Blog(props: BlogProps) {
    const router = useRouter();
    const { blog } = router.query;
    const [posts, setPosts] = useState<any>([]);

    return (
        <div>
            <Layout>
                <Container>
                    <div className={styles.banner}>
                        <h1>{props.name}</h1>
                    </div>
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

    return (<><Blog author={props.blog.author} brandImage={props.blog.brandImage} description={props.blog.description} name={props.blog.name} /></>);
}
