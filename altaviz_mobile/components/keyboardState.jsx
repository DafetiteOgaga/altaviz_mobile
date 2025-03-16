import React, {useEffect, useState, useRef} from "react";
import {Keyboard} from "react-native";

export const KeyboardState = () => {
	const [heightAboveKeyboard, setHeightAboveKeyboard] = useState(false)
	// const heightAboveKeyboard = useRef(false)
	useEffect(() => {
		// Listen for keyboard open event
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
		  console.log('keyboardDidShowListener:')
		//   heightAboveKeyboard.current = true
		  setHeightAboveKeyboard(true)
		});
	
		// Listen for keyboard close event
		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
		 console.log('keyboardDidHideListener:')
		//  heightAboveKeyboard.current = false
		 setHeightAboveKeyboard(false)
		});
	
		return () => {
		  keyboardDidShowListener.remove();
		  keyboardDidHideListener.remove();
		};
	  });
	console.log('heightAboveKeyboard.current (hook):', heightAboveKeyboard)
	// return heightAboveKeyboard.current
	return heightAboveKeyboard
}