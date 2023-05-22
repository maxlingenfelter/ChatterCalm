import { View, Text, Button, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { OPENAI_API_KEY } from ".env";
import moment from "moment";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { useCallback } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";

const ChatScreen = ({ route }) => {
    // Load fonts using splash-screen and Font.loadAsync
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

  // Dymamic value for time
    const date = moment().format("LT");

    return (
        <View onLayout={onLayoutRootView}>
            <View style={styles.header_container}>
                <Text style={styles.header_text}>{date}</Text>
            </View>
            <SafeAreaView style={styles.chat_container}>
                <ScrollView style={styles.chat}>
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </ScrollView>
                <View style={styles.footerBar_container}>
                    <Text style={{ color: "#fff" }} > Footer</Text>
                </View>
            </SafeAreaView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#131715",
    },
    header_container: {
        backgroundColor: "#191919",
        justifyContent: "center",
        alignItems: "center",
    },
    header_text: {
        color: "#fff",
    //Font
        fontFamily: "Poppins_500Medium",
        fontWeight: "500",
        fontSize: 38,

        //Padding
        paddingHorizontal: 20,
        paddingTop: 57,
        paddingBottom: 21,
    },

    //Chat
    chat_container: {
        backgroundColor: "#52925b",
        height: 650,
    },
    chat: {},


    //FooterBar
    footerBar_container: {
        backgroundColor: "#191919",
    },
});

export default ChatScreen;
