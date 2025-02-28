// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Linking, ScrollView, StyleSheet, useColorScheme } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import { ScreenStyle } from '../myConfig/navigation';
// import { useColorMode } from '../constants/Colors';
// import ParallaxScrollView from '../components/ParallaxScrollView';

// const userData = {
//   state: "Lagos",
//   location: "Ikeja",
//   role: "Technician",
//   supervisor: "John Doe",
//   supervisorLink: "https://example.com/supervisor",
//   helpDeskLink: "https://example.com/helpdesk",
//   email: "johndoe@example.com",
//   deliveries: 25,
//   phone: "+234 812 345 6789",
//   secondPhone: "+234 909 876 5432",
//   region: "South-West",
//   pendingFaults: 3,
// };

// type IconNames = keyof typeof Ionicons.glyphMap;
// type customComponent = {
//     icon: React.ComponentProps<typeof Ionicons>['name'],
// 	value?: number|string,
// 	label: string,
// 	variant?: string
// 	onPress?: any
// }

// const DASHBOARD_HEADER_HEIGHT = 200;

// const Dashboard = () => {
// 	const [scrollOffset, setScrollOffset] = useState(0);
// 	const uniColorMode = useColorMode()
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === "dark";

// 	const handleScrollOffsetChange = (value: any) => {
// 		// console.log({value});
// 		console.log('##########################')
// 		setScrollOffset(value);
// 	};
// 	const isHalfHeight = scrollOffset > DASHBOARD_HEADER_HEIGHT / 2;
// 	console.log({scrollOffset});
// 	console.log({isHalfHeight});
// 	console.log({DASHBOARD_HEADER_HEIGHT});
// 	console.log('DASHBOARD_HEADER_HEIGHT/2:', DASHBOARD_HEADER_HEIGHT / 2);
// 	const headerStyles = StyleSheet.create({
// 		mainContainer: {
// 			flex: 1,
// 			flexDirection: 'row',
// 			paddingTop: isHalfHeight?30:0,
// 			justifyContent: isHalfHeight?"center":"flex-start",
// 		},
// 		contentContainer: {
// 			flexDirection: isHalfHeight?'row':'column',
// 			gap: isHalfHeight?10:0
// 		},
// 		profileCircle: {
// 			width: isHalfHeight?35:96,
// 			height: isHalfHeight?35:96,
// 			borderRadius: 48,
// 			backgroundColor: "#6B46C1",
// 			justifyContent: "center",
// 			alignItems: "center",
// 			elevation: 6,
// 		},
// 		profileInitial: {
// 			fontSize: isHalfHeight?21:32,
// 			fontWeight: "bold",
// 			color: "#FFFFFF",
// 		},
// 		namesText: {
// 			textAlign: "center",
// 			marginTop: 5,
// 			fontSize: 22,
// 			fontWeight: "bold",
// 		},
// 		roleTag: {
// 			marginTop: isHalfHeight?5:8,
// 			paddingVertical: 4,
// 			paddingHorizontal: 10,
// 			borderRadius: isHalfHeight?6:8,
// 			backgroundColor: "#E2E8F0",
// 			height: 24,
// 		},
// 		roleText: {
// 			fontSize: 14,
// 			textAlign: "center",
// 			fontWeight: "600",
// 			color: uniColorMode.icon
// 		},
// 	})

//   return (
//     <View style={[ScreenStyle.allScreenContainer]}>
// 		<View style={[styles.emailInfoBox]}>
// 			<View style={{paddingTop: 2}}>
// 				<Ionicons name={"mail-outline"} size={13} color="#A0AEC0" />
// 			</View>
// 			<View>
// 				<Text style={styles.emailInfoLabel}> {userData.email}</Text>
// 			</View>
//         </View>
// 		<ParallaxScrollView
// 			headerBackgroundColor={{ light: uniColorMode.background, dark: uniColorMode.background }}
// 			headerHeight={DASHBOARD_HEADER_HEIGHT}
// 			childrenPadding={25}
// 			onScrollOffsetChange={handleScrollOffsetChange}
// 			headerImage={
// 				<View style={headerStyles.mainContainer}>
// 					<View style={headerStyles.contentContainer}>
// 						<View style={headerStyles.profileCircle}>
// 							<Text style={headerStyles.profileInitial}>{userData.supervisor[0]}</Text>
// 						</View>
// 						<Text style={[headerStyles.namesText, { color: isDark ? "#FFFFFF" : "#1A202C" }]}>{userData.supervisor}</Text>
// 						<View style={headerStyles.roleTag}>
// 							<Text style={[headerStyles.roleText]}>{userData.role}</Text>
// 						</View>
// 					</View>
// 					{!isHalfHeight && <View></View>}
// 				</View>
// 		}>

