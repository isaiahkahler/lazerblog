"use client";

import { useStore } from "@/data/store";
import { createClientComponentClient, Session, User } from "@supabase/auth-helpers-nextjs";
import { PropsWithChildren, useEffect, useState } from "react";

interface UserBoundaryProps {
  onlySession?: boolean
}

const UserBoundary = (props: PropsWithChildren<UserBoundaryProps>) =>  {
  const { onlySession, children } = props;
  // const session = useStore(state => state.session);
  // const user = useStore(state => state.user);
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const {data: _session, error: sessionError} = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setSession(_session.session);
    })();
  }, [supabase.auth]);

  useEffect(() => {
    (async () => {
      const {data: _user, error: userError} = await supabase.auth.getUser();
      if (userError) throw userError;
      setUser(_user.user);
    })();
  }, [supabase.auth]);

  supabase.auth.getUser();

  let meetsConditions = !!session && !!user;

  if (onlySession) {
    meetsConditions = !!session;
  }

  if (meetsConditions) {
    return <>{children}</>;
  }

  return <></>;

}

UserBoundary.Not = function Not(props: PropsWithChildren<UserBoundaryProps>) {
  const { onlySession, children } = props;
  const session = useStore(state => state.session);
  const user = useStore(state => state.user);

  let meetsConditions = !!session && !!user;

  if (onlySession) {
    meetsConditions = !!session;
  }

  if (!meetsConditions) {
    return <>{children}</>;
  }

  return <></>;
}

export default UserBoundary;