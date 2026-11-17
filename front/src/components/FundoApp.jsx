import { ImageBackground, Platform, View } from "react-native";

export default function FundoApp({ style, children }) {
  if (Platform.OS !== "web") {
    return (
      <ImageBackground
        source={require("../../assets/nuvens.png")}
        style={style}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
  }

  return (
    <View style={style}>
      <div className="fundo-app" aria-hidden="true" />
      {children}
    </View>
  );
}
