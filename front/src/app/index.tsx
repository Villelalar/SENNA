import { Redirect } from "expo-router";

import { lerSessao } from "../data/sessao";

export default function Index() {
  return <Redirect href={lerSessao() ? "/home" : "/login"} />;
}