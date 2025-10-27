import { useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";

export async function fetchConnectionToken() {
  const response = await fetch("http://192.168.15.125:3000/connection_token", {
    method: "POST",
  });
  const data = await response.json();
  return data.secret;
}


export function useStripeTerminal() {
  useEffect(() => {
    async function init() {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão de Localização",
            message: "Stripe Terminal precisa de acesso à localização para NFC.",
            buttonPositive: "Aceitar",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Permissão de localização negada");
          return;
        }
      }
    }

    init();
  }, []);
}
