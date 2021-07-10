import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import {LinkButton} from '../components/button'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Lazer Blog</title>
        <meta name="description" content="Fast and Free Blogging Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <h1>Lazer Blog</h1>
          <LinkButton href='/login'>
            <h2>start blogging</h2>
          </LinkButton>
        </Container>
      </Layout>

    </div>
  )
}
