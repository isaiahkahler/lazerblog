import { useStore } from "@/data/store";
import { Database } from "@/types/database";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuthStateListener() {
  const supabase = createClientComponentClient<Database>();
  const setSession = useStore(state => state.setSession);
  const setUser = useStore(state => state.setUser);
  const session = useStore(state => state.session);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((response, session) => {
      console.log('auth state change', response)
      setSession(session)

    })

    return () => subscription && subscription.unsubscribe();
  }, [router, setSession, supabase.auth]);

  useEffect(() => {
    if (!session) {
      setUser(null);
      return () => {};
    };
    if (!session.user) {
      setUser(null);
      return () => {};
    };

    // get the user data once, initially
    (async () => {
      const { data, error } = await supabase.from('users').select('*').eq('id', session.user.id).limit(1);
      if (error) throw error;
      if (!data) return;
      if (data.length === 1) {
        console.log('set data to:', data[0])
        setUser(data[0]);
      } else {
        console.log('set data to NULL')
        setUser(null);
      }

    })();

    // subscribe to changes to our user data
    console.log('subscribed to user id', session.user.id)
    const channel = supabase
      .channel('changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log(`payload: ${JSON.stringify(payload)}`);
          setUser(payload.new as any);
        }
      )
      .subscribe();

      return () => channel.unsubscribe();


  }, [session, setUser, supabase]);
}