//       <View style={styles.statsContainer}>
//         <StatCard icon="cube-outline" value={userData.deliveries} label="Deliveries" variant="success" />
//         <StatCard icon="alert-circle-outline" value={userData.pendingFaults} label="Pending Faults" variant="warning" />
//       </View>

//       <View style={styles.infoContainer}>
//         <View style={[styles.infoBox, { backgroundColor: isDark ? "#2D3748" : "#FFFFFF" }]}> 
//           <InfoCard icon="location-outline" label="Location" value={userData.location} />
//           <InfoCard icon="globe-outline" label="Region" value={userData.region} />
//           <InfoCard icon="mail-outline" label="Email" value={userData.email} />
//           <InfoCard icon="call-outline" label="Phone" value={userData.phone} />
//           {userData.secondPhone && <InfoCard icon="call-outline" label="Second Phone" value={userData.secondPhone} />}
//         </View>

//         <View style={styles.actionContainer}>
// 			<ActionButton icon="person-outline" label="Supervisor" onPress={() => Linking.openURL(userData.supervisorLink)} />
// 			<ActionButton icon="help-circle-outline" label="Help Desk" onPress={() => Linking.openURL(userData.helpDeskLink)} />
//         </View>
//       </View>










// 	  </ParallaxScrollView>
//     </View>
//   );
// };


// const StatCard = ({ icon, value, label, variant }: customComponent) => {
//   const isWarning = variant === "warning";
//   return (
//     <View style={[styles.statCard, { backgroundColor: isWarning ? "#FEEBC8" : "#3bee59" }]}> 
//       <Ionicons name={icon} size={24} color={isWarning ? "#DD6B20" : "#2F855A"} />
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );
// };

// const InfoCard = ({ icon, label, value }: customComponent) => (
//   <View style={styles.infoRow}>
//     <Ionicons name={icon} size={20} color="#A0AEC0" />
//     <View>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   </View>
// );

// const ActionButton = ({ icon, label, onPress }: customComponent) => (
//   <TouchableOpacity onPress={onPress} style={styles.actionButton}>
//     <Ionicons name={icon} size={20} color="#3182CE" />
//     <Text style={styles.actionText}>{label}</Text>
//   </TouchableOpacity>
// );

// // Styles
// const styles = StyleSheet.create({
// 	// header: {
// 	//   paddingHorizontal: 24,
// 	//   paddingTop: 32,
// 	//   paddingBottom: 24,
// 	//   borderBottomLeftRadius: 20,
// 	//   borderBottomRightRadius: 20,
// 	//   alignItems: "center",
// 	// },
// 	statsContainer: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 	},
// 	statCard: {
// 	  flex: 1,
// 	  padding: 16,
// 	  borderRadius: 12,
// 	  alignItems: "center",
// 	  justifyContent: "center",
// 	  marginHorizontal: 4,
// 	},
// 	statValue: {
// 	  fontSize: 22,
// 	  fontWeight: "bold",
// 	  marginTop: 6,
// 	},
// 	statLabel: {
// 	  fontSize: 14,
// 	  color: "#718096",
// 	},
// 	infoContainer: {
// 	//   paddingHorizontal: 24,
// 	  marginTop: 24,
// 	},
// 	infoBox: {
// 	  borderRadius: 12,
// 	  padding: 16,
// 	  shadowOpacity: 0.1,
// 	  shadowRadius: 4,
// 	  shadowOffset: { height: 2, width: 0 },
// 	},
// 	emailInfoBox: {
// 		flexDirection: "row",
// 		justifyContent: 'flex-end',
// 		borderRadius: 12,
// 		// padding: 16,
// 		shadowOpacity: 0.1,
// 		shadowRadius: 4,
// 		shadowOffset: { height: 2, width: 0 },
// 	},
// 	emailInfoLabel: {
// 		fontSize: 14,
// 		color: "#A0AEC0",
// 	},
// 	infoRow: {
// 	  flexDirection: "row",
// 	  alignItems: "center",
// 	  marginBottom: 12,
// 	  gap: 12,
// 	},
// 	infoLabel: {
// 	  fontSize: 14,
// 	  color: "#A0AEC0",
// 	},
// 	infoValue: {
// 	  fontSize: 16,
// 	  fontWeight: "500",
// 	},
// 	actionContainer: {
// 		marginTop: 20,
// 		flexDirection: "row",
// 		justifyContent: "space-around",
// 	},
// 	actionButton: {
// 	  flexDirection: "row",
// 	  alignItems: "center",
// 	  paddingVertical: 12,
// 	  paddingHorizontal: 16,
// 	  backgroundColor: "#E2E8F0",
// 	  borderRadius: 10,
// 	  marginBottom: 10,
// 	},
// 	actionText: {
// 	  marginLeft: 12,
// 	  fontSize: 16,
// 	  fontWeight: "500",
// 	},
// });
// export default Dashboard;
