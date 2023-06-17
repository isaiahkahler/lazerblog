import { useEffect, useState } from "react";
import { useStore } from "../data/store";
import { UserStore } from "@data/types";


interface UserBoundaryProps {
    children: React.ReactNode,
    onUserLoaded?: (userStore: UserStore) => void,
    precondition?: (userStore: UserStore) => true | (() => void),
}

export function UserBoundary({ children, onUserLoaded, precondition }: UserBoundaryProps) {
    // const userAuth = useStore(state => state.userAuth);
    const user = useStore(state => state.user);
    const userLoading = useStore(state => state.userLoading);
    const [initial, setInitial] = useState(true);
  
  
    useEffect(() => {
      if (userLoading) return;
      if(initial && precondition) {
        const result = precondition(user);
        if (typeof (result) === 'function') {
          result();
        }
        setInitial(false);
      }
      // console.log('on user loaded of user boundary')
      onUserLoaded && onUserLoaded(user);
    }, [user, userLoading, onUserLoaded, precondition, initial, setInitial]);
  
    // code review: make this loading screen better
    if (userLoading) return <>user loading...</>;
    if (precondition && initial) return <>waiting for precondition</>;
  
    return (
      <>
        {children}
      </>
    )
  }
  