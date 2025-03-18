import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Linking, StyleSheet } from "react-native";
import packageJson from "../package.json";
import { useColorMode } from "@/constants/Colors";

const UpdateModal = ({ visible, onClose, onUpdate, newVersion }: any) => {
	const uniColorMode = useColorMode();
	return (
		<Modal transparent visible={visible} animationType="fade">
			<View style={styles.overlay}>
				<View style={[styles.modalContainer, {backgroundColor: uniColorMode.ltrb}]}>
					<Text style={styles.title}>New Version Available</Text>
					<Text style={styles.message}>
						A new version ({newVersion}) is available. Would you like to update?
					</Text>

					<View style={styles.buttonContainer}>
						<TouchableOpacity style={[styles.button, styles.updateButton]} onPress={onUpdate}>
							<Text style={styles.buttonText}>Yes, Update</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
							<Text style={styles.buttonText}>No, Later</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};
export { UpdateModal };

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "80%",
		// backgroundColor: "#fff", // White background
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	message: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 20,
		color: "#333",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginHorizontal: 5,
	},
	updateButton: {
		backgroundColor: "#007BFF", // Blue button for update
	},
	cancelButton: {
		backgroundColor: "#D9534F", // Red button for cancel
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

// export default App;
