import React, { useState } from 'react';
import { Text, Button, View } from 'react-native';

const colors = [
	"Yellow", "Purple", "Brown", "White", "Cyan", "Lime", "Indigo",
	"Gold", "Maroon", "Turquoise", "SkyBlue", "DarkBlue", "DarkOrange",
	"DarkMagenta", "LightPink", "LightGreen", "LightCyan", "LightGray",
	"Olive", "Tan", "ForestGreen", "Orange", "Black", "Magenta",
	"Violet", "Navy", "Salmon", "DarkGreen", "DarkSlateGray", "LightYellow",
	"LightSteelBlue", "Pink", "Teal", "Coral", "DarkCyan", "LightSalmon",
	"SlateBlue", "Gray", "DarkRed", "Sienna", "Silver", "Red", "Green",
	"LightBlue", "Blue"
];
const changeColor = (() => {
	let prev = 0; // Stores the last index
	return () => {
		prev = (prev + 1) % colors.length; // Ensure it loops within bounds
		// console.log('prev:', prev); // Example console log
		const shuffledColors = colors.sort(() => Math.random() - 0.5);
		return shuffledColors[prev].toLowerCase(); // Return the color directly in lower case
};})();

// // Example of using the color in a style:
// let textColor = changeColor(); // Set the initial color
// // console.log('textColor:', textColor); // Example console log

export const SelectColor = () => {
	const [modColor, setModColor] = useState<string>(changeColor());
	const handleClick = () => {
		const newColor = changeColor();
		setModColor(newColor);
		return newColor;
	};
	return (
		<View>
			<Text style={{ color: modColor }}>Color: {modColor}</Text>
			<Button onPress={handleClick} title="Change Color" />
		</View>
	);
};

// Example of using the color in a style:
// const [color, ColorComponent] = SelectColor();