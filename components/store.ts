import { createStore, createTypedHooks, Action, action, Store, Thunk, thunk } from 'easy-peasy';
import firebase from '../firebase'
import {Blog, BlogBase, Post, User, UserBase} from './types'

interface StoreModel {
    userAuth: firebase.User | undefined,
    user: User | undefined,
    userLoading: boolean, 
    cache: {
      blogs: {[slug: string]: Blog},
      users: {[username: string]: User},
      posts: {[slug: string]: Post}
    },
    title: string,
    setUserAuth: Action<StoreModel, firebase.User | undefined>,
    setUser: Action<StoreModel, User | undefined>,
    setUserLoading: Action<StoreModel, boolean>,
    addPostToCache: Action<StoreModel, Post>,
    addBlogToCache: Action<StoreModel, Blog>,
    addUserToCache: Action<StoreModel, User>,
    setTitle: Action<StoreModel, string>,
    // are these needed?
    // removePostFromCache: Action<StoreModel, string>,
    // removeBlogFromCache: Action<StoreModel, string>,
    // removeUserFromCache: Action<StoreModel, string>,
    doFollow: Thunk<StoreModel, string, undefined, StoreModel>,
    doUnfollow: Thunk<StoreModel, string, undefined, StoreModel>,
    getPost: Thunk<StoreModel, string, undefined, StoreModel, Promise<Post | undefined>>,
    getPosts: Thunk<StoreModel, string[], undefined, StoreModel, Promise<Post | undefined>[]>,
    getBlog: Thunk<StoreModel, string, undefined, StoreModel, Promise<Blog | undefined>>,
    getUser: Thunk<StoreModel, string, undefined, StoreModel, Promise<User | undefined>>,
}

export const store = createStore<StoreModel>({
  userAuth: undefined,
  user: undefined,
  userLoading: true,
  cache: {
    blogs: {},
    users: {},
    posts: {}
  },
  title: 'reauthor',
  setUserAuth: action((state, payload) => {
    state.userAuth = payload;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setUserLoading: action((state, payload) => {
    state.userLoading = payload;
  }),
  addPostToCache: action((state, post) => {
    state.cache.posts[post.slug] = post;
  }),
  addBlogToCache: action((state, blog) => {
    state.cache.blogs[blog.slug] = blog;
    console.log('added', blog.slug, 'to cache');
  }),
  addUserToCache: action((state, user) => {
    state.cache.users[user.username] = user;
    console.log('added', user.username, 'to cache');

  }),
  setTitle: action((state, title) => {
    state.title = title;
  }),
  // code review: does this ever need to happen? like can we just always store posts lol
  // removePostFromCache: action((state, postSlug) => {
  //   if(state.postCache.posts.postSlug) {
  //     delete state.postCache.posts.postSlug;
  //   }
  // }),
  doFollow: thunk(async (actions, payload, helpers) => {
    const state = helpers.getStoreState();
    // code review: this is an error that should be handled
    if(!state.user) return;
    
    await firebase.firestore().collection('users').doc(state.user.username).set({
      following: state.user.following ? [...state.user.following, payload] : [payload]
    }, {merge: true});
    // code review: don't need to since i have a listener attached to the following state anyway
    // actions.setFollowing(state.following ? [...state.following, payload] : [payload]);
  }),
  doUnfollow: thunk(async (actions, payload, helpers) => {
    const state = helpers.getStoreState();
    // if not following anyone or somehow trying to unfollow someone you don't follow, return
    if(!state.user) return;
    if(!(state.user.following.includes(payload))) return;

    await firebase.firestore().collection('users').doc(state.user.username).set({
      following: state.user.following.filter(blog => blog !== payload)
    }, {merge: true});
  }),
  getPost: thunk(async (actions, postSlug, helpers) => {
    const state = helpers.getStoreState();
    if(state.cache.posts[postSlug]) return state.cache.posts[postSlug];

    const postRef = await firebase.firestore().collectionGroup('posts').where('slug', '==', postSlug).get();
    if(postRef.docs.length > 0) {
      const post = postRef.docs[0].data() as Post;
      actions.addPostToCache(post);
      return post;
    }

    // throw Error('Tried to get a post that doesn\'t exist');
    return undefined;
  }),
  getPosts: thunk((actions, postSlugs, helpers) => {
    const posts = postSlugs.map(async (slug) => await actions.getPost(slug));
    return posts;
  }),
  getBlog: thunk(async (actions, blogSlug, helpers) => {
    const state = helpers.getStoreState();
    if(state.cache.blogs[blogSlug]) return state.cache.blogs[blogSlug];
    const blogRef = await firebase.firestore().collection('blogs').doc(blogSlug).get();
    const blogData = blogRef.data();
    if(blogRef.exists && blogData) {
      const blog = {slug: blogSlug, ...blogData as BlogBase};
      actions.addBlogToCache(blog);
      return blog;
    }
  }),
  getUser: thunk(async (actions, username, helpers) => {
    const state = helpers.getStoreState();
    if(state.cache.users[username]) return state.cache.users[username];
    const userRef = await firebase.firestore().collection('users').doc(username).get();
    const userData = userRef.data();
    if(userRef.exists && userData) {
      const user = {username: username, ...userData as UserBase};
      actions.addUserToCache(user);
      return user;
    }
  }),
});


const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;