import React, { useState, useRef } from 'react';
import { useColorMode } from '@/constants/Colors';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform,
	TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatInput = ({onSend}:{onSend:(message:string)=>void}) => {
	const uniColorMode = useColorMode()
	const [message, setMessage] = useState('');
	// const [keyboardVisible, setKeyboardVisible] = useState(false);
	const inputRef = useRef(null);

	// useEffect(() => {
	// 	const keyboardDidShowListener = Keyboard.addListener(
	// 		'keyboardDidShow', () => {
	// 			setKeyboardVisible(true);
	// 		}
	// 	);
	// 	const keyboardDidHideListener = Keyboard.addListener(
	// 		'keyboardDidHide', () => {
	// 			setKeyboardVisible(false);
	// 		}
	// 	);

	// 	return () => {
	// 	keyboardDidShowListener.remove();
	// 	keyboardDidHideListener.remove();
	// 	};
	// }, []);

	const handleSend = () => {
		console.log('message:', message);
		onSend(message);
		setMessage('');
	};

	return (
		<KeyboardAvoidingView
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
		style={styles.container}
		>
		<View style={styles.inputContainer}>
			<TextInput
			ref={inputRef}
			style={[styles.input, {backgroundColor: message?undefined:uniColorMode.dkb,}]}
			placeholder="Type a message..."
			placeholderTextColor={'grey'}
			value={message}
			onChangeText={setMessage}
			multiline={true}
			returnKeyType="default"
			/>

			<TouchableOpacity
			style={styles.sendButton}
			onPress={handleSend}
			>
				<Ionicons name="send" size={25} color="#fff" />
			</TouchableOpacity>
		</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 40,
		// backgroundColor: '#FFFFFF',
		// borderTopWidth: 1,
		// borderTopColor: '#E5E5E5',
		// paddingHorizontal: 10,
		// paddingVertical: 8,
		padding: 3,
		// gap: 15
	},
	input: {
		flex: 1,
		color: 'white',
		minHeight: 40,
		maxHeight: 100,  // This needs to be in the style, not as a direct prop
		// borderRadius: 20,
		borderTopLeftRadius: 40,
		borderBottomLeftRadius: 40,
		// backgroundColor: '#F0F0F0',
		paddingHorizontal: 15,
		paddingVertical: 10,
		// marginRight: 10,
		fontSize: 16,
	},
	sendButton: {
		width: 55,
		height: 40,
		// borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#F0F0F0',
		// marginRight: 5,
		// paddingLeft: 10,
	},
});

export {ChatInput};