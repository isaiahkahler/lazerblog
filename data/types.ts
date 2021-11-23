import { Session } from "@supabase/gotrue-js";

export interface Post {
    post_slug: string,
    title: string,
    description: string | undefined,
    date: number,
    content: string,
    image: string | undefined,
    tags: string[],
    user_id: string,
    blog: string,
}

export interface PostWithInfo {
    post: Post,
    user?: User | null,
    blog?: Blog | null
}

export interface UserStore {
    data: User | null,
    auth: Session['user'] | null,
    blogs: Blog[] | null
}

// export interface User extends UserBase {
//     username: string,
// }

export interface User { // UserBase
    user_id: string,
    username: string,
    name: string,
    profile_picture: string,
    // banner_image: string,
    // bio: string
    // firstName: string,
    // lastName: string,
    // bio: string,
    // following: string[],
    // blogs: string[]
    // profilePicture: string,
    // bannerImage: string,
    // draft?: Draft
}

export interface Draft {
    user_id: string,
    content: string,
    post_to: string,
    slug: string,
    title: string,
}


export interface Blog {
    blog_slug: string,
    user_id: string,
    name: string,
    description: string,
    banner_image: string,
}

export interface FollowedPost extends Post {
    blog_name: string,
    blog_description: string,
    banner_image: string,
    follower: string,
}