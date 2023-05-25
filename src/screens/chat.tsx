import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import moment from 'moment';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '.env';

// Svgs
import SendSVG from '../../assets/svgs/send.svg';

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type ChatMessageType = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

const ChatScreen = ({ route }) => {
    const date = moment().format('LT');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    const handlePress = async () => {
        if (!inputValue) {
            return;
        }

        const userMessage: ChatMessageType = { role: 'user', content: inputValue };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputValue('');
        setIsWaitingForResponse(true);

        try {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [...messages, userMessage],
            });

            console.log('OpenAI API Response:', response);

            if (response && response.data && response.data.choices && response.data.choices.length > 0) {
                const aiResponse = response.data.choices[0].message.content;
                const botMessage: ChatMessageType = { role: 'assistant', content: aiResponse };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
        } catch (error) {
            console.log('OpenAI API Error:', error);
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    useEffect(() => {
        SplashScreen.preventAutoHideAsync();
        SplashScreen.hideAsync();

        // Set up keyboard listeners
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            if (Platform.OS === 'ios') {
                setKeyboardOffset(event.endCoordinates.height);
            }
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOffset(0);
        });

        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
    };
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={keyboardOffset}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{date}</Text>
            </View>
            <SafeAreaView style={styles.chatContainer}>
                <ScrollView style={styles.chat}>
                    {messages.map((message, index) => (
                        <View key={index}>
                            {/* Distingush between messages wuth type "user" vs ones with type "assistant\" */}
                            {message.role === 'user' ? (
                                <View style={styles.userMessageContainer}>
                                    <Text style={styles.userMessage}>{message.content}</Text>
                                </View>
                            ) : (
                                <View style={styles.assistantMessageContainer}>
                                    <Text style={styles.assistantMessage}>{message.content}</Text>
                                </View>
                            )}
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
                                onFocus={() => setKeyboardOffset(0)}
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
                                    {isWaitingForResponse ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                            <SendSVG />
                                    )}
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

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
        fontWeight: '500',
        fontSize: 38,
        paddingHorizontal: 20,
        paddingTop: 57,
        paddingBottom: 21,
    },
    chatContainer: {
        backgroundColor: '#52925b',
        flex: 1,
    },
    chat: {},
    footerBarContainer: {
        backgroundColor: '#191919',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 45,
        borderRadius: 32,
    },
    inputRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flex: 1,
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
        justifyContent: 'center',
        borderRadius: 32,
    },
    messageText: {
        color: 'white',
    },

    //Message Styles
    
});

export default ChatScreen;
