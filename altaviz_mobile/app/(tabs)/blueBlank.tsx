import { View, Text, StyleSheet, Button } from 'react-native';
import React, {useEffect} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenStyle } from '../../myConfig/navigation';
import { getComponentName } from '@/hooks/getComponentName';

export default function BlueBlank() {
	getComponentName()
	return (
		<>
			<View style={[ScreenStyle.allScreenContainer, { justifyContent: 'center', alignItems: 'center'}]}>
				<Text style={styles.text}>Blue Blank page 😎💪</Text>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	text: {
		color: 'white',
		textAlign: 'center',
		fontSize: 24,
        fontWeight: 'bold',
        // marginVertical: 20,
	},
})