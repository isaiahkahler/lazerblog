import { User } from '../../../components/types'
import { TransparentButton } from '../../../components/button'
import styles from './tag.module.css'
import Layout from '../../../components/layout'
import Container from '../../../components/container'
import { useStore } from '../../../components/store'
import { useRouter } from 'next/router'

interface TagProps {
  tag: string
  children?: React.ReactNode
}

// different from naming scheme to not confuse with type & variable `User`
export default function TagDisplay({ tag, children }: TagProps) {
  const router = useRouter()
  //todo: if posts length is zero, conditionally render a skeleton
  return (
    <div id="findMe">
      <div className={styles.banner} style={{ backgroundColor: '#eee' }}>
        <h1>#{tag}</h1>
        <p style={{ maxWidth: '680px' }}>Posts tagged with #{tag}</p>
      </div>
      <Layout>
        <Container>{children}</Container>
      </Layout>
    </div>
  )
}
