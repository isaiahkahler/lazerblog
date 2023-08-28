import { StyleSheet, Text, View } from 'react-native';
import { REM } from '../../components/data/constants';
import { useIsExtraLargeScreenSize } from '../../components/hooks/useScreenSize';
import Container from '../../components/ui/container';
import If from '../../components/ui/if';
import Layout from '../../components/ui/layout';


export default function TabOneScreen() {

  const isExtraLargeScreenSize = useIsExtraLargeScreenSize();

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
        <Layout style={{ backgroundColor: 'rgba(255,0,0,0.2)', flex: 1, minWidth: 42.5 * REM }}>
          <Container>
            <Text>
              Tab one screen
            </Text>
          </Container>
        </Layout>
      <If value={isExtraLargeScreenSize}>
        <Layout style={{backgroundColor: 'rgba(0,255,0,0.2)', flex: 1, maxWidth: 15.5 * REM}}>
          <Container>
            <Text>
              Side Thing
            </Text>
          </Container>
        </Layout>
      </If>
    </View>

  );
}
