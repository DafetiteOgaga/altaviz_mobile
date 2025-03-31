import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Linking, StyleSheet,
	FlatList, ActivityIndicator
 } from "react-native";
import packageJson from "../package.json";
import { useColorMode } from "@/constants/Colors";
import { useGet } from "@/requests/makeRequests";
import { toTitleCase } from "@/hooks/useAllCases";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

const DummyAccountsModal = ({ visible, onClose, onUpdate, newVersion }: any) => {
	const uniColorMode = useColorMode();
	const { getData, isGetError, isGetLoading, GetSetup } = useGet();
	useEffect(() => {
		GetSetup("login-details/");
	}, []);
	// if (isGetLoading) return <Text style={{color: '#fff'}}>Loading...</Text>;
	// if (isGetError) return <Text style={{color: '#fff'}}>Error...</Text>;
	const dummyAccounts = getData;
	console.log('dummyAccounts:', JSON.stringify(dummyAccounts, null, 2));
	const copyToClipboard = (email: string) => {
        Clipboard.setStringAsync(email);
        Toast.show({ type: "success", text1: `Copied ${toTitleCase(email)} to Clipboard!` });
    };
	return (
		<Modal transparent visible={visible} animationType="fade">
			<View style={styles.overlay}>
				<View style={[styles.modalContainer, {backgroundColor: uniColorMode.newdrkb1}]}>
					<View
					style={{alignItems: "center"}}
					>
						<Text style={styles.title}>Dummy Accounts</Text>
						<Text style={[styles.text1, {color: 'red', fontStyle: 'italic', fontSize: 15}]}>These accounts are for test purposes and will be remove when the app is in use.</Text>
						<View style={{ flexDirection: "row", gap: 5, justifyContent: "space-between" }}>
							<Text style={styles.text}><Text style={{fontWeight: 'bold'}}>Password:</Text> <Text style={{color: 'gold'}}>password123</Text></Text>
							<TouchableOpacity onPress={() => {
								copyToClipboard('password123');
							}}>
								<Ionicons name="copy-outline" size={15} color="#fff" />
							</TouchableOpacity>
						</View>
					</View>
					{isGetLoading ?
					(<ActivityIndicator size="small" color={uniColorMode.text} />)
						:
						isGetError ?
						(<Text style={{color: 'red', fontStyle: 'italic', fontSize: 16}}>Error Fetching Accounts...</Text>)
							:
							(<FlatList
								data={dummyAccounts}
								renderItem={({ item }) => {
									const colorText = {
										color: (item.role==='engineer')?'lightgreen':
												(item.role==='supervisor')?'lightblue':
												(item.role==='custodian')?'forestgreen':
												(item.role==='workshop')?'cyan':
												(item.role==='help-desk')?'darkgoldenrod':
												'magenta'}
									return (
										<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
											<Text style={styles.text}>{toTitleCase(item.email)}</Text>
											<Text style={[styles.text, colorText]}>{toTitleCase(item.role)}</Text>
											<TouchableOpacity onPress={() => {
												copyToClipboard(item.email);
												onClose();
											}}>
												<Ionicons name="copy-outline" size={20} color="#fff" />
											</TouchableOpacity>
										</View>
								)}}
								keyExtractor={(item) => item.id.toString()}
								// ListFooterComponent={() => <View style={{ height: 30 }} />}
							/>)}
					<TouchableOpacity onPress={()=>onClose()}>
						<Text style={[styles.title]}>Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};
export { DummyAccountsModal };

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
		// justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "80%",
		// backgroundColor: "#fff", // White background
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
		marginBottom: 200,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		paddingVertical: 10,
		color: "#ffffff",
	},
	text: {
		fontSize: 17,
		textAlign: "center",
		marginBottom: 20,
		color: "#ddd",
	},
	text1: {
		fontSize: 17,
		textAlign: "center",
		marginBottom: 5,
		color: "#ddd",
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
