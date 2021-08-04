import { Post } from '../types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import styles from './preview.module.css'
import moment from 'moment'

export default function PostPreview({ post, showSource }: { post: Post, showSource?: boolean }) {

    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewSource}>
                <span><a href={`/${post.blog}`}><h3>/{post.blog}</h3></a></span>
                <span><a href={`/users/${post.author}`}><h3>@{post.author}</h3></a></span>
            </div>
            <Link href={`/${post.blog}/${post.slug}`}>
                <a style={{ color: 'inherit' }}>
                    <h1 className={styles.previewTitle}>{post.title}</h1>
                    {post.description ? <h2 className={styles.previewSubtitle}>{post.description}</h2> : null}
                </a>
            </Link>
            <div className={styles.previewMeta}>
                <span>{moment(post.date).calendar()}</span>
                {post.tags.length > 0 ? post.tags.map((tag, index) => <span key={index}><Link href={`/tags/${tag}`}><a>#{tag}</a></Link></span>) : null}
            </div>
            {post.image ? <Link href={`/${post.blog}/${post.slug}`}>
                <a>
                    {/* code review: fix this as any */}
                    <img src={post.image} alt={post.description} className={styles.previewImage} />
                    {/* <Image src={post.image as any} alt={post.description} layout='fill' className={styles.previewImage} /> */}
                </a>
            </Link> : null}
        </div>
    );
}