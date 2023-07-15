"use client";
import { useStore } from "@/data/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginComponent from "../(components)/login";

export default function LoginUI() {
  const user = useStore(state => state.user);
  const userLoading = useStore(state => state.userLoading);
  const params = useSearchParams();
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // if the user is already logged in, send to 
  useEffect(() => {
    if(userLoading) return;
    if (!user) return;
    if (redirectPath) {
      router.push(redirectPath)
    } else {
      router.push('/')
    }
  }, [user, redirectPath, router, userLoading])

  useEffect(() => {
    setRedirectPath(params.get('redirect'));
  }, [params])

  return (
    <>
      <LoginComponent hideTitle extraAuthProps={{redirectTo: redirectPath ? redirectPath : undefined }} />
    </>
  );
}