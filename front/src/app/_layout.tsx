import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import "../global.css";

import { lerSessao } from "../data/sessao";

const rotasPublicas = ["/", "/login", "/signup"];

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!rotasPublicas.includes(pathname) && !lerSessao()) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}