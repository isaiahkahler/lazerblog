import ClientBoundary from "@/ui/clientBoundary";
import Container from "@/ui/container";
import Layout from "@/ui/layout";
import LoginUI from "./client";

export default function Login() {
  return (
    <Layout>
      <Container>
        <ClientBoundary>
          <h1>Log In or Sign Up</h1>
          <LoginUI />
        </ClientBoundary>
      </Container>
    </Layout>
  );
}
