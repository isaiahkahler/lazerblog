import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "./store";
import firebase from '../firebase'
import { User } from "./types";


interface UserBoundaryProps {
    children: React.ReactNode,
    onUserLoaded?: (userAuth: firebase.User | null, user: User | null) => void,
}

export function UserBoundary({children, onUserLoaded}: UserBoundaryProps) {

    const userAuth = useStore(state => state.userAuth);
    const user = useStore(state => state.user);
    const userLoading = useStore(state => state.userLoading);

    useEffect(() => {
        if(userLoading) return;
        onUserLoaded && onUserLoaded(userAuth, user);
    }, [userLoading, user, onUserLoaded, userAuth])

    // code review: make this prettier / cooler 
    if (userLoading) return <p>userLoading</p>;


    return <>{children}</>;
}