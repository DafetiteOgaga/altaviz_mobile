import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { toTitleCase } from '@/hooks/useAllCases';

const TimeOfDayGreeting = ({name='Anon'}) => {
	const currentHour = new Date().getHours();

	let greeting = "Good Morning";
	if (currentHour >= 12 && currentHour < 16) {
		greeting = "Good Afternoon";
	} else if (currentHour >= 16) {
		greeting = "Good Evening";
	}

	return (
		<View style={styles.container}>
			<Text style={styles.greetingText}>{greeting}, {toTitleCase(name)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// padding: 10,
		// alignItems: 'center',
	},
	greetingText: {
		fontSize: 20,
		fontWeight: 'bold',
		fontStyle: 'italic',
		color: '#fff',
	},
});

export default TimeOfDayGreeting;
