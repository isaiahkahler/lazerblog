import { Text } from "react-native";
import { supabase } from "../../components/data/supabase";
import Button from "../../components/ui/button";

export default function Settings() {
  return (
    <>
      <Text>settings!</Text>
      <Button onPress={() => supabase.auth.signOut()}>Log out</Button>
    </>
  );
}