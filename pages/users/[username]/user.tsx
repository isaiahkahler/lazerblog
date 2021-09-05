
import { User } from "../../../components/types"
import { TransparentButton } from "../../../components/button"
import styles from './user.module.css'
import Layout from "../../../components/layout"
import Container from "../../../components/container"
import { useStoreActions, useStoreState } from "../../../components/store"
import { useRouter } from "next/router"

interface UserProps {
    user: User,
    children?: React.ReactNode
}

// different from naming scheme to not confuse with type & variable `User`
export default function UserDisplay({ user, children }: UserProps) {
    const _user = useStoreState(state => state.user);
    const doFollow = useStoreActions(actions => actions.doFollow);
    const doUnfollow = useStoreActions(actions => actions.doUnfollow);
    const router = useRouter();
    //todo: if posts length is zero, conditionally render a skeleton
    return (
        <div id="findMe">
            <div className={styles.banner} style={{ backgroundColor: user.bannerImage ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none' }}>
                {/*  */}
                <h1>{user.firstName} {user.lastName}</h1>
                <p>@{user.username}</p>
                <p style={{ maxWidth: '680px' }}>description</p>
                {_user && (<TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                    
                    // do they want to follow, unfollow, or edit? 
                    if(user.username === _user.username) {
                        // edit profile
                        router.push('/edit-profile');
                        return;
                    }
                    if(_user.following.includes(`users/${user.username}`)) {
                        // unfollow
                        doUnfollow(`users/${user.username}`);
                        console.log('unfollow', `users/${user.username}`)
                        return;
                    } else {
                        // follow
                        doFollow(`users/${user.username}`);
                        console.log('follow', `users/${user.username}`)
                        return;
                    }
                }}>
                    {user.username === _user.username ? <p>edit profile</p> : _user.following.includes(`users/${user.username}`) ? <p>unfollow</p> : <p>follow</p>}
                </TransparentButton>)}

                {!user && <TransparentButton onClick={() => {
                    // code review / todo: add redirect 
                    router.push('/login');
                }}><p>sign in to follow</p></TransparentButton>}
            </div>
            <Layout>
                <Container>
                    {children}
                </Container>
            </Layout>
        </div>
    );
}