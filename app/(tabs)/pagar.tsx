import { useStripeTerminal } from "@stripe/stripe-terminal-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

export default function PagarScreen() {
    const {
        initialize,
        isInitialized,
        discoverReaders,
        discoveredReaders,
        connectReader,
        connectedReader,
    } = useStripeTerminal();

    const [isDiscovering, setIsDiscovering] = useState(false);

    useEffect(() => {
        if (!isInitialized) initialize();
    }, [initialize, isInitialized]);

    const handleDiscover = async () => {
        setIsDiscovering(true);
        const { error } = await discoverReaders({
            simulated: true,
            discoveryMethod: "tapToPay", // ou bluetoothScan, usb, etc.
        });

        if (error) {
            Alert.alert("Erro ao descobrir leitores", error.message);
            setIsDiscovering(false);
            return;
        }

        // Agora esperamos que o hook atualize a lista discoveredReaders
        setTimeout(async () => {
            if (discoveredReaders.length > 0) {
            
                const { reader: connectedReader, error: connectError } = await connectReader({
                    reader: discoveredReaders[0],
                    autoReconnectOnUnexpectedDisconnect: true, // default setting
                },
                    'tapToPay'
                );
                if (connectError) {
                    Alert.alert("Erro ao conectar leitor", connectError.message);
                } else {
                    Alert.alert("✅ Conectado ao leitor!", connectedReader.label);
                }
            } else {
                Alert.alert("Nenhum leitor encontrado");
            }
            setIsDiscovering(false);
        }, 1500);
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            {!isInitialized && <Text>Inicializando Terminal...</Text>}
            {isInitialized && !connectedReader && (
                <Button
                    title={isDiscovering ? "Buscando leitores..." : "🔍 Procurar leitores"}
                    onPress={handleDiscover}
                />
            )}
            {connectedReader && (
                <Text>Conectado a: {connectedReader.label}</Text>
            )}
        </View>
    );
}
