export interface Post {
    slug: string,
    title: string,
    description: string | undefined,
    date: number,
    content: string,
    image: string | undefined,
    tags: string[]
    author: string,
    blog: string,
}

export interface PostWithInfo {
    post: Post,
    user?: User | null,
    blog?: Blog | null
}

export interface User extends UserBase {
    username: string,
}

export interface UserBase {
    firstName: string,
    lastName: string,
    following: string[],
    blogs: string[]
    profilePicture: string,
    draft?: Draft
}

export interface Draft {
    content: string,
    postTo: string,
    slug: string,
    title: string,
}

export interface Blog extends BlogBase {
    slug: string,
}

export interface BlogBase {
    author: string,
    blogDescription: string,
    brandImage: string,
    name: string
}