import Layout from '../../components/layout'
import Container from '../../components/container'
import { LinkButton } from '../../components/button'
import { useStoreState } from '../../components/store'
import { UserBoundary } from '../../components/userBoundary'
import HomeFeed from './homeFeed'

export default function HomeWrapper() {

    const userAuth = useStoreState(state => state.userAuth);
    const user = useStoreState(state => state.user);
    const userLoading = useStoreState(state => state.userLoading);

    // todo: replace with landing page
    if(!userAuth || !user) return (
        <div>
            <Layout>
                <Container>
                    <h1>reauthor</h1>
                    <LinkButton href='/login'>
                        <h2>start blogging</h2>
                    </LinkButton>
                </Container>
            </Layout>

        </div>
    );

    return (<UserBoundary><HomeFeed user={user} /></UserBoundary>);
}
