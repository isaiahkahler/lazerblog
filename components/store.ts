import { createStore, createTypedHooks, Action, action, Store } from 'easy-peasy';
import firebase from '../firebase'

interface StoreModel {
    user: firebase.User | undefined,
    username: string | undefined,
    blogs: string[] | undefined,
    userLoading: boolean, 
    setUser: Action<StoreModel, firebase.User | undefined>
    setUsername: Action<StoreModel, string | undefined>,
    setBlogs: Action<StoreModel, string[] | undefined>
    setUserLoading: Action<StoreModel, boolean>
}

export const store = createStore<StoreModel>({
  user: undefined,
  username: undefined,
  blogs: undefined,
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
  setUserLoading: action((state, payload) => {
    state.userLoading = payload;
  })
});


const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;