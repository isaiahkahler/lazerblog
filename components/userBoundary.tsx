import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "./store";
import firebase from '../firebase'


interface UserBoundaryProps {
    children: React.ReactNode,
    onUserLoaded?: (user: firebase.User | undefined, username: string | undefined, blogs: string[] | undefined) => void,
}

export function UserBoundary(props: UserBoundaryProps) {

    const user = useStoreState(state => state.user);
    const username = useStoreState(state => state.username);
    const blogs = useStoreState(state => state.blogs);
    const userLoading = useStoreState(state => state.userLoading);

    useEffect(() => {
        // console.log('user boundary effect')
        if(userLoading) return;
        props.onUserLoaded && props.onUserLoaded(user, username, blogs);
    }, [user, username, blogs, userLoading])

    // code review: make this prettier / cooler 
    if (userLoading) return <p>userLoading</p>;


    return <>{props.children}</>;
}