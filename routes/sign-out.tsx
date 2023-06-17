import { useRouter } from "next/router"
import { useEffect } from "react"
import Container from "../components/container"
import Layout from "../components/layout"
import Nav from "../components/nav"
import { useStore } from "../data/store"
import {supabase} from '@supabase'

export default function SignOut()  {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.signOut().then(() => {
            router.push('/')
        });
    }, [router])

    return(
        <div>
            {/* <Nav /> */}
            <Layout>
                <Container>
                    <h1>signing out...</h1>
                </Container>
            </Layout>
        </div>
    );
}