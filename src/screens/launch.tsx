import { View, Text, Button, SafeAreaView, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import LogoImage from '../../assets/adaptive-icon.png';

const LaunchScreen = ({ navigation }) => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.image_container}>
				<Image
					style={styles.image}
					source={LogoImage}

				/>
			</View>
			<View style={styles.btn_container}>
				<Pressable onPressIn={() => navigation.push('Chat')} hitSlop={8}>
					<LinearGradient
						colors={["#6AAC6D", "#E1C971", "#344E41"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={styles.button}
					>
						<Text style={styles.text}>Launch</Text>
					</LinearGradient>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#131715',
	},

	//Image
	image_container: {
		alignItems: "center",
		marginTop: 185,
	},
	image: {
		aspectRatio: 259 / 240,
		height: 200,
	},


	//Button
	btn_container: {
		marginTop: 270,
	},
	button: {
		//Actual Styles
		alignItems: "center",
		padding: 16,
		borderRadius: 64,

		//Positioning
		marginHorizontal: 38,
	},
	text: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'black',
	},
});

export default LaunchScreen;
