import { router } from "expo-router";
import Login from "./login";

export default function LoginWrapper() {
  return (
    <Login handleClickAway={() => router.canGoBack() ? router.back() : router.push('/')} />
  );
}
