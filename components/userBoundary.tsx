import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "./store";
import firebase from '../firebase'


interface UserBoundaryProps {
    children: React.ReactNode,
    onUserLoaded?: (user: firebase.User | undefined, username: string | undefined) => void,
}

export function UserBoundary(props: UserBoundaryProps) {

    const user = useStoreState(state => state.user);
    const username = useStoreState(state => state.username);
    const userLoading = useStoreState(state => state.userLoading);

    useEffect(() => {
        if(userLoading) return;
        props.onUserLoaded && props.onUserLoaded(user, username);
    }, [user, username, userLoading])

    if (userLoading) return null;


    return <>{props.children}</>;
}