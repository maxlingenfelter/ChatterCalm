import React from "react";
import { Text, TextProps } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

type GradientTextProps = TextProps & {
    colors: string[];
}

const GradientText = (props: GradientTextProps) => {
	return (
		<MaskedView maskElement={<Text {...pr ops} />}>
			<LinearGradient
				colors={props.colors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			>
				<Text {...props} style={[props.style, { opacity: 0 }]} />
			</LinearGradient>
		</MaskedView>
	);
};

export default GradientText;
