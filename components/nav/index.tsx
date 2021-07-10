import styles from './nav.module.css'
import firebase from '../../firebase/clientApp'
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
                    location.reload();
                });
            }}><h3>sign out</h3></Button></span> : undefined}
        </div>
    );
}