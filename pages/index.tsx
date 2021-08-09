import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import { LinkButton } from '../components/button'
import { useStoreState } from '../components/store'
import { useEffect } from 'react'

export default function Home() {
    // code review: remove
    const user = useStoreState(state => state.user);

    useEffect(() => {
        console.log('user?', !!user);
    }, [user])

    return (
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
    )
}
