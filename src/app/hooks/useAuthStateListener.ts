import { useStore } from "@/data/store";
import { Database } from "@/types/database";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuthStateListener () {
  const supabase = createClientComponentClient<Database>();
  const setSession = useStore(state => state.setSession);
  const setUser = useStore(state => state.setUser);
  const session = useStore(state => state.session);
  const router = useRouter();

  useEffect(() => {
    console.log('set listener')
    const {data: {subscription}} = supabase.auth.onAuthStateChange((response, session) => {
      console.log('auth state change', response)
      console.log('session:', session)
      setSession(session)

    })

    return () => subscription && subscription.unsubscribe();
  }, [router, setSession, supabase.auth]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    console.log('updating user because session changed');

    (async () => {
      const {data, error} = await supabase.from('users').select('*').eq('id', session.user.id).limit(1);
      if (error) throw error;
      if (!data) return;
      console.log('the user data:', data)
      if (data.length === 1){
        setUser(data[0]);
      }

    })();

  }, [session, setUser, supabase]);
}