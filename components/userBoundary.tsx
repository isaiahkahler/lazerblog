import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "./store";
import firebase from '../firebase'
import { User } from "./types";


interface UserBoundaryProps {
    children: React.ReactNode,
    onUserLoaded?: (userAuth: firebase.User | undefined, user: User | undefined) => void,
}

export function UserBoundary(props: UserBoundaryProps) {

    const userAuth = useStoreState(state => state.userAuth);
    const user = useStoreState(state => state.user);
    // const username = useStoreState(state => state.username);
    const userLoading = useStoreState(state => state.userLoading);

    useEffect(() => {
        console.log('user loading?', userLoading)
        if(userLoading) return;
        props.onUserLoaded && props.onUserLoaded(userAuth, user);
    }, [userLoading, user, props, userAuth])

    // code review: make this prettier / cooler 
    if (userLoading) return <p>userLoading</p>;


    return <>{props.children}</>;
}