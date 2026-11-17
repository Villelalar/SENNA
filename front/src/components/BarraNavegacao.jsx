import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const navegacao = [
  {
    rotulo: "Início",
    rota: "/home",
    icone: "home-outline",
    ativo: "home",
    cor: "#e64e42",
    fundo: "#fdecea",
  },
  {
    rotulo: "Jogos",
    rota: "/games",
    icone: "game-controller-outline",
    ativo: "game-controller",
    cor: "#c99a00",
    fundo: "#fff6d4",
  },
  {
    rotulo: "Livros",
    rota: "/book",
    icone: "book-outline",
    ativo: "book",
    cor: "#1a9e4b",
    fundo: "#e4f7eb",
  },
  {
    rotulo: "Perfil",
    rota: "/perfil",
    icone: "person-outline",
    ativo: "person",
    cor: "#247c9e",
    fundo: "#e4f1f6",
  },
];

export default function BarraNavegacao({ ativo, params }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function navegar(item) {
    if (item.rotulo === ativo) return;
    router.replace({ pathname: item.rota, params });
  }

  return (
    <View
      style={[
        styles.rodape,
        {
          paddingBottom: 12 + insets.bottom,
          paddingLeft: 16 + insets.left,
          paddingRight: 16 + insets.right,
        },
      ]}
    >
      <View style={styles.barra} accessibilityRole="tablist">
        {navegacao.map((item) => {
          const selecionado = item.rotulo === ativo;
          const cor = selecionado ? item.cor : "#3b3a47";

          return (
            <Pressable
              key={item.rotulo}
              onPress={() => navegar(item)}
              accessibilityRole="tab"
              accessibilityLabel={item.rotulo}
              accessibilityState={{ selected: selecionado }}
              style={({ pressed, hovered }) => [
                styles.item,
                (selecionado || hovered) && { backgroundColor: item.fundo },
                pressed && styles.pressionado,
              ]}
            >
              {({ hovered }) => {
                const corItem = hovered ? item.cor : cor;
                return (
                  <>
                    <Ionicons
                      name={selecionado ? item.ativo : item.icone}
                      size={22}
                      color={corItem}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.rotulo,
                        { color: corItem },
                        selecionado && styles.rotuloAtivo,
                      ]}
                    >
                      {item.rotulo}
                    </Text>
                  </>
                );
              }}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rodape: {
    width: "100%",
    paddingTop: 8,
  },
  barra: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    flexDirection: "row",
    gap: 4,
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    boxShadow: "0px 8px 24px rgba(30, 30, 60, 0.12)",
  },
  item: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 18,
  },
  pressionado: {
    transform: [{ scale: 0.96 }],
  },
  rotulo: {
    fontSize: 11,
    fontWeight: "600",
  },
  rotuloAtivo: {
    fontWeight: "700",
  },
});
