import { Alert, Platform } from "react-native";

// Mostra um aviso simples. Na web usa window.alert; no celular, Alert.alert.
export function avisar(titulo, mensagem) {
  if (Platform.OS === "web") {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

// Pede confirmação e devolve true/false. Na web usa window.confirm.
export function confirmar(titulo, mensagem, textoConfirmar = "Confirmar") {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(mensagem || titulo));
  }

  return new Promise((resolver) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: "Cancelar", style: "cancel", onPress: () => resolver(false) },
        {
          text: textoConfirmar,
          style: "destructive",
          onPress: () => resolver(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolver(false) },
    );
  });
}
