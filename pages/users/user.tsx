
import { User } from "../../components/types"
import { TransparentButton } from "../../components/button"
import styles from './user.module.css'
import Layout from "../../components/layout"
import Container from "../../components/container"

interface UserProps {
    user: User,
    children?: React.ReactNode
}

// different from naming scheme to not confuse with type & variable `User`
export default function UserDisplay({ user, children }: UserProps) {

    //todo: if posts length is zero, conditionally render a skeleton
    return (
        <div id="findMe">
            <div className={styles.banner} style={{ backgroundColor: user.bannerImage ? 'rgba(255, 255, 255, 0.3)' : '#eee', backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none' }}>
                {/*  */}
                <h1>{user.firstName} {user.lastName}</h1>
                <p>@{user.username}</p>
                <p style={{ maxWidth: '680px' }}>description</p>
                <TransparentButton style={{ marginBottom: '1rem' }} onClick={() => {

                }}>
                    {/* {user && user.username === props.author ? <p>edit profile</p> : user && typeof(blog) === 'string' && user.following.includes(blog) ? <p>unfollow</p> : <p>follow</p>}  */}
                    <p>follow</p>
                </TransparentButton>
            </div>
            <Layout>
                <Container>
                    {children}
                </Container>
            </Layout>
        </div>
    );
}