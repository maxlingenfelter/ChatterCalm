import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import { OPENAI_API_KEY } from ".env";
import moment from 'moment';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
    useFonts,
    Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import { useCallback } from "react";



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
    const date = moment().format('LT')

    return (
        <View onLayout={onLayoutRootView}>
            <View style={styles.header_container}>
                <Text style={styles.header_text}>{date}</Text>
            </View>
            <SafeAreaView style={styles.container}>
                <Text>Chat Screen</Text>
            </SafeAreaView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131715',
    },
    header_container: {
        backgroundColor: '#191919',
        justifyContent: 'center',
        alignItems: 'center',

    },
    header_text: {
        color: '#fff',
        //Font
        fontFamily: 'Poppins_500Medium',
        fontWeight: "500",
        fontSize: 38,

        //Padding
        paddingHorizontal: 20,
        paddingTop: 57,
        paddingBottom: 21,

    }
});

export default ChatScreen;
