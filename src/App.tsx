import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	QueryClient,
	QueryClientProvider,
	onlineManager,
	useQuery,
} from "@tanstack/react-query";

import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

//Screens
import Chat from "./screens/chat";
import LaunchScreen from "./screens/launch";

/* React Query */
onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(!!state.isConnected);
	});
});

const queryClient = new QueryClient();

/* Navigation Stack */
const RootStack = createNativeStackNavigator();

export default function App() {




	// TODO: Refactor all and login onboarding into separate stack navigator

	return (
		<QueryClientProvider client={queryClient}>
			<View style={styles.container}>
				<NavigationContainer>
					<RootStack.Navigator
						initialRouteName={"Launch"}
						screenOptions={{
							headerShown: false,
						}}
					>
						<RootStack.Screen name="Launch" component={LaunchScreen} />
						<RootStack.Screen name="Chat" component={Chat} />
					</RootStack.Navigator>
				</NavigationContainer>
			</View>
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fbc118",
		zIndexL: 5 // Replace with your desired color
	},
});

// This component is used to perform any initial app setup
// For example, we want to sync the user from storage when the app first loads
// Until the user is synced, we want to show a loading screen
