import { useEffect } from "react";
import Container from "../components/container";
import Layout from "../components/layout";
import Nav from "../components/nav";
import { useStoreState } from "../components/store";

export default function SignOut()  {

    return(
        <div>
            {/* <Nav /> */}
            <Layout>
                <Container>
                    <h1>sign out</h1>
                </Container>
            </Layout>
        </div>
    );
}