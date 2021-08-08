import { Blog, Post, User } from '../types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import styles from './preview.module.css'
import moment from 'moment'
import { useStoreActions } from '../store'
import { useEffect, useState } from 'react'

interface PostPreviewProps {
    post: Post,
    blog?: Blog,
    user?: User,
}

export default function PostPreview({ post, blog, user }: PostPreviewProps) {

    return (
        <div className={styles.previewContainer}>
            {blog && user && <div className={styles.previewSource}>
            <a href={`/users/${post.author}`} style={{color: "#000"}}>{user.firstName} {user.lastName}</a> in <a href={`/${post.blog}`} style={{color: "#000"}}>{blog.name}</a>
            </div>}
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