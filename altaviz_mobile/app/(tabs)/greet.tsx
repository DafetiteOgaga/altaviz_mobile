import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenStyle } from '@/myConfig/navigation';
import { getComponentName } from '@/hooks/getComponentName';

export default function Greet() {
	getComponentName()
	const {message, myName} = useLocalSearchParams();
	const router = useRouter();
	// console.log({myName});
	return (
		<>
			<View style={[ScreenStyle.allScreenContainer, { justifyContent: 'center', alignItems: 'center'}]}>
				<Text style={styles.text}>{message}</Text>
				<Text style={styles.text}>{myName}</Text>
				<Button // Button to update the Data passed from another screen
				title='Update Data' onPress={()=>router.setParams({message: 'updated data'})}/>
				<Text style={styles.text}>Note: You can send Data back or to any other screen as well</Text>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	text: {
		color: 'white',
		textAlign: 'center',
	},
})