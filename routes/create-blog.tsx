import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Box from "../components/box"
import { useCustomInputProps, InputLabel, InputInvalidMessage } from "../components/input"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Input from '../components/input'
import { useEffect, useState } from "react";
import firebase from '../firebase'
import { useStore } from "../components/store"
import { UserBoundary } from "../components/userBoundary"
import useRedirect from "../components/useRedirect"
import { URL } from "../components/constants"
import useSlug, { useBackupSlug } from "../components/useSlug"
import { SubmitHandler, useForm } from "react-hook-form"
import { InputButton } from '../components/button'
import If from '../components/if'
import CircleProgress from '../components/circleProgress'


interface FormInputs {
    name: string,
    description: string
}

let typingDelayTimeout: NodeJS.Timeout | null = null;

type FormOutputs = FormInputs & {slug: string};

interface CreateBlogProps {
    submitHandler: (data: FormOutputs) => void
}

function CreateBlog({ submitHandler }: CreateBlogProps) {

    const [loading, setLoading] = useState(false);
    const [blogSlug, setBlogSlug] = useSlug();
    const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormInputs>();
    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        setLoading(true);
        submitHandler({...data, slug: blogSlugTaken ? backupBlogSlug : blogSlug});
    }
    const [backupBlogSlug, blogSlugTaken] = useBackupSlug(blogSlug, async (newSlug) => {
        if(blogSlug == backupBlogSlug || blogNameError) {
            return false;
        }
        console.log('new blogSlug: ', blogSlug)
        
        if (typingDelayTimeout) {
            clearTimeout(typingDelayTimeout);
        }

        return new Promise((resolve) => {
            typingDelayTimeout = setTimeout(async () => {
                try {
                    const blogSlugDoc = await firebase.firestore().collection('blogs').doc(newSlug).get();
                    console.log(`checked if blog ${blogSlug} exists`, blogSlugDoc.exists)
                    resolve(blogSlugDoc.exists);
                } catch (error) {
                    // code review: handle error
                    console.error(error);
                    resolve(false);
                }
            }, 500);
        });

    });



    const blogNameRequiredError = errors.name?.type === 'required';
    const blogNameLengthError = errors.name?.type === 'minLength' || errors.name?.type === 'maxLength';
    const blogNameError = blogNameRequiredError || blogNameLengthError;

    const descriptionLengthError = errors.description?.type === 'maxLength';



    return (
        <div>
            <Layout>
                <Container>
                    <h1>Create your new blog.</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <Input value={blogName} setValue={value => { setBlogName(value); setBlogSlug(value) }} id='blogname' label='Blog Name' isValid={!formSubmitted || blogSlug.length !== 0} invalidMessage={"Please enter your blog name."} /> */}
                        <InputLabel>Blog Name</InputLabel>
                        <input {...register('name', {
                            required: true,
                            minLength: 2,
                            maxLength: 50,
                            // pattern: /^.+$/,
                            onChange: event => setBlogSlug(event.target.value),
                        })} id='blogname' {...useCustomInputProps(!blogNameError)} />
                        <InputInvalidMessage isValid={!blogNameRequiredError}>Please enter your blog name.</InputInvalidMessage>
                        <InputInvalidMessage isValid={!blogNameLengthError}>Blog name must be 2-50 characters.</InputInvalidMessage>
                        {blogSlug && <p>Your blog will appear as {URL}/{blogSlugTaken ? backupBlogSlug : blogSlug}</p>}
                        {blogSlugTaken ? <Box style={{ backgroundColor: "#f8a0b2", border: '2px solid #cc0f35' }}>The URL for this blog name is taken. To get a matching blog URL, change the blog name.</Box> : undefined}

                        <InputLabel>Description</InputLabel>
                        <textarea {...register('description', {
                            maxLength: 200,
                        })} placeholder='optional' id='blogdescription' autoComplete='off' rows={3} {...useCustomInputProps(!descriptionLengthError)} />
                        <InputInvalidMessage isValid={!descriptionLengthError}>Max length is 200 characters.</InputInvalidMessage>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem 0' }}>
                            <InputButton value='continue' disabled={loading} type='submit' />
                            <If value={loading}>
                                <div style={{ position: 'absolute' }}>
                                    <CircleProgress />
                                </div>
                            </If>
                        </div>

                    </form>
                </Container>
            </Layout>
        </div>
    );
}


export default function CreateBlogWrapper() {
    const router = useRouter();
    const user = useStore(state => state.user);
    const redirect = useRedirect();

    const handleSubmit = ({name, description, slug}: FormOutputs) => {

        (async () => {
            try {
                if (slug && user.auth && user.data) {
                    const blogURLDoc = await firebase.firestore().collection('blogs').doc(slug).get();
                    if (!blogURLDoc.exists) {
                        // add blog to 'blogs'
                        await firebase.firestore().collection('blogs').doc(slug).set({
                            name: name,
                            author: user.data.username,
                            blogDescription: description,
                            brandImage: ''
                        });
                        // add blog to user     
                        await firebase.firestore().collection('users').doc(user.data.username).set({
                            blogs: user.data.blogs ? [...user.data.blogs, slug] : [slug]
                        }, { merge: true });

                        // redirects if URL has ?redirect=[new-route]
                        // else goes to /[blog]
                        redirect(() => {
                            router.push('/' + slug);
                        })
                    }
                }
            } catch (error) {
                // code review: handle
            }
        })();
    };

    return (
        <UserBoundary onUserLoaded={user => {
            if (user.data && user.auth) return; // logged in and registered
            if (!user.auth) { // needs to log in
                console.log('no user')
                router.push('/login')
                return;
            }
            if (!user.data) { // needs to register
                router.push('/create-user');
                return;
            }
        }}>
            <CreateBlog submitHandler={handleSubmit} />
        </UserBoundary>
    );
}