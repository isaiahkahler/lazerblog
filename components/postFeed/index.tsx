
import { PostWithInfo } from '../types'
import PostPreview from "../postPreview"
import If from '../if'
import { getRandomSadEmoji } from '../randomEmoji'
import CircleProgress from '../circleProgress'

interface PostFeedProps {
    posts: PostWithInfo[],
    outOfPosts: boolean,
    loading: boolean,
    disableOutOfPostsMessage?: boolean,
    disableNoPostsMessage?: boolean,
}

export default function PostFeed({ posts, outOfPosts, loading, disableOutOfPostsMessage, disableNoPostsMessage }: PostFeedProps) {

    //todo: if posts length is zero, conditionally render a skeleton

    return (
        <div>
            {posts.map((post, index) => <PostPreview post={post.post} key={index} blog={post.blog} user={post.user} />)}
            <If value={outOfPosts && posts.length !== 0 && !disableOutOfPostsMessage}>
                <p style={{ textAlign: 'center' }}>No more posts to show {getRandomSadEmoji()}</p>
            </If>
            <If value={outOfPosts && posts.length === 0 && !disableNoPostsMessage}>
                <p style={{ textAlign: 'center' }}>Nothing to show {getRandomSadEmoji()}</p>
            </If>
            <If value={loading}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircleProgress />
                </div>
            </If>
        </div>
    );
}