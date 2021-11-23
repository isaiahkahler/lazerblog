import Layout from "../components/layout"
import Container from "../components/container"
import Nav from "../components/nav"
import Box from "../components/box"
import { useCustomInputProps, InputLabel, InputInvalidMessage } from "../components/input"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Input from '../components/input'
import { useEffect, useState } from "react";
import { useStore } from "@data/store"
import { UserBoundary } from "../components/userBoundary"
import useRedirect from "../hooks/useRedirect"
import { URL } from "../components/constants"
import useSlug, { useBackupSlug } from "../hooks/useSlug"
import { SubmitHandler, useForm } from "react-hook-form"
import { InputButton } from '../components/button'
import If from '../components/if'
import CircleProgress from '../components/circleProgress'
import { supabase } from "@supabase"
import { Blog } from "@data/types"


export interface BlogFormInputs {
    name: string,
    description: string
}

let typingDelayTimeout: NodeJS.Timeout | null = null;

export type BlogFormOutputs = BlogFormInputs & {slug: string};

interface CreateBlogProps {
    submitHandler: (data: BlogFormOutputs) => void,
    initialData?: BlogFormInputs
}

export function CreateBlog({ submitHandler, initialData }: CreateBlogProps) {

    const [loading, setLoading] = useState(false);
    const [blogSlug, setBlogSlug] = useSlug();
    const { register, handleSubmit, formState: { errors }, trigger } = useForm<BlogFormInputs>({
        defaultValues: initialData || undefined
    });
    const onSubmit: SubmitHandler<BlogFormInputs> = (data) => {
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
                    const blogResponse = await supabase.from('blogs').select('blog_slug').eq('blog_slug', newSlug);
                    if(blogResponse.error) throw blogResponse.error;
                    const blogExists = blogResponse.data[0] as string | null;

                    console.log(`checked if blog ${blogSlug} exists`, blogExists)
                    resolve(!!blogExists);
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
                    {initialData ? <h1>Edit your blog.</h1> : <h1>Create your new blog.</h1>}
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

    const handleSubmit = ({name, description, slug}: BlogFormOutputs) => {

        (async () => {
            try {
                if (slug && user.auth && user.data) {

                    const blogExistsResponse = await supabase.from('blogs').select('blog_slug').eq('blog_slug', slug);
                    if(blogExistsResponse.error) throw blogExistsResponse.error;
                    const blogExists = blogExistsResponse.data[0] as string | null;

                    if (!blogExists) {
                        // add blog to 'blogs'

                        const setBlogResponse = await supabase.from('blogs').insert([{
                            blog_slug: slug,
                            name: name,
                            user_id: user.data.user_id,
                            description: description,
                            banner_image: ''
                        } as Blog]);
                        if(setBlogResponse.error) throw setBlogResponse.error;

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
                router.push('/create-profile');
                return;
            }
        }}>
            <CreateBlog submitHandler={handleSubmit} />
        </UserBoundary>
    );
}