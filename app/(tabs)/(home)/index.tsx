import { StyleSheet, View, Text } from 'react-native';
import Button from '../../../components/ui/button';
import Container from '../../../components/ui/container';
import Layout from '../../../components/ui/layout';
import P from '../../../components/ui/text';


export default function Home() {
  return (
    <Layout>
      <Container>
        <P>Home</P>
        <Button>hello</Button>
      </Container>
    </Layout>
  );
}

const styles = StyleSheet.create({
});
