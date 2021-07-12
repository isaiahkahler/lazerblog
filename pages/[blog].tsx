import Layout from '../components/layout'
import Container from '../components/container'
import Nav from '../components/nav'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import firebase from '../firebase'


export default function Blog() {
    const router = useRouter();
    const { blog } = router.query;
    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        console.log(posts)
    }, [posts]);


    useEffect(() => {
        (async () => {
            // code review: typeof? 
            if (blog && typeof (blog) === 'string') {
                const postCollection = firebase.firestore().collection('blogs').doc(blog).collection('posts');
                const postQuery = await postCollection.orderBy('date', 'desc').limit(10).get();
                if (postQuery.docs.length > 0) {
                    const posts = postQuery.docs.map((doc) => {
                        const data = doc.data();
                        return data;
                    });
                    setPosts(posts);
                } else {

                }
            }
        })();
    }, [blog])

    return (
        <div>
            <Nav />
            <Layout>
                <Container>

                </Container>
            </Layout>
        </div>
    );
}