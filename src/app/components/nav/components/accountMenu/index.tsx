"use client";

import { IconButton } from "@/ui/button";
import Icon from "@mdi/react";
import { mdiAccount, mdiAccountPlus, mdiChevronDown, mdiExitToApp, mdiHome, mdiLoginVariant, mdiPencilPlus, mdiPostOutline } from "@mdi/js";
import If from "@/ui/if";
import Dropdown, { DropdownItemLink, DropdownItemSpan } from "@/ui/dropdown";
import { useState } from "react";
import { useStore } from "@/data/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from './accountMenu.module.css'

interface AccountMenuProps {
  onLogin: () => void,
  onSignUp: () => void,
}

export default function AccountMenu(props: AccountMenuProps) {
  const { onLogin, onSignUp } = props;
  const [openDropdown, setOpenDropdown] = useState(false);
  const session = useStore(state => state.session);
  const user = useStore(state => state.user);
  const supabase = createClientComponentClient();

  const closeDropdown = () => setOpenDropdown(false);

  const handleSignOut = () => {
    supabase.auth.signOut();
    closeDropdown();
  };

  const handleLogIn = () => {
    closeDropdown();
    onLogin();
  };

  const handleSignUp = () => {
    closeDropdown();
    onSignUp();
  };

  return (
    <>
      <IconButton onClick={() => setOpenDropdown(!openDropdown)}>
        <Icon path={mdiAccount} color='rgba(0,0,0,.4)' size={1.2} />
        <Icon path={mdiChevronDown} color='rgba(0,0,0,.4)' size={1} />
      </IconButton>
      <If value={openDropdown}>
        <Dropdown onClickAway={() => setOpenDropdown(false)}>

          {/* if there user data, show a home button */}
          <If value={user}>
            <DropdownItemLink href='/feed' leftIcon={<Icon path={mdiHome} size={1} />}>Home</DropdownItemLink>
          </If>

          {/* if there user data, show a profile button */}
          <If value={user}>
            <DropdownItemLink href='/feed' leftIcon={<Icon path={mdiAccount} size={1} />}>Profile</DropdownItemLink>
          </If>

          {/* if there user data, show a blogs button */}
          <If value={user}>
            <DropdownItemSpan href='/feed' leftIcon={<Icon path={mdiPostOutline} size={1} />}>Blogs</DropdownItemSpan>
          </If>

          {/* if there user data, show a new post button */}
          <If value={user}>
            <DropdownItemSpan href='/feed' leftIcon={<Icon path={mdiPencilPlus} size={1} />}>Write something</DropdownItemSpan>
          </If>

          {/* if there is a user session, show a sign out button */}
          <If value={session}>
            <DropdownItemSpan leftIcon={<Icon path={mdiExitToApp} size={1} />} onClick={handleSignOut}>Sign Out</DropdownItemSpan>
          </If>

          {/* if there is no user session, show log in and sign up buttons */}
          <If value={!session}>
            <span className={styles.horizontalButtonContainer}>
              <DropdownItemSpan leftIcon={<Icon path={mdiLoginVariant} size={1} />} onClick={handleLogIn}>Log In</DropdownItemSpan>
              <DropdownItemSpan leftIcon={<Icon path={mdiAccountPlus} size={1} />} onClick={handleSignUp}>Sign Up</DropdownItemSpan>
            </span>
          </If>
        </Dropdown>
      </If>
    </>
  );
}



// {userData && <>
//   <DropdownItemLink href={`/users/${userData.username}`} leftIcon={<IconButton><Icon path={mdiAccount} size={1} /></IconButton>} onClick={() => {
//     // router.push(`/users/${user.username}`);
//     setOpenDropdown(false);
//   }}>
//     <div>
//       <div>{userData.name}</div>
//       <div>@{userData.username}</div>
//     </div>
//   </DropdownItemLink>
//   {/* <If value={blogs && blogs.length > 1}>
//     <DropdownItem leftIcon={<IconButton><BlogIcon size='30px' /></IconButton>} onClick={() => {
//       // setOpenDropdown(false);
//       // console.log('blogs length', blogs?.length);
//       if (blogsDropdown) {
//         setBlogsDropdown(false)
//       } else {
//         setBlogsDropdown(true)
//       }
//     }}>
//       {!blogsDropdown ? 'View your blogs' : 'Hide blogs'}
//     </DropdownItem>
//   </If>
//   <If value={blogsDropdown}>
//     {blogs && blogs.filter(blog => !blog.blog_slug.includes('users/')).map(blog => <div key={blog.blog_slug} style={{ marginLeft: '1rem' }}>
//       <DropdownItem href={`/${blog.blog_slug}`} leftIcon={<IconButton><BlogIcon size='30px' /></IconButton>} onClick={() => {
//         router.push('/' + blog.blog_slug);
//         setOpenDropdown(false);
//       }}>
//         {blog.name}
//       </DropdownItem>
//     </div>)}
//   </If> */}
//   <DropdownItemLink href='/new-post' leftIcon={<IconButton><Icon path={mdiPencil} size={1} /></IconButton>} onClick={() => {
//     // router.push('/new-post');
//     setOpenDropdown(false);
//   }}>
//     Write a new post
//   </DropdownItemLink>
//   <DropdownItemLink href='/create-blog' leftIcon={<IconButton><Icon path={mdiPlusBoxMultipleOutline} size={1} /></IconButton>} onClick={() => {
//     // router.push('/new-post');
//     setOpenDropdown(false);
//   }}>
//     Create a new blog
//   </DropdownItemLink>
//   <DropdownItemSpan leftIcon={<IconButton><Icon path={mdiExitToApp} size={1} /></IconButton>} onClick={() => {
//     // supabase.auth.signOut().then(() => {
//     //   setOpenDropdown(false);
//     // });
//   }}>
//     Sign out
//   </DropdownItemSpan>
// </>}

// <If.not value={userData}>
//   <If.not value={user}>
//     <DropdownItem href='/login' leftIcon={<Icon path={mdiAccount} size={1.2} />}>
//       <div>
//         Sign In or Sign Up
//       </div>
//     </DropdownItem>
//   </If.not>
//   <If value={user}>
//     <DropdownItem href='/create-profile' leftIcon={<Icon path={mdiAccount} size={1.2} />}>
//       <div>
//         Finish signing up
//       </div>
//     </DropdownItem>
//     <DropdownItem leftIcon={<Icon path={mdiExitToApp} size={1.2} />} onClick={() => {
//       // firebase.auth().signOut().then(() => {
//       //     setOpenDropdown(false);
//       // })
//       // supabase.auth.signOut();
//     }}>
//       <div>
//         Sign out
//       </div>
//     </DropdownItem>
//   </If>
// </If.not>