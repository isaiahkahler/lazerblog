import styles from './nav.module.css'
import firebase from '../../firebase'
import Button, { IconButton } from '../button'
import { useRouter } from 'next/router'
import { useStore } from '../store'
import UserIcon from '../icons/userIcon'
import { MutableRefObject, useCallback, useRef, useState } from 'react'
import PencilIcon from '../icons/PencilIcon'
import LogoutIcon from '../icons/logoutIcon'
import { useEffect } from 'react'
import SettingsIcon from '../icons/settingsIcon'
import Link from 'next/link'
import If from '../../components/if'
import PlusBoxMultipleOutlineIcon from '../icons/plusBoxMultipleOutlineIcon'



interface NavProps {

}

export default function Nav(props: NavProps) {
    const user = useStore(state => state.user);
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState(false);



    return (
        <div className={styles.nav}>
            <Link href="/">
                <a style={{ color: 'inherit' }}>
                    <h2 style={{ margin: '10px 0' }}>reauthor</h2>
                </a>
            </Link>
            <span>
                <IconButton onClick={() => setOpenDropdown(!openDropdown)}>
                    <UserIcon size={'30px'} color={"#aaa"} />
                </IconButton>
                <If value={openDropdown}>
                    {/* <ClickAwayListener onClickAway={() => setOpenDropdown(false)}> */}
                    <Dropdown onClickAway={() => setOpenDropdown(false)}>
                        {user && <>
                            <Link href={`/users/${user.username}`} passHref>
                                <DropdownItem leftIcon={<IconButton><UserIcon size='30px' /></IconButton>} onClick={() => {
                                    // router.push(`/users/${user.username}`);
                                    setOpenDropdown(false);
                                }}>
                                    <div>
                                        <div>{user.firstName} {user.lastName}</div>
                                        <div>@{user.username}</div>
                                    </div>
                                </DropdownItem>
                            </Link>
                            <Link href='/new-post' passHref>
                                <DropdownItem leftIcon={<IconButton><PencilIcon size='30px' /></IconButton>} onClick={() => {
                                    // router.push('/new-post');
                                    setOpenDropdown(false);
                                }}>
                                    Write a new post
                                </DropdownItem>
                            </Link>
                            <Link href='/create-blog' passHref>
                                <DropdownItem leftIcon={<IconButton><PlusBoxMultipleOutlineIcon size='30px' /></IconButton>} onClick={() => {
                                    // router.push('/new-post');
                                    setOpenDropdown(false);
                                }}>
                                    Create a new blog
                                </DropdownItem>
                            </Link>
                            {/* <DropdownItem leftIcon={<IconButton><SettingsIcon size='30px' /></IconButton>} onClick={() => {

                    }}>
                        Settings
                    </DropdownItem> */}
                            <DropdownItem leftIcon={<IconButton><LogoutIcon size='30px' /></IconButton>} onClick={() => {
                                firebase.auth().signOut().then(() => {
                                    // code review: does this cause problems when a page controls its own navigation?
                                    // e.g. will the page get redirected and then be reloaded unnecessarily? 
                                    // location.reload();
                                    setOpenDropdown(false);
                                });
                            }}>
                                Sign out
                            </DropdownItem>
                        </>}

                        <If.not value={user}>
                            <Link href='/login' passHref>
                                <DropdownItem leftIcon={<UserIcon size={'38px'} />}>
                                    <div>
                                        Sign In or Sign Up
                                    </div>
                                </DropdownItem>
                            </Link>
                        </If.not>
                    </Dropdown>
                    {/* </ClickAwayListener> */}
                </If>
                {/* {openDropdown && !user && <Dropdown>
                    
                </Dropdown>} */}
            </span>
        </div>
    );
}

interface DropdownProps {
    children?: React.ReactNode,
    onClickAway?: () => void,
}

function Dropdown({ children, onClickAway }: DropdownProps) {

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: MouseEvent) => {
        if (!dropdownRef.current) return;
        if (dropdownRef.current.contains(event.target as (Node | null))) {
            // inside click
            return;
          }
          // outside click 
          onClickAway && onClickAway();
    };

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={styles.dropdown} id="dropdown">
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

function DropdownItem({ onClick: onClick, leftIcon, rightIcon, children }: DropdownItemProps) {
    const LeftIcon = leftIcon ? () => leftIcon : () => null;
    const RightIcon = rightIcon ? () => rightIcon : () => null;
    return (
        <span className={styles["menu-item"]} onClick={onClick}>
            {LeftIcon && <span style={{ marginRight: '8px' }}><LeftIcon /></span>}
            {children}
            {RightIcon && <span style={{ marginLeft: '8px' }}><RightIcon /></span>}
        </span>
    );
}