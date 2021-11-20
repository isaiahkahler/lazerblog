import { Blog, Post, User } from '../types'
import Link from 'next/link'
import Image from 'next/image'
import styles from './preview.module.css'
import moment from 'moment'
import If from '../if'

interface PostPreviewProps {
  post: Post
  blog?: Blog | null
  user?: User | null
}

export default function PostPreview({ post, blog, user }: PostPreviewProps) {
  return (
    <div className={styles.previewContainer}>
      <If value={blog && user}>
        <div className={styles.previewSource}>
          <Link href={`/users/${post.author}`}>
            <a style={{ color: '#000' }}>
              {user && user.firstName} {user && user.lastName}
            </a>
          </Link>{' '}
          in{' '}
          <Link href={`/${post.blog}`}>
            <a style={{ color: '#000' }}>{blog && blog.name}</a>
          </Link>
        </div>
      </If>
      <If value={blog && !user}>
        <div className={styles.previewSource}>
          In{' '}
          <Link href={`/${post.blog}`}>
            <a style={{ color: '#000' }}>{blog && blog.name}</a>
          </Link>
        </div>
      </If>
      <If value={!blog && user}>
        <div className={styles.previewSource}>
          From{' '}
          <Link href={`/users/${post.author}`}>
            <a style={{ color: '#000' }}>
              {' '}
              {user && user.firstName} {user && user.lastName}
            </a>
          </Link>
        </div>
      </If>

      <Link href={`/${post.blog}/${post.slug}`}>
        <a style={{ color: 'inherit' }}>
          <h1 className={styles.previewTitle}>{post.title}</h1>
          {post.description ? (
            <h2 className={styles.previewSubtitle}>{post.description}</h2>
          ) : null}
        </a>
      </Link>
      <div className={styles.previewMeta}>
        <span>{moment(post.date).calendar()}</span>
        {post.tags.length > 0
          ? post.tags.map((tag, index) => (
              <span key={index}>
                <Link href={`/tags/${tag}`}>
                  <a>#{tag}</a>
                </Link>
              </span>
            ))
          : null}
      </div>
      {post.image ? (
        <Link href={`/${post.blog}/${post.slug}`}>
          <a>
            {/* code review: fix this as any */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.description}
              className={styles.previewImage}
            />
            {/* <Image src={post.image as any} alt={post.description} layout='fill' className={styles.previewImage} /> */}
          </a>
        </Link>
      ) : null}
    </div>
  )
}
