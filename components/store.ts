import { createStore, createTypedHooks, Action, action, Store, Thunk, thunk } from 'easy-peasy';
import firebase from '../firebase'

interface StoreModel {
    user: firebase.User | undefined,
    username: string | undefined,
    blogs: string[] | undefined,
    following: string[] | undefined,
    userLoading: boolean, 
    setUser: Action<StoreModel, firebase.User | undefined>,
    setUsername: Action<StoreModel, string | undefined>,
    setBlogs: Action<StoreModel, string[] | undefined>,
    setFollowing: Action<StoreModel, string[] | undefined>,
    setUserLoading: Action<StoreModel, boolean>,
    doFollow: Thunk<StoreModel, string, undefined, StoreModel>,
    doUnfollow: Thunk<StoreModel, string, undefined, StoreModel>,
}

export const store = createStore<StoreModel>({
  user: undefined,
  username: undefined,
  blogs: undefined,
  following: undefined,
  userLoading: true,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setUsername: action((state, payload) => {
    state.username = payload;
  }),
  setBlogs: action((state, payload) => {
    state.blogs = payload;
  }),
  setFollowing: action((state, payload) => {
    state.following = payload;
  }),
  setUserLoading: action((state, payload) => {
    state.userLoading = payload;
  }),
  doFollow: thunk(async (actions, payload, helpers) => {
    const state = helpers.getStoreState();
    
    await firebase.firestore().collection('users').doc(state.username).set({
      following: state.following ? [...state.following, payload] : [payload]
    }, {merge: true});
    // code review: don't need to since i have a listener attached to the following state anyway
    // actions.setFollowing(state.following ? [...state.following, payload] : [payload]);
  }),
  doUnfollow: thunk(async (actions, payload, helpers) => {
    const state = helpers.getStoreState();
    // if not following anyone or somehow trying to unfollow someone you don't follow, return
    if(!state.following) return;
    if(!(state.following.includes(payload))) return;

    await firebase.firestore().collection('users').doc(state.username).set({
      following: state.following.filter(blog => blog !== payload)
    }, {merge: true});
  }),
});


const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;