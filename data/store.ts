import create from 'zustand'
// import firebase from '../firebase'
import { Session, User as SupabaseUser } from '@supabase/gotrue-js';
import { Blog, Post, User, UserStore } from './types'
import { supabase } from '@supabase';

interface Store {
  // userAuth: firebase.User | null,
  user: {
    auth: Session['user'] | null,
    data: User | null,
    blogs: Blog[] | null,
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
  doFollow: (userIDorBlog: string, isUserFollow: boolean) => Promise<void>,
  doUnfollow: (userIDorBlog: string, isUserFollow: boolean) => Promise<void>,
  getPost: (postSlug: string) => Promise<Post | undefined>,
  getPosts: (postSlugs: string[]) => Promise<Promise<Post | undefined>[]>,
  getBlog: (blogSlug: string) => Promise<Blog | undefined>,
  getUser: (user_id: string) => Promise<User | undefined>,
}

export const useStore = create<Store>((set, get) => ({
  // userAuth: null,
  user: {
    auth: null,
    data: null,
    blogs: null,
  },
  userLoading: true,
  // setUserAuth: (userAuth: firebase.User | null) => set(state => ({ userAuth: userAuth })),
  setUser: (_user: UserStore) => set(state => ({ user: {auth: _user.auth, data: _user.data, blogs: _user.blogs} })),
  setUserLoading: (userLoading: boolean) => set(state => ({ userLoading: userLoading })),
  cache: {
    blogs: {},
    users: {},
    posts: {}
  },
  title: 'reauthor',
  addPostToCache: (post: Post) => set(state => {
    const newCache = state.cache;
    newCache.posts[post.post_slug] = post;
    return { cache: newCache };
  }),
  addBlogToCache: (blog: Blog) => set(state => {
    const newCache = state.cache;
    newCache.blogs[blog.blog_slug] = blog;
    return { cache: newCache };
  }),
  addUserToCache: (user: User) => set(state => {
    const newCache = state.cache;
    newCache.users[user.username] = user;
    return { cache: newCache };
  }),
  setTitle: (title: string) => set(state => ({ title: title })),
  doFollow: async (userIDorBlog: string, isUserFollow: boolean) => {
    const state = get();
    if (!state.user.data) return;

    if(isUserFollow){
      const followResponse = await supabase.from('user_follows').upsert({follower_user_id: state.user.data.user_id, following_user_id: userIDorBlog});
      if(followResponse.error) throw followResponse.error;
    } else {
      const followResponse = await supabase.from('blog_follows').upsert({follower_user_id: state.user.data.user_id, blog_slug: userIDorBlog});
      if(followResponse.error) throw followResponse.error;
    }

  },
  // code review: reevaluate these params
  doUnfollow: async (userIDorBlog: string, isUserFollow: boolean) => {
    const state = get();
    if (!state.user.data) return;
    // if (!(state.user.data.following.includes(usernameOrBlog))) return;

    if(isUserFollow) {
      const unfollowResponse = await supabase.from('user_follows').delete().match({follower_user_id: state.user.data.user_id, following_user_id: userIDorBlog});
      if(unfollowResponse.error) throw unfollowResponse.error;
    } else {
      const unfollowResponse = await supabase.from('blog_follows').delete().match({follower_user_id: state.user.data.user_id, blog_slug: userIDorBlog});
      if(unfollowResponse.error) throw unfollowResponse.error;
    }
  },
  getPost: async (postSlug: string) => {
    const state = get();
    if (state.cache.posts[postSlug]) return state.cache.posts[postSlug];

    const postResponse = await supabase.from('posts').select('*').eq('post_slug', postSlug);
    if(postResponse.error) throw postResponse.error;
    const post = postResponse.data[0] as Post | null;
    if (post) {
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
    const blogResponse = await supabase.from('blogs').select('*').eq('blog_slug', blogSlug);
    if (blogResponse.error) throw blogResponse.error;
    const blogData = blogResponse.data[0] as Blog | null;
    if (blogData) {
      const blog = blogData;
      state.addBlogToCache(blog);
      return blog;
    }
  },
  getUser: async (user_id: string) => {
    const state = get();
    if (state.cache.users[user_id]) return state.cache.users[user_id];
    const userResponse = await supabase.from('users').select('*').eq('user_id', user_id);
    if(userResponse.error) throw userResponse.error;
    const userData = userResponse.data[0] as User | null;
    if (userData) {
      const user = userData;
      state.addUserToCache(user);
      return user;
    }
  }
}))

