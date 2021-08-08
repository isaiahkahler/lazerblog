import styles from './nav.module.css'
import firebase from '../../firebase'
import Button, { IconButton } from '../button'
import {useRouter} from 'next/router'
import { useStoreState } from '../store'
import UserIcon from '../icons/userIcon'
import { useState } from 'react'
import PencilIcon from '../icons/PencilIcon'
import LogoutIcon from '../icons/logoutIcon'
import { useEffect } from 'react'
import SettingsIcon from '../icons/settingsIcon'


interface NavProps {

}

export default function Nav(props: NavProps) {
    const user = useStoreState(state => state.user);
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState(false);


    return (
        <div className={styles.nav}>
            <h2 style={{margin: '10px 0'}}>reauthor</h2>
            <span>
                <IconButton onClick={() => setOpenDropdown(!openDropdown)}>
                    <UserIcon size={'30px'} color={"#aaa"} />
                </IconButton>
                {openDropdown && user &&  <Dropdown>
                        <DropdownItem leftIcon={<IconButton><UserIcon size='30px' /></IconButton>} onClick={() => {
                            router.push(`/users/${user.username}`);
                        }}>
                            <div>
                                <div>{user.firstName} {user.lastName}</div>
                                <div>@{user.username}</div>
                            </div>
                        </DropdownItem>
                        <DropdownItem leftIcon={<IconButton><PencilIcon size='30px' /></IconButton>} onClick={() => {
                            router.push('/new-post');
                        }}>
                            Write a new post
                        </DropdownItem>
                        <DropdownItem leftIcon={<IconButton><SettingsIcon size='30px' /></IconButton>} onClick={() => {
                            
                        }}>
                            Settings
                        </DropdownItem>
                        <DropdownItem leftIcon={<IconButton><LogoutIcon size='30px' /></IconButton>} onClick={() => {
                            firebase.auth().signOut().then(() => {
                                // code review: does this cause problems when a page controls its own navigation?
                                // e.g. will the page get redirected and then be reloaded unnecessarily? 
                                location.reload();
                            });
                        }}>
                            Sign out
                        </DropdownItem>
                    </Dropdown>}
                {openDropdown && !user &&  <Dropdown>
                        <DropdownItem leftIcon={<UserIcon size={'38px'} />}>
                            <div>
                                Sign Up
                            </div>
                        </DropdownItem>
                    </Dropdown>}
            </span>
        </div>
    );
}

interface DropdownProps {
    children?: React.ReactNode
}

function Dropdown ({children}: DropdownProps) {
    return(
        <div className={styles.dropdown} id="dropdown">
            {children}
        </div>
    );
}

interface DropdownItemProps {
    onClick?: React.MouseEventHandler<HTMLAnchorElement>,
    children?: React.ReactNode,
    leftIcon?: JSX.Element,
    rightIcon?: JSX.Element,
}

function DropdownItem ({onClick: onClick, leftIcon, rightIcon, children} : DropdownItemProps) {
    const LeftIcon = leftIcon ? () => leftIcon : () => null;
    const RightIcon = rightIcon ? () => rightIcon : () => null;
    return (
        <a className={styles["menu-item"]} onClick={onClick}>
            {LeftIcon && <span style={{marginRight: '8px'}}><LeftIcon /></span>}
            {children}
            {RightIcon && <span style={{marginLeft: '8px'}}><RightIcon /></span>}
        </a>
    );
}