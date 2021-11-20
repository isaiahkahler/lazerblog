import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Container from '../components/container'
import Layout from '../components/layout'
import Nav from '../components/nav'
import { useStore } from '../components/store'
import firebase from '../firebase'

export default function SignOut() {
  const router = useRouter()

  useEffect(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        router.push('/')
      })
  }, [router])

  return (
    <div>
      {/* <Nav /> */}
      <Layout>
        <Container>
          <h1>signing out...</h1>
        </Container>
      </Layout>
    </div>
  )
}
