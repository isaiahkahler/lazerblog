
import { User } from "../../../components/types"
import Button, { TransparentButton } from "../../../components/button"
import styles from '../../[blogSlug]/blog.module.css'
import Layout from "../../../components/layout"
import Container from "../../../components/container"
import { useStore } from "../../../components/store"
import { useRouter } from "next/router"
import If from '../../../components/if'
import {forwardRef} from 'react';

interface UserProps {
    user: User,
    children?: React.ReactNode
}

// different from naming scheme to not confuse with type & variable `User`
export default function UserDisplay({ user, children }: UserProps) {
    const _user = useStore(state => state.user);
    const currentUser = _user.data;
    const doFollow = useStore(state => state.doFollow);
    const doUnfollow = useStore(state => state.doUnfollow);
    const router = useRouter();
    //todo: if posts length is zero, conditionally render a skeleton
    return (
        <div id="findMe">
            <div className={styles.banner} style={{ backgroundColor: user.bannerImage ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none' }}>
                {/*  */}
                <h1>{user.firstName} {user.lastName}</h1>
                <p>@{user.username}</p>
                <If value={user.bio}>
                    <p style={{ maxWidth: '680px' }}>{user.bio}</p>
                </If>
                {/* {currentUser && (<TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {
                    
                    // do they want to follow, unfollow, or edit? 
                    if(user.username === currentUser.username) {
                        // edit profile
                        router.push('/edit-profile');
                        return;
                    }
                    if(currentUser.following.includes(`users/${user.username}`)) {
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
                    {user.username === currentUser.username ? <p>edit profile</p> : currentUser.following.includes(`users/${user.username}`) ? <p>unfollow</p> : <p>follow</p>}
                </TransparentButton>)} */}

                {/* {!user && <TransparentButton onClick={() => {
                    // code review / todo: add redirect 
                    router.push('/login');
                }}><p>sign in to follow</p></TransparentButton>} */}
            </div>
            <Layout>
                <Container>
                    <If value={currentUser && currentUser.username === user.username}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <TransparentButton onClick={() => router.push('/new-post')} style={{marginBottom: '2rem'}}>
                                <p>write a new post</p>
                            </TransparentButton>
                        </div>
                    </If>
                    {children}
                </Container>
            </Layout>
        </div>
    );
}