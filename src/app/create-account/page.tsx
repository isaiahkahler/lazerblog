"use client";

import { useStore } from "@/data/store";
import { Database } from "@/types/database";
import Button, { InputButton } from "@/ui/button";
import Container from "@/ui/container";
import { ErrorAlertUI, ErrorMessage } from "@/ui/error";
import Input, { InputContainer, InputLabel, InputInvalidMessage } from "@/ui/input";
import Layout from "@/ui/layout";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string,
  username: string,
};

let typingDelayTimeout: NodeJS.Timeout | null = null;

export default function CreateAccount() {
  const session = useStore(state => state.session);
  const user = useStore(state => state.user);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const addError = useStore(state => state.addError);

  // if user data is present, send back to home (account is created)
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [router, user]);

  // if no user session, send back to home (not logged in)
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [router, session]);

  // create the new user 
  const createNewUser = async (values: Inputs) => {
    if(!session) return;
    try {
      const {data, error} = await supabase.from('users').insert({id: session.user.id, name: values.name, username: values.username});
      if(error) throw error;
    } catch (e: any) {
      console.error('couldn\'t insert user ');
      // setError(e);
      addError(e)
      console.error(e);
    }
  };

  return (
    <Layout>
      <Container>
        <CreateAccountUI onSubmit={createNewUser} />
      </Container>
    </Layout>
  );
}

interface CreateAccountUIProps {
  onSubmit: (values: Inputs) => void
}

function CreateAccountUI(props: CreateAccountUIProps) {
  const { onSubmit } = props;
  const supabase = createClientComponentClient();

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const validateUsernameInput: (value: string) => Promise<string | true> = async (value: string) => {
    if (typingDelayTimeout) {
      clearTimeout(typingDelayTimeout);
    }

    return new Promise((resolve) => {
      typingDelayTimeout = setTimeout(async () => {
        try {
          if (value) {
            console.log(`checking if username ${value} is taken`);
            const { data, error } = await supabase.from('users').select('username').eq('username', value);
            if (error) throw error;
            if (!data) {
              resolve('An error occurred checking for that username. Try again in a moment.');
              return;
            };
            // if we have a result, it's taken
            if (data.length !== 0) {
              resolve('The username is not available.');
            } else {
              resolve(true);
            }
          } else {
            resolve(true);
          }
        } catch (error) {
          console.error('An error occurred checking if username exists:')
          console.error(error)
          resolve('An error occurred checking for that username. Try again in a moment.');
        }
      }, 500);
    })
  }


  return (
    <Layout>
      <Container>
        <h1>Create Your Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <InputContainer >
            <Input id='name' placeholder=" " {...register("name",
              {
                required: { value: true, message: 'Provide your name' },
                minLength: { value: 1, message: 'Provide your name' },
                maxLength: { value: 50, message: 'Name cannot be longer than 50 characters' }
              }
            )} />
            <InputLabel htmlFor="name">Your Name</InputLabel>
          </InputContainer>
          <InputInvalidMessage invalid={!!errors.name}>{errors.name?.message}</InputInvalidMessage>


          <InputContainer >
            <Input id='username' placeholder=" " {...register("username", {
              validate: {
                required: v => !!v || 'Please pick a username',
                minLength: v => (!!v && v.length >= 2) || 'Username must be at least 2 characters',
                maxLength: v => (!!v && v.length <= 16) || 'Username must be at most 16 characters',
                pattern: v => (!!v && /^(\w){1,15}$/.test(v)) || 'Username must consist of only letters, numbers, and underscores',
                taken: v => validateUsernameInput(v),
              }
            })} />
            <InputLabel htmlFor="username">Username</InputLabel>
          </InputContainer>
          <InputInvalidMessage invalid={!!errors.username}>{errors.username?.message}</InputInvalidMessage>


          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <InputButton type='submit' hasColor value='continue' />
          </span>
        </form>
      </Container>
    </Layout>
  );
}