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