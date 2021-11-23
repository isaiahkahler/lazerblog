import { User } from "@data/types"
import usePostFeed from "@hooks/usePostFeed"
import PostFeed from "../../components/postFeed"
import Layout from "../../components/layout"
import Container from "../../components/container"
import { supabase } from "@supabase"
import { useEffect, useState } from "react"

interface HomeFeedProps {
    user: User
}

export default function HomeFeed({ user }: HomeFeedProps) {

    const [followedUserIDs, setFollowedUserIDs] = useState<string[]>([]);
    const followedUsersString = followedUserIDs.join(',');

    useEffect(() => {
        console.log('changes! this should only happen once')
    }, [followedUsersString, user.user_id]);

    console.log('followed string', `follower.eq.${user.user_id},user_id.in.(${followedUsersString})`);

    const postFeed = usePostFeed({
        // code review: limit selected fields down to just post
        query: supabase.from('posts_with_followers').select('post_slug, blog, title, description, date, content, image, tags, user_id').or(`user_follower.eq.${user.user_id},blog_follower.eq.${user.user_id}`).order('date', {ascending: false}),
        showUser: true,
        showBlog: true,
        loadOnScrollEnd: true,
    })

    useEffect(() => {
        (async() => {
            const followedResponse = await supabase.from('follows').select('*').eq('user_id', user.user_id);
            if(followedResponse.error) throw followedResponse.error;
            const followedIDs = followedResponse.data.filter(blog => blog.following.includes('users/')).map(blog => blog.following_id);
            setFollowedUserIDs(followedIDs);
        })();
    }, [user.user_id]);


    return (
    <Layout>
        <Container>
            <h1 style={{marginBottom: 0}}>From Your Following</h1>
            <hr style={{marginBottom: '2rem'}} />
            <PostFeed posts={postFeed.posts} loading={postFeed.loading} outOfPosts={postFeed.outOfPosts} />
        </Container>
    </Layout>);
}