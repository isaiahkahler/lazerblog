import { CreateBlog, BlogFormOutputs } from "./create-blog"
import { useRouter } from 'next/router';
import { useStore } from "@data/store"
import { UserBoundary } from "../components/userBoundary"
import useRedirect from "../hooks/useRedirect"
import { supabase } from "@supabase"
import { Blog } from "@data/types"


export default function EditBlogWrapper() {
  const router = useRouter();
  const { blog } = router.query;
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const redirect = useRedirect();
  const currentUser = user.data;
  const blogs = user.blogs ? Object.values(user.blogs) : null;
  const blogData = currentUser && blog && blogs && blogs.find(_blog => _blog.blog_slug === blog);
  
  const handleSubmit = ({ name, description, slug }: BlogFormOutputs) => {

    (async () => {
      try {
        if (slug && user.auth && user.data) {

          // check do they own the blog?
          const blogOwnedResponse = await supabase.from('blogs').select('blog_slug').eq('blog_slug', blog);
          if (blogOwnedResponse.error) throw blogOwnedResponse.error;
          const blogIsOwned = blogOwnedResponse.data[0] && blogOwnedResponse.data[0].user_id == user.data.user_id;

          if(!blogIsOwned) {
            // code review: handle this better
            router.push('/');
          }

          const blogExistsResponse = await supabase.from('blogs').select('blog_slug').eq('blog_slug', slug);
          if (blogExistsResponse.error) throw blogExistsResponse.error;
          const blogExists = blogExistsResponse.data[0] as string | null;

          if (!blogExists) {
            // add blog to 'blogs'
            
            const newBlogData : Blog = {
              blog_slug: slug,
              name: name,
              user_id: user.data.user_id,
              description: description,
              banner_image: ''
            };

            const setBlogResponse = await supabase.from('blogs').update(newBlogData).eq('blog_slug', blog);
            if (setBlogResponse.error) throw setBlogResponse.error;

            // code review: this line
            const blogsWithoutThisOne = user.blogs ? Object.values(user.blogs).filter(_blog => _blog.blog_slug !== blog) : [];
            const blogsWithoutThisOneObject = blogsWithoutThisOne.reduce((previous, current) => ({...previous, [current.blog_slug]: current}), {});

            setUser({
              auth: user.auth,
              blogs: blogsWithoutThisOneObject,
              data: user.data
            })

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
      <CreateBlog submitHandler={handleSubmit} initialData={{
        description: blogData ? blogData.description : '',
        name: blogData ? blogData.name : '',
      }} />
    </UserBoundary>
  );
}