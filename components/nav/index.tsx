import styles from './nav.module.css'
import firebase from '../../firebase'
import Button from '../button'
import { useAuthState } from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'


interface NavProps {

}

export default function Nav(props: NavProps) {
    const [user, userLoading, userError] = useAuthState(firebase.auth());
    const router = useRouter();

    return (
        <div className={styles.nav}>
            <h2>Lazer Blog</h2>
            {user ? <span><Button onClick={() => {
                firebase.auth().signOut().then(() => {
                    // code review: does this cause problems when a page controls its own navigation?
                    // e.g. will the page get redirected and then be reloaded unnecessarily? 
                    location.reload();
                });
            }}><h3>sign out</h3></Button></span> : undefined}
        </div>
    );
}