"use client";

import { useStore } from "@/data/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Modal from "@/ui/modal";
// import { useState } from "react";
import useAuthStateListener from "./hooks/useAuthStateListener";

// holds client components to render at the root layout, under the children
export default function LayoutClient() {
  useAuthStateListener();
  const session = useStore(state => state.session);
  const user = useStore(state => state.user);
  const router = useRouter();

  // redirect to account creation if not yet finished
  useEffect(() => {
    if (session && !user) {
      console.log('REDIRECT!')
      router.push('/create-account');
    }
  }, [router, session, user]);
  // const [openLoginModal, setOpenLoginModal] = useState(false);

  return (
    <>

    </>
  );
}