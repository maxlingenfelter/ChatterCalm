import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import moment from 'moment';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '.env';

// Svgs
import SendSVG from '../../assets/svgs/send.svg';
import { useTheme } from '@react-navigation/native';

const token = OPENAI_API_KEY;
const configuration = new Configuration({
    apiKey: token,
});
const openai = new OpenAIApi(configuration);

// Type for chat message
type ChatMessageType = {
    type: 'user' | 'bot';
    text: string;
};

// Array of chat messages
let MESSAGES: ChatMessageType[] = [];

// Component
const ChatScreen = ({ route }) => {
    // Load fonts using splash-screen and Font.loadAsync



    // Dynamic value for time
    const date = moment().format('LT');

    // Input Value
    const [inputValue, setInputValue] = useState('');

    // Event handler for button press
    const handlePress = () => {
        newUserMessage(inputValue);
        setInputValue('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{date}</Text>
            </View>
            <SafeAreaView style={styles.chatContainer}>
                <ScrollView style={styles.chat}>
                    {MESSAGES.map((message, index) => (
                        <View key={index}>
                            <View>
                                <Text style={styles.messageText}>{message.text}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.footerBarContainer}>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Write a message..."
                                placeholderTextColor="#fff"
                                underlineColorAndroid="transparent"
                                value={inputValue}
                                onChangeText={setInputValue}
                            />
                        </View>
                        <View style={styles.sendButtonContainer}>
                            <Pressable onPress={handlePress} hitSlop={8}>
                                <LinearGradient
                                    colors={['#B5C49C', '#959595']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.sendButton}
                                >
                                    <SendSVG />
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131715',
    },
    headerContainer: {
        backgroundColor: '#191919',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontFamily: 'Poppins_500Medium',
        fontWeight: '500',
        fontSize: 38,
        paddingHorizontal: 20,
        paddingTop: 57,
        paddingBottom: 21,
    },
    chatContainer: {
        backgroundColor: '#52925b',
        height: 660,
    },
    chat: {},
    footerBarContainer: {
        backgroundColor: '#191919',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 45,
        borderRadius: 32,
        top: 60,
    },
    inputRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: 274,
    },
    sendButtonContainer: {
        width: 48,
        marginLeft: 16,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
        height: 48,
        borderRadius: 50,
        backgroundColor: '#344e41',
        color: 'white',
    },
    sendButton: {
        height: 48,
        width: 48,
        alignItems: 'center',
        padding: 16,
        borderRadius: 32,
    },
    messageText: {
        color: 'white',
    },
});

// Function to handle user message and generate AI response
async function newUserMessage(text) {
    const userMessage: ChatMessageType = { type: 'user', text };
    MESSAGES.push(userMessage);

    const prompt = buildPrompt(MESSAGES);

    console.log('Prompt:', prompt);

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 100,
        });

        console.log('Response:', response.data);

        const aiResponse = response.data.choices[0].text.trim();

        const botMessage: ChatMessageType = { type: 'bot', text: aiResponse };
        MESSAGES.push(botMessage);

        console.log('AI:', aiResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Helper function to build the prompt from the messages array
function buildPrompt(messages) {
    let prompt = '';
    for (const message of messages) {
        prompt += `${message.type === 'user' ? 'User' : 'Bot'}: ${message.text}\n`;
    }
    return prompt;
}

export default ChatScreen;
