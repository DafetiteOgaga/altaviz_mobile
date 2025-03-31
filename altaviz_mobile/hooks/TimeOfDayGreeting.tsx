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

const currentTimeAndDate = () => {
    const now = new Date();
    
    // Array of weekday and month names
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const today = now.getDate()
    const dayOfWeek = weekdays[now.getDay()]; // Get the day of the week
    const month = months[now.getMonth()]; // Get the month name
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format time with leading zeros
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // return `${dayOfWeek}, ${month} ${year} ${formattedTime}`;
	return `${dayOfWeek}, ${month} ${today}, ${year}`;
};
export {currentTimeAndDate}

// console.log(currentTimeAndDate());


const styles = StyleSheet.create({
	container: {
		// padding: 10,
		// alignItems: 'center',
	},
	greetingText: {
		fontSize: 27,
		fontWeight: 'bold',
		fontStyle: 'italic',
		color: '#fff',
	},
});

export default TimeOfDayGreeting;
