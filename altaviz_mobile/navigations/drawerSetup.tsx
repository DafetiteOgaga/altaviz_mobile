import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '../constants/Colors';
import { useNavigation, usePathname } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { screenConfig } from '@/myConfig/navigation'
import { CustomDrawerHeader } from './drawerHeader';
import { Image, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useGetDataFromStorage } from '../context/useGetDataFromStorage';
import { useHeader } from '@/context/headerUpdate';
import { baseUrl } from '@/constants/urlOrigin';
import { getComponentName } from '@/hooks/getComponentName';

export default function DrawerNavigator() {
	getComponentName()
	const { headerTitle } = useHeader();
	const uniColorMode = useColorMode();
	let path:string|null = usePathname();
	const navigation: any|undefined = useNavigation();
	const [,titleKey] = path?.split('/')
	const drawerData = useGetDataFromStorage('headerDetails')
	// console.log('\ndrawerSetup', {path},{drawerData}, {baseUrl})
	if (!drawerData) (<ActivityIndicator size="small" color={uniColorMode.buttonSpin} />)
	// console.log('drawer titleKey:', titleKey)
	// console.log('drawer drawerData:', drawerData)
	let loggedIn = false
	if (drawerData) loggedIn = true
	// console.log({headerTitle})
	let fault = true
	if (String(headerTitle)?.split?.(' ')?.some?.(item=>item.toLowerCase()==='component'||item.toLowerCase()==='part')) fault = false
	const resolvedHeaderTitle = useRef<string|undefined>(undefined)
	useEffect(()=>{
		resolvedHeaderTitle.current =
			(titleKey==='')?'Home Title Drawer':
			(titleKey==='blueBlank')?headerTitle:
			(titleKey==='detailsRequestCardView')?headerTitle:
			(titleKey==='cardView')?headerTitle:
			(titleKey==='engineersCardView')?headerTitle:
			(titleKey==='engineersToLocations')?headerTitle:
			(titleKey==='userChangeRequest')?headerTitle:
			(titleKey==='engineersFaults')?headerTitle:
			(titleKey==='createFault')?headerTitle:
			(titleKey==='requestItem')?headerTitle:
			(titleKey==='pendingFaults'&&fault)?headerTitle:
			(titleKey==='pendingFaults'&&!fault)?headerTitle:
			(titleKey==='detailScreen'&&fault)?headerTitle:
			(titleKey==='detailScreen'&&!fault)?headerTitle:
			// (titleKey!=='pendingFaults'&&titleKey!=='detailScreen')?
			`${screenConfig[titleKey]?.title}`
	})
	
	resolvedHeaderTitle?.current!?.trim()
	return (
		<>
			<Drawer
			drawerContent={drawerData?(props) => <CustomDrawerHeader {...props} userData={drawerData} isDark={true} baseUrl={baseUrl} />:undefined}
			screenOptions={{
				headerLeft: () => (
					<>
					{(titleKey==='login'||!drawerData) ?
					(<Text style={{marginRight: 10}}></Text>)
					:
					(<TouchableOpacity onPress={() => (
						// titleKey!=='login'?
						navigation.dispatch(DrawerActions.toggleDrawer())
					// :null
					)}>
						{
						// (titleKey==='login'||!drawerData)?
						// (<Ionicons
						// 	name="menu"
						// 	size={30}
						// 	color={uniColorMode.text}
						// 	style={styles.headerImageIcon}
						// 	/>):
						(<Image
							source={{ uri: `${baseUrl}${drawerData?.profile_picture}` }}
							style={[styles.headerImageIcon, {borderColor: '#fff',}]}
							resizeMode="contain"
						/>)}
					</TouchableOpacity>)}
					</>
				),
				headerShown: true,
				drawerActiveBackgroundColor: uniColorMode.dkb,
				drawerActiveTintColor: uniColorMode.text,
				drawerInactiveTintColor: uniColorMode.icon,
				// headerSearchBarOptions: titleKey!=='login'?{
				// 	placeholder: 'Search',
				// 	onChangeText: (e) => console.log(e.nativeEvent.text),
				// }:undefined,
				headerStyle: {
					backgroundColor: uniColorMode.background,
					// You can add more custom styling here.
				},
				headerTitleStyle: {
					fontWeight: 'bold',
					marginLeft: 5,
					// You can add more custom styling here
				},
				// headerTitleAlign: 'center',
				// You can add more custom styling here
				drawerStyle: {
					backgroundColor: uniColorMode.vdrkb, // Background color
					width: 250, // Set drawer width
					// padding: 15, // Add padding inside drawer
					paddingTop: 20,
					borderTopRightRadius: 20, // Rounded corners on the top
					borderBottomRightRadius: 20, // Rounded corners on the bottom
				},
				drawerLabelStyle: {
					fontSize: 16, // Customize label size
					fontWeight: 'bold',
					// marginLeft: 10, // Add spacing to the left
				},
				drawerItemStyle: {
					// paddingVertical: 10, // Spacing inside each item
					// marginVertical: 5, // Adds space between items
					// borderBottomWidth: 1, // Adds a line below each item
					// borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Light separator
				}
			}}
			>
				<Drawer.Screen
					name="(tabs)"
					options={({navigation})=>({
						title: screenConfig['index'].title,
						headerTitle: resolvedHeaderTitle.current,
						drawerIcon: ({focused, color, size}) => (
							<Ionicons name={screenConfig['index'].icon} size={size} color={focused? color : color} />
						)
					})}
					// listeners={{
					// 	drawerItemPress: (e) => {
					// 		e.preventDefault();
					// 		navigation.navigate('(tabs)', { screen: 'index' });
					// 	}
					// }}
				/>
				<Drawer.Screen
					name="login"
					options={{
						drawerItemStyle: loggedIn?{ height: 0 }:null,
						title: screenConfig['login'].title,
						headerTitle: 'Login',
						drawerIcon: ({focused, color, size}) => (
							<Ionicons name={screenConfig['login'].icon} size={size} color={focused? color : color} />
						)
					}}
				/>
				<Drawer.Screen
					name="settings"
					options={{
						title: screenConfig['settings'].title,
						headerTitle: 'Settings',
						drawerIcon: ({focused, color, size}) => (
							<Ionicons name={screenConfig['settings'].icon} size={size} color={focused? color : color} />
						),
						drawerItemStyle: {
							// backgroundColor: 'rgba(255, 255, 255, 0.1)',  // Custom background for this item
							// borderRadius: 10,  // Add rounded corners
							// marginVertical: 8,  // Increase spacing
							// borderTopWidth: 1,  // Add a border
							// borderColor: 'rgba(255, 255, 255, 0.3)',  // Border color
							// paddingBottom:400,
							marginBottom: 50,
							// width: '80%',
							// height: 1,
							// backgroundColor: 'grey',
							// width: 250,
						},
						// drawerLabelStyle: {
						// 	fontSize: 16, // Customize label size
						// 	fontWeight: 'bold',
						// // fontSize: 18,  // Increase font size
						// // fontWeight: 'bold',
						// // color: '#ff5733',  // Change text color
						// }
					}}
				/>
				<Drawer.Screen
					name="logout"
					options={{
						drawerItemStyle: loggedIn?{
							// backgroundColor: 'rgba(255, 255, 255, 0.1)',  // Custom background for this item
							// borderRadius: 10,  // Add rounded corners
							// marginVertical: 8,  // Increase spacing
							borderTopWidth: 1,  // Add a border
							borderColor: 'rgba(255, 255, 255, 0.3)',  // Border color
							// paddingBottom:400,
							marginBottom: 320,
							// width: '80%',
							// height: 1,
							// backgroundColor: 'grey',
							// width: 250,
						}:{ height: 0 },
						title: screenConfig['logout'].title,
						headerTitle: 'Login',
						drawerIcon: ({focused, color, size}) => (
							<Ionicons name={screenConfig['logout'].icon} size={size} color={focused? color : color} />
						),
					}}
				/>
				<Drawer.Screen
					name="about"
					options={{
						title: screenConfig['about'].title,
						headerTitle: 'About',
						drawerIcon: ({focused, color, size}) => (
							<Ionicons name={screenConfig['about'].icon} size={size} color={focused? color : color} />
						),
						drawerItemStyle: {
							// backgroundColor: 'rgba(255, 255, 255, 0.1)',  // Custom background for this item
							// borderRadius: 10,  // Add rounded corners
							// marginVertical: 8,  // Increase spacing
							borderTopWidth: 1,  // Add a border
							borderColor: 'rgba(255, 255, 255, 0.3)',  // Border color
							// paddingBottom:400,
							// marginBottom: 400,
							// width: '80%',
							// height: 1,
							// backgroundColor: 'grey',
							// width: 250,
						},
					}}
				/>
				<Drawer.Screen
					name="+not-found"
					options={{
						drawerItemStyle: { height: 0 },  // This hides the item from drawer
					}}
				/>
				{/* <Drawer.Screen
					name="testlogin"
					options={{
						drawerItemStyle: { height: 0 },  // This hides the item from drawer
					}}
				/> */}
			</Drawer>
		</>
	);
}

const styles = StyleSheet.create({
	headerImageIcon: {
		width: 30,
		height: 30,
		marginLeft: 15,
		borderWidth: 1,
		// borderColor: '#fff',
		borderRadius: 50
	},
	emailInfoBox: {
		flexDirection: "row",
		justifyContent: 'flex-end',
		borderRadius: 12,
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { height: 2, width: 0 },
	},
	emailInfoLabel: {
		fontSize: 14,
		color: "#A0AEC0",
	},
})