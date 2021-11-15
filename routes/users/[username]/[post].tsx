import moment from "moment"
import { GetServerSideProps } from "next"
import Link from "next/link"
import Container from "../../../components/container"
import Layout from "../../../components/layout"
import firebase from '../../../firebase'
import Post from '../../[blogSlug]/[post]'


export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('params', context.params);
    const { username, post } = context.params ? context.params : { username: '404', post: '404' };
    if(username && post && typeof(username) === 'string' && typeof(post) === 'string') {
        const blogRef = await firebase.firestore().collection('users').doc(username).collection('posts').doc(post).get();
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


export default Post;