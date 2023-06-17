"use client";

import { useStore } from "@/data/store";
import Button, { InputButton } from "@/ui/button";
import Container from "@/ui/container";
import Input, { InputContainer, InputLabel, InputInvalidMessage } from "@/ui/input";
import Layout from "@/ui/layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string,
  username: string,
};

export default function CreateAccount() {
  const session = useStore(state => state.session);
  const user = useStore(state => state.user);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

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

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    console.log('values:', values)
  };

  const nameError = !!errors.name;
  const usernameError = !!errors.username;
  const hasErrors = nameError || usernameError;

  // errors

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
              // required: {value: true, message: 'Please pick a username'},
              // minLength: {value: 2, message: 'Username must be at least 2 characters'},
              // maxLength: {value: 15, message: 'Username must be at most 15 characters'},
              // pattern: {value: /^(\w){1,15}$/, message: 'Username must only contain letters, numbers, and underscores'},
              validate: {
                required: v => !!v || 'Please pick a username$$'
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