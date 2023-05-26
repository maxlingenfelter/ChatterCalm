import React, { useState, useCallback, useEffect, version } from 'react';
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

        let updatedMessages = [...messages];
        if (messages.length === 0) {
            // Send prePrompt only if it's the first message
            const prePrompt: ChatMessageType = {
                role: 'system',
                content: 'The following is a conversation with an AI assistant within a chat app meant to provide personalized conversational therapy accessible to all. The assistant is helpful, clever, friendly, understanding and very sympathetic.',
            };
            updatedMessages.push(prePrompt);
        }
        updatedMessages.push(userMessage);

        setMessages(updatedMessages);
        setInputValue('');
        setIsWaitingForResponse(true);

        try {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: updatedMessages,
            });

            //Format resopnse so its readable in console
            console.log(JSON.stringify(response, null, 2));

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

    const handleInputBlur = () => {
        setKeyboardOffset(0);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={keyboardOffset}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{date}</Text>
            </View>
            <View style={styles.contentContainer}>
                <SafeAreaView style={styles.chatContainer}>
                    <ScrollView
                        style={styles.chat}
                        contentContainerStyle={styles.chatContent}
                        ref={(ref) => {
                            // Scroll to bottom when a new message is added
                            if (ref) {
                                ref.scrollToEnd({ animated: true });
                            }
                        }}
                    >
                        {messages.filter((message) => message.role !== 'system').map((message, index) => (
                            //Separate message  of user and assistant
                            <View
                                key={index}
                                style={[
                                    styles.messageContainer,
                                    message.role === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.message,
                                        message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                                    ]}
                                >
                                    {message.content}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
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
                                onBlur={handleInputBlur}
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
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({

    //Start message styles

    messageContainer: {},

    userMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#b0bd9a',
        paddingVertical: 16,
        paddingLeft: 32,
        paddingRight: 40,
        marginBottom: 40,
        borderRadius: 20,
        //Border radius for user message
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 4,

    },
    assistantMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#191919',
        paddingVertical: 16,
        paddingLeft: 40,
        paddingRight: 32,
        marginBottom: 40,
        //Border radius for assistant message
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 4,
    },

    message: {},
    userMessage: {
        color: '#191919',
        maxWidth: 159,
    },
    assistantMessage: {
        color: '#fff',
        maxWidth: 159,

    },



 //End message styles



    container: {
        flex: 1,
        backgroundColor: '#52925b',
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
    contentContainer: {
        flex: 1,
    },
    chatContainer: {
        backgroundColor: '#52925b',
        flex: 1,
    },
    chat: {
        flex: 1,
        paddingHorizontal: 24,
    },
    chatContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    footerBarContainer: {
        backgroundColor: '#191919',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 35,
        // borderRadius: 32,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    inputRow: {
        flexDirection: 'row',
        fexWrap: 'wrap',
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
});

export default ChatScreen;
