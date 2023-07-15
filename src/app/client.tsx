"use client";
import { useStore } from "@/data/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function HomeClient() {

  const session = useStore(state => state.session);
  const user = useStore(state => state.user);
  const router = useRouter();
  const userLoading = useStore(state => state.userLoading);

  // redirect to account creation if not yet finished
  useEffect(() => {
    if (!userLoading && session && !user) {
      console.log('REDIRECT!?')
      router.push('/create-account');
    }
  }, [router, session, user, userLoading]);

  return (
    <>
    </>
  );
}