import styles from './nav.module.css'
// import firebase from '../../firebase'
import Button, { IconButton } from '../button'
import { useRouter } from 'next/router'
import { useStore } from '../../data/store'
import UserIcon from '../icons/userIcon'
import { MutableRefObject, useCallback, useRef, useState } from 'react'
import PencilIcon from '../icons/PencilIcon'
import LogoutIcon from '../icons/logoutIcon'
import { useEffect } from 'react'
import SettingsIcon from '../icons/settingsIcon'
import Link from 'next/link'
import If from '../../components/if'
import PlusBoxMultipleOutlineIcon from '../icons/plusBoxMultipleOutlineIcon'
import MenuIcon from '../icons/menuIcon'
import { supabase } from '@supabase'
import BlogIcon from '@components/icons/blogIcon'
import { Blog } from '@data/types'



interface NavProps {

}

export default function Nav(props: NavProps) {
    // const userAuth = useStore(state => state.userAuth);
    const user = useStore(state => state.user);
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState(false);
    // const [blogsDropdown, setBlogsDropdown] = useState<Blog[]>([]);
    const [blogsDropdown, setBlogsDropdown] = useState(false);

    // const blogAppear = (first: boolean) => {
    //     setTimeout(() => {
    //         if(!user.blogs) return;
    //         if(blogsDropdown.length + 1 !== user.blogs.length) {
    //             setBlogsDropdown([...blogsDropdown, user.blogs[blogsDropdown.length + 1]]);
    //             blogAppear(false);
    //         }
    //     }, first ? 0 : 250)
    // }

    // const blogDisappear = (first: boolean) => {
    //     setTimeout(() => {
    //         if(!user.blogs) return;
    //         if(blogsDropdown.length !== 0) {
    //             console.log('sliced', [...blogsDropdown.slice(0, blogsDropdown.length - 1)])
    //             setBlogsDropdown([...blogsDropdown.slice(0, blogsDropdown.length - 1)]);
    //             blogDisappear(false);
    //         }
    //     }, first ? 0 : 250)
    // }

    return (
        <div className={styles.nav}>
            <Link href="/">
                <a style={{ color: 'inherit' }}>
                    <h2 style={{ margin: '10px 0' }}>reauthor</h2>
                </a>
            </Link>
            <span>
                <IconButton onClick={() => setOpenDropdown(!openDropdown)}>
                    <MenuIcon size={'30px'} color={"#aaa"} />
                </IconButton>
                <If value={openDropdown}>
                    <Dropdown onClickAway={() => setOpenDropdown(false)}>
                        {user.data && <>
                            <DropdownItem href={`/users/${user.data.username}`} leftIcon={<IconButton><UserIcon size='30px' /></IconButton>} onClick={() => {
                                // router.push(`/users/${user.username}`);
                                setOpenDropdown(false);
                            }}>
                                <div>
                                    <div>{user.data.name}</div>
                                    <div>@{user.data.username}</div>
                                </div>
                            </DropdownItem>
                            <If value={user.blogs && user.blogs.length > 1}>
                                <DropdownItem leftIcon={<IconButton><BlogIcon size='30px' /></IconButton>} onClick={() => {
                                    // setOpenDropdown(false);
                                    // console.log('blogs length', user.blogs?.length);
                                    if (blogsDropdown) {
                                        setBlogsDropdown(false)
                                    } else {
                                        setBlogsDropdown(true)
                                    }
                                }}>
                                    {!blogsDropdown ? 'View your blogs' : 'Hide blogs'}
                                </DropdownItem>
                            </If>
                            <If value={blogsDropdown}>
                                {user.blogs && user.blogs.filter(blog => !blog.blog_slug.includes('users/')).map(blog => <div key={blog.blog_slug} style={{marginLeft: '1rem'}}>
                                    <DropdownItem href={`/${blog.blog_slug}`} leftIcon={<IconButton><BlogIcon size='30px' /></IconButton>} onClick={() => {
                                        router.push('/' + blog.blog_slug);
                                        setOpenDropdown(false);
                                    }}>
                                        {blog.name}
                                    </DropdownItem>
                                </div>)}
                            </If>
                            <DropdownItem href='/new-post' leftIcon={<IconButton><PencilIcon size='30px' /></IconButton>} onClick={() => {
                                // router.push('/new-post');
                                setOpenDropdown(false);
                            }}>
                                Write a new post
                            </DropdownItem>
                            <DropdownItem href='/create-blog' leftIcon={<IconButton><PlusBoxMultipleOutlineIcon size='30px' /></IconButton>} onClick={() => {
                                // router.push('/new-post');
                                setOpenDropdown(false);
                            }}>
                                Create a new blog
                            </DropdownItem>
                            <DropdownItem leftIcon={<IconButton><LogoutIcon size='30px' /></IconButton>} onClick={() => {
                                supabase.auth.signOut().then(() => {
                                    setOpenDropdown(false);
                                });
                            }}>
                                Sign out
                            </DropdownItem>
                        </>}

                        <If.not value={user.data}>
                            <If.not value={user.auth}>
                                <DropdownItem href='/login' leftIcon={<UserIcon size={'38px'} />}>
                                    <div>
                                        Sign In or Sign Up
                                    </div>
                                </DropdownItem>
                            </If.not>
                            <If value={user.auth}>
                                <DropdownItem href='/create-profile' leftIcon={<UserIcon size={'38px'} />}>
                                    <div>
                                        Finish signing up
                                    </div>
                                </DropdownItem>
                                <DropdownItem leftIcon={<LogoutIcon size={'38px'} />} onClick={() => {
                                    // firebase.auth().signOut().then(() => {
                                    //     setOpenDropdown(false);
                                    // })
                                    supabase.auth.signOut();
                                }}>
                                    <div>
                                        Sign out
                                    </div>
                                </DropdownItem>
                            </If>
                        </If.not>
                    </Dropdown>
                </If>
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
    href?: string
}

function DropdownItem({ onClick: onClick, leftIcon, rightIcon, children, href }: DropdownItemProps) {
    const LeftIcon = leftIcon ? () => leftIcon : () => null;
    const RightIcon = rightIcon ? () => rightIcon : () => null;
    return (
        <>
            {href && <Link href={href} passHref>
                <span className={styles["menu-item"]} onClick={onClick}>
                    {LeftIcon && <span style={{ marginRight: '8px' }}><LeftIcon /></span>}
                    {children}
                    {RightIcon && <span style={{ marginLeft: '8px' }}><RightIcon /></span>}
                </span>
            </Link>}
            {!href && <span className={styles["menu-item"]} onClick={onClick}>
                {LeftIcon && <span style={{ marginRight: '8px' }}><LeftIcon /></span>}
                {children}
                {RightIcon && <span style={{ marginLeft: '8px' }}><RightIcon /></span>}
            </span>}
        </>
    );
}