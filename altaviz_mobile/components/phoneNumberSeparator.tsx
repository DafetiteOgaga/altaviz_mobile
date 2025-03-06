import React from "react";
import { Text } from "react-native";

const PhoneNumberSeparator = (num:string) => {
	// console.log({text})
	if (!num) return;
	// Extract specific chunks using slice
	const separated1 = num.slice(0, 3); // First 3 characters
	const separated2 = num.slice(3, 7); // Next 4 characters
	const separated3 = num.slice(7, 10); // Last 3 characters

	// Log the separated chunks
	// console.log('separated1:', separated1);
	// console.log('separated2:', separated2);
	// console.log('separated3:', separated3);

	// Combine the chunks with a space
	const sepPhoneNum = [separated1, separated2, separated3].filter(Boolean).join('-');
	return <Text style={{color: 'white'}}>+234 {sepPhoneNum}</Text>
};
export {PhoneNumberSeparator}
