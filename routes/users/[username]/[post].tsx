import { supabase } from "@supabase";
import { GetServerSideProps } from "next"
import Post from '../../[blogSlug]/[post]'



export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('params', context.params);
    const { username, post } = context.params ? context.params : { username: '404', post: '404' };

    let _user = null;
    let _post = null;

    if (username && post && typeof (username) === 'string' && typeof (post) === 'string') {
        const userResponse = await supabase.from('users').select('*').eq('username', username);
        if(userResponse.error) throw userResponse.error;
        const userData = userResponse.data[0];

        if (userData) {
            _user = userData;

            const postResponse = await supabase.from('posts').select('*').eq('post_slug', post);
            if(postResponse.error) throw postResponse.error;
            const postData = postResponse.data[0];
            if (postData) {
                _post = postData;
            }
        }
    }


    return {
        props: {
            post: _post,
            user: _user
        }
    }
}


export default Post;