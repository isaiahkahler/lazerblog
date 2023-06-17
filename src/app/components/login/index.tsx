"use client";
import Button from "@/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from '@supabase/auth-ui-react';
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import buttonStyles from '@/ui/button/button.module.css'
import inputStyles from '@/ui/input/input.module.css'
import styles from './login.module.css'
import animations from '@/styles/animations.module.css'
import Link from "next/link";

interface LoginProps {
  signUp?: boolean
}

export default function Login(props: LoginProps) {
  const {signUp} = props;
  const supabase = createClientComponentClient();

  return (
    <>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {signUp ? <h2>Sign Up</h2> : <h2>Log In</h2>}
        <Auth
          view={signUp ? "sign_up" : "sign_in"}
          supabaseClient={supabase}
          providers={['google', 'apple']}
          
          appearance={{
            theme: ThemeSupa, extend: false, className: {
              button: `${buttonStyles.button} ${styles.button}`,
              input: `${inputStyles.input} ${styles.input}`,
              label: `${styles.label}`,
              message: `${animations.shake} ${styles.invalidLabel}`,
              anchor: `${styles.anchor}`
            }
          }}
        />
        <footer style={{marginTop: '1rem', fontWeight: 'lighter'}}>By signing up you agree to Reauthor&apos;s <Link href='/tos'>terms of service</Link> and <Link href='privacy-policy'>privacy policy</Link>.</footer>
      </div>
    </>
  );
}