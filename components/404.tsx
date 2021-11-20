import Layout from './layout'
import Container from './container'
import { getRandomSadEmoji } from './randomEmoji'
import Button from './button'
import { useRouter } from 'next/router'

export default function PageNotFound() {
  const router = useRouter()
  return (
    <div>
      {/* <Nav /> */}
      <Layout>
        <Container>
          <h1>{getRandomSadEmoji()} 404 The page does not exist.</h1>
          <p>Was the URL spelled correctly?</p>
          <Button
            onClick={() => {
              router.back()
            }}
          >
            <h2>← go back</h2>
          </Button>
        </Container>
      </Layout>
    </div>
  )
}
