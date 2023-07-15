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
import { usePathname, useRouter, useParams, useSearchParams } from "next/navigation";
import { ErrorAlertUI } from "@/ui/error";

export default function Nav(props: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const { children, ...rest } = props;
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const session = useStore(state => state.session);
  const errors = useStore(state => state.errors);
  const removeErrorAtIndex = useStore(state => state.removeErrorAtIndex);
  const pathname = usePathname();

  const handleSignUp = () => {
    setIsSignUp(true);
    setOpenLoginModal(true);
  };

  const handleLogIn = () => {
    setIsSignUp(false);
    setOpenLoginModal(true);
  };

  return (
    <>
      <div {...rest} className={`${styles.nav} ${rest.className || ''}`}>
        <Link href="/" style={{ color: 'inherit' }}>
          <h2 style={{ margin: '10px 0' }}>reauthor</h2>
        </Link>
        <ClientBoundary>
          <span className={styles.navRight}>

            {/* if there is no user session, show get started button */}
            <If value={!session && !pathname.includes('/login')}>
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

      <ErrorAlertUI errors={errors} removeIndex={(index) => removeErrorAtIndex(index)} />
    </>
  );
}
