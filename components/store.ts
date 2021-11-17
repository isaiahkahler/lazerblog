import create from 'zustand'
import firebase from '../firebase'
import { Blog, BlogBase, Post, User, UserBase, UserStore } from './types'

interface Store {
  // userAuth: firebase.User | null,
  user: {
    auth: firebase.User | null,
    data: User | null
  },
  userLoading: boolean,
  // setUserAuth: (userAuth: firebase.User | null) => void,
  setUser: (user: UserStore) => void,
  setUserLoading: (userLoading: boolean) => void,
  cache: {
    blogs: { [slug: string]: Blog },
    users: { [username: string]: User },
    posts: { [slug: string]: Post }
  },
  title: string,
  addPostToCache: (post: Post) => void,
  addBlogToCache: (blog: Blog) => void,
  addUserToCache: (user: User) => void,
  setTitle: (title: string) => void,
  doFollow: (usernameOrBlog: string) => Promise<void>,
  doUnfollow: (usernameOrBlog: string) => Promise<void>,
  getPost: (postSlug: string) => Promise<Post | undefined>,
  getPosts: (postSlugs: string[]) => Promise<Promise<Post | undefined>[]>,
  getBlog: (blogSlug: string) => Promise<Blog | undefined>,
  getUser: (username: string) => Promise<User | undefined>,
}

export const useStore = create<Store>((set, get) => ({
  // userAuth: null,
  user: {
    auth: null,
    data: null
  },
  userLoading: true,
  // setUserAuth: (userAuth: firebase.User | null) => set(state => ({ userAuth: userAuth })),
  setUser: (_user: UserStore) => set(state => ({ user: {auth: _user.auth, data: _user.data} })),
  setUserLoading: (userLoading: boolean) => set(state => ({ userLoading: userLoading })),
  cache: {
    blogs: {},
    users: {},
    posts: {}
  },
  title: 'reauthor',
  addPostToCache: (post: Post) => set(state => {
    const newCache = state.cache;
    newCache.posts[post.slug] = post;
    return { cache: newCache };
  }),
  addBlogToCache: (blog: Blog) => set(state => {
    const newCache = state.cache;
    newCache.blogs[blog.slug] = blog;
    return { cache: newCache };
  }),
  addUserToCache: (user: User) => set(state => {
    const newCache = state.cache;
    newCache.users[user.username] = user;
    return { cache: newCache };
  }),
  setTitle: (title: string) => set(state => ({ title: title })),
  doFollow: async (usernameOrBlog: string) => {
    const state = get();
    if (!state.user.data) return;
    await firebase.firestore().collection('users').doc(state.user.data.username).set({
      following: state.user.data.following ? [...state.user.data.following, usernameOrBlog] : [usernameOrBlog]
    }, { merge: true });

  },
  doUnfollow: async (usernameOrBlog: string) => {
    const state = get();
    if (!state.user.data) return;
    if (!(state.user.data.following.includes(usernameOrBlog))) return;

    await firebase.firestore().collection('users').doc(state.user.data.username).set({
      following: state.user.data.following.filter(blog => blog !== usernameOrBlog)
    }, { merge: true });

  },
  getPost: async (postSlug: string) => {
    const state = get();
    if (state.cache.posts[postSlug]) return state.cache.posts[postSlug];

    const postRef = await firebase.firestore().collectionGroup('posts').where('slug', '==', postSlug).get();
    if (postRef.docs.length > 0) {
      const post = postRef.docs[0].data() as Post;
      state.addPostToCache(post);
      return post;
    }

    // throw Error('Tried to get a post that doesn\'t exist');
    return undefined;
  },
  getPosts: async (postSlugs: string[]) => {
    const state = get();
    const posts = postSlugs.map(async (slug) => await state.getPost(slug));
    return posts;
  },
  getBlog: async (blogSlug: string) => {
    const state = get();
    if (state.cache.blogs[blogSlug]) return state.cache.blogs[blogSlug];
    const blogRef = await firebase.firestore().collection('blogs').doc(blogSlug).get();
    const blogData = blogRef.data();
    if (blogRef.exists && blogData) {
      const blog = { slug: blogSlug, ...blogData as BlogBase };
      state.addBlogToCache(blog);
      return blog;
    }
  },
  getUser: async (username: string) => {
    const state = get();
    if (state.cache.users[username]) return state.cache.users[username];
    const userRef = await firebase.firestore().collection('users').doc(username).get();
    const userData = userRef.data();
    if (userRef.exists && userData) {
      const user = { username: username, ...userData as UserBase };
      state.addUserToCache(user);
      return user;
    }
  }
}))

