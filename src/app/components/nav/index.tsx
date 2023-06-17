"use client";
import Link from "next/link";
import { HTMLProps, PropsWithChildren, useEffect, useState } from "react";
import styles from './nav.module.css';
import Button from "@/ui/button";
import { useStore } from "@/data/store";
import Modal from "@/ui/modal";
import Login from "../login";
import If from "@/ui/if";
import AccountMenu from "./components/accountMenu";
import ClientBoundary from "@/ui/clientBoundary";
import { useRouter } from "next/navigation";

export default function Nav(props: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const { children, ...rest } = props;
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const user = useStore(state => state.user);
  const session = useStore(state => state.session);

  const router = useRouter();

  const handleSignUp = () => {
    setIsSignUp(true);
    setOpenLoginModal(true);
  };

  const handleLogIn = () => {
    setIsSignUp(false);
    setOpenLoginModal(true);
  };

  // redirect to account creation if not yet finished
  useEffect(() => {
    if (session && !user) {
      console.log('REDIRECT!')
      router.push('/create-account');
    }
  }, [router, session, user]);

  return (
    <>
      <div {...rest} className={`${styles.nav} ${rest.className || ''}`}>
        <Link href="/" style={{ color: 'inherit' }}>
          <h2 style={{ margin: '10px 0' }}>reauthor</h2>
        </Link>
        <ClientBoundary>
          <span className={styles.navRight}>

            {/* if there is no user session, show get started button */}
            <If value={!session}>
              <Button hasColor onClick={handleSignUp}><p>Get Started</p></Button>
            </If>

            {/* account menu */}
            <span>
              <AccountMenu onLogin={handleLogIn} onSignUp={handleSignUp} />
            </span>
            
          </span>
        </ClientBoundary>
      </div>
      <Modal open={openLoginModal && !session} onClose={() => setOpenLoginModal(false)} style={{ maxWidth: 'min(90vw, 400px)', width: '100%' }}>
        <Login signUp={isSignUp} />
      </Modal>
    </>
  );
}
