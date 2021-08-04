import { createStore, createTypedHooks, Action, action, Store, Thunk, thunk } from 'easy-peasy';
import firebase from '../firebase'
import {User} from './types'

interface StoreModel {
    userAuth: firebase.User | undefined,
    user: User | undefined,
    userLoading: boolean, 
    // postCache: {
    //   blogs: Blog[],
    //   users: User[],
      
    // },
    setUserAuth: Action<StoreModel, firebase.User | undefined>,
    setUser: Action<StoreModel, User | undefined>,
    setUserLoading: Action<StoreModel, boolean>,
    doFollow: Thunk<StoreModel, string, undefined, StoreModel>,
    doUnfollow: Thunk<StoreModel, string, undefined, StoreModel>,
}

export const store = createStore<StoreModel>({
  userAuth: undefined,
  user: undefined,
  userLoading: true,
  setUserAuth: action((state, payload) => {
    state.userAuth = payload;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setUserLoading: action((state, payload) => {
    state.userLoading = payload;
  }),
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
});


const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;