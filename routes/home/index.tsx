import Layout from '../../components/layout'
import Container from '../../components/container'
import { LinkButton } from '../../components/button'
import { useStore } from '../../components/store'
import { UserBoundary } from '../../components/userBoundary'
import HomeFeed from './homeFeed'

export default function HomeWrapper() {

    // const userAuth = useStore(state => state.userAuth);
    const user = useStore(state => state.user);
    const userLoading = useStore(state => state.userLoading);

    // todo: replace with landing page
    // if(!user.auth || !user.data) return (
    return (
        <div>
            <Layout>
                <Container>
                    
                    <h1>reauthor</h1>
                    <p>A free and simple place to write.</p>
                    <LinkButton href='/login'>
                        <h2>start writing</h2>
                    </LinkButton>
                    
                    {/* <h2 style={{marginTop: '10rem'}}>more features coming soon!</h2>
                    <ul>
                        <li>follow people and blogs</li>
                        <li>add images to your posts</li>
                        <li>add banners to your blog</li>
                        <li>add comments</li>
                        <li>explore topics and trending</li>
                    </ul> */}
                </Container>
            </Layout>

        </div>
    );

    // return (<UserBoundary><HomeFeed user={user.data} /></UserBoundary>);
}
