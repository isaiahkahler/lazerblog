import { CreateProfile, UserFormInputs } from "./create-profile";
import { useRouter } from 'next/router';
import { useStore } from "../data/store";
import { UserBoundary } from "../components/userBoundary";
import useRedirect from "../hooks/useRedirect";
import { supabase } from "@supabase";
import { Blog, User } from "@data/types";



export default function CreateProfileWrapper() {
  const router = useRouter();
  const redirect = useRedirect();
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const blogs = user.blogs;
  const currentUser = user.data;
  const userBlog = blogs && currentUser ? blogs.find(blog => blog.blog_slug === `users/${currentUser.username}`) : null;

  const handleSubmit = (data: UserFormInputs) => {
      console.log('handleSubmit!!!');

      (async () => {
          try {
              if (user.auth && user.auth && data.username && userBlog) {


                  const userResponse = await supabase.from('users').select('username').eq('username', data.username);
                  if(userResponse.error) throw userResponse.error;
                  if(userResponse && userResponse.data.length !== 0) throw new Error('username has just been taken. choose another.');

                  const newUserData: User = {
                      user_id: user.auth.id,
                      name: data.name,
                      // bio: data.bio,
                      username: data.username,
                      // banner_image: '',
                      profile_picture: ''
                  }

                  const newUserBlog: Blog = {
                      banner_image: '',
                      blog_slug: `users/${data.username}`,
                      description: data.bio,
                      name: data.name,
                      user_id: user.auth.id
                  }

                  const insertResponse = await supabase.from('users').update({...newUserData}).eq('user_id', user.auth.id);
                  if(insertResponse.error) throw insertResponse.error;
                  const insertBlogResponse = await supabase.from('blogs').update({...newUserBlog}).eq('blog_slug', userBlog.blog_slug);
                  if(insertBlogResponse.error) throw insertBlogResponse.error;

                  const blogsWithoutUserBlog = blogs ? blogs.filter(blog => !blog.blog_slug.includes('users/')) : [];
                  
                  setUser({
                    auth: user.auth,
                    blogs: [...blogsWithoutUserBlog, newUserBlog],
                    data: newUserData
                  })

                  setTimeout(() => {
                      redirect(() => {
                          router.push(`/users/${data.username}`);
                      });
                  }, 1000);
                  
              }
          } catch (error) {
              // code review: handle error
              console.error('error inserting user:', error)
          }
      })();

  }

  if(!user || !blogs || !currentUser) return <></>;

  if(!userBlog) return <>error</>;
 
  return (
      <UserBoundary onUserLoaded={(user) => {
          if (!user.auth) { // nobody is logged in
              router.push('/login');
              return;
          }
          if (!user.data) {
            router.push('/create-profile')
          };

          // router.push(`/users/${user.data.username}`);
      }}>
          <CreateProfile submitHandler={handleSubmit} initialData={{
            name: userBlog.name,
            bio: userBlog.description,
            username: currentUser.username
          }} />
      </UserBoundary>
  );
}