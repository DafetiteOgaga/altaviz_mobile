import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert,
	useColorScheme, Image, ActivityIndicator, ScrollView,
	RefreshControl, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ScreenStyle } from '../../myConfig/navigation';
import { useColorMode } from '../../constants/Colors';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { useSegments, useRouter, usePathname } from 'expo-router';
import TimeOfDayGreeting from '../../hooks/TimeOfDayGreeting';
import { useGetDataFromStorage } from '../../context/useGetDataFromStorage';
import { useGet } from "../../requests/makeRequests";
import { useGetIcon } from "../../components/getIcon";
import { getComponentName } from "@/hooks/getComponentName";
import { useAsyncStorageMethods } from "../../context/AsyncMethodsContext";
import {UpdateModal} from '../../components/checkForUpdate';

type customComponent = {
    icon: React.ComponentProps<typeof Ionicons>['name'],
	mode?: string,
	label?: string,
	variant?: string,
	onPress?: any,
	userID?: number,
	userEmail?: string,
	urlRoute?: string,
	screen?: string,
	id?: number,
	url?: string,
	level?: string,
	onRefresh?: ()=>void,
	endOnRefresh?: (value: boolean)=>void,
}

const DASHBOARD_HEADER_HEIGHT = 200;

const Dashboard = () => {
	getComponentName()
	const packageJson = require("../../package.json");
	const pathname = usePathname().split('/')[1]
	console.log('version:', packageJson.version)
	const router = useRouter();
	const segments = useSegments();
	const { setItem, getItem, removeItem } = useAsyncStorageMethods();
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	const [modalVisible, setModalVisible] = useState(false);
	const [newVersionNumber, setNewVersionNumber] = useState<boolean|null>(null);
	const [newVersion, setNewVersion] = useState<boolean|null>(null);
	useEffect(() => {
		if (getData?.version && getData.version !== packageJson.version) {
			setNewVersion(true);
			setModalVisible(true);
			setNewVersionNumber(getData?.version);
		} else setNewVersion(false);
		console.log(
			'\ncurrentVersion:', packageJson.version,
			"\nnew version:", getData?.version,
            "\nnew version available", newVersion,
		)
	}, [getData]);

	const handleUpdate = () => {
		if (newVersionNumber) {
			setModalVisible(false);
			console.log('update clicked')
			Linking.openURL(`https://github.com/DafetiteOgaga/altavizMobileReleases/releases/download/${newVersionNumber}/altaviz.apk`)
			setNewVersion(false);
		}
	};

	const uniColorMode = useColorMode()
	const dashboardData = useGetDataFromStorage('loginData')
	// console.log('dashboard', JSON.stringify(dashboardData, null, 4))
	useEffect(() => {
		if (!dashboardData) {
			// removeItem("loginData");
            // removeItem("baseUrl");
            // removeItem("headerDetails");
            // console.log("Removed login details");
			const delayRouter = setTimeout(() => {
				router.replace('/login')
			}, 2000)
			return () => clearTimeout(delayRouter)
		}
	}, [dashboardData])
	// const timeNow = useRef(Date.now().getTime());
	// useEffect(() => {
	// 	// const getVersion = setInterval(() => {
	// 		GetSetup('version/')
	// 		// }, 1000*60*60*24);
	// 	// }, 10000)
	// 	// return () => clearInterval(getVersion)
	// }, [pathname])
	const lastRun = useGetDataFromStorage("lastRunTime");
	useEffect(() => {
		const now = Date.now();
		console.log({now})
		// const TWENTY_FOUR_HOURS = 1000 * 60
		const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

		if (!lastRun || now - parseInt(lastRun) >= TWENTY_FOUR_HOURS) {
			GetSetup("version/");
			setItem("lastRunTime", now.toString());
		}
	}, [pathname]);
	// useEffect(() => {
	// if (getData) {
	// 	// checkForUpdate(getData)
	// 	return (
	// 		<UpdateModal
	// 		visible={modalVisible}
	// 		onClose={() => setModalVisible(false)}
	// 		onUpdate={handleUpdate}
	// 		newVersion={getData?.version}
	// 		/>
	// 	)
	// }
	// }, [getData, isGetError, isGetLoading])
	// const [userData, setUserData] = useState(null);
	// const [scrollOffset, setScrollOffset] = useState(0);
	
	if (!dashboardData) return <ActivityIndicator style={{marginTop: 250}} size="large" color={uniColorMode.buttonSpin} />
	

	// const handleScrollOffsetChange = (value: any) => {
	// 	console.log({value});
	// 	console.log('##########################')
	// 	setScrollOffset(value);
	// };
	// if (getData) setUserData(getData)
	// console.log('getData: '.repeat(3), getData)
	const handleRefresh = () => { // Refresh/pull new data from server upon refresh
        setRefreshing(true);
    }
	// const endRefresh = () => { // Refresh/pull new data from server upon refresh
    //     setRefreshing(false);
    // }
	const role = dashboardData?.role
	// console.log('role (dashboard):', role)
	// console.log('email:', dashboardData?.email)
	// console.log('segments:', segments)
	if (newVersion) {
		// checkForUpdate(getData)
		return (
			<UpdateModal
			visible={modalVisible}
			onClose={() => {
				setNewVersion(false);
				console.log('close clicked')
				// setModalVisible(false);
			}}
			onUpdate={handleUpdate}
			newVersion={newVersionNumber}
			/>
		)
	}
	console.log('\n',{newVersion})
	console.log('pathname:', pathname?pathname:'no pathname',
		{lastRun}
	)
	// console.log('\nnewversion:', newVersion.current)
	const headerImage = require('../../assets/images/altavizDoodleLight.png')
	const backgroundImage = require('../../assets/images/altavizDoodleDark.png')
	return (
		<ImageBackground source={backgroundImage} style={{ flex: 1 }}>
			<ScrollView
			refreshControl={
				<RefreshControl
				refreshing={refreshing}
				onRefresh={handleRefresh}
				colors={[uniColorMode.mb]}
				tintColor={uniColorMode.mb} // iOS spinner color
				/>}
			style={[ScreenStyle.allScreenContainer]}>
					<View style={[styles.emailInfoBox]}>
						<View>
							<Text style={styles.versionInfoLabel}>{packageJson.version}</Text>
						</View>
						<View style={{flexDirection: "row", alignItems: 'center',}}>
							<View style={{paddingTop: 2}}>
								<Ionicons name={"mail-outline"} size={13} color="#A0AEC0" />
							</View>
							<View>
								<Text style={styles.emailInfoLabel}> {dashboardData?.email}</Text>
							</View>
						</View>
					</View>
					
						<ParallaxScrollView
							headerBackgroundColor={{ light: uniColorMode.background, dark: uniColorMode.background }}
							headerHeight={DASHBOARD_HEADER_HEIGHT}
							childrenPadding={10}
							// onScrollOffsetChange={handleScrollOffsetChange}
							headerImage={
								<>
									<Image source={headerImage}
									style={{position: 'absolute', top: 0, left: 0, width: 391.7, height: 200,
										borderWidth: 0.5, borderColor: '#A4978E'
									}}
									/>
									<View style={{position: 'absolute', top: 10, left: 10, right: 0, bottom: 0,
										// justifyContent: 'center', alignItems: 'center'
										}}>
										<TimeOfDayGreeting name={dashboardData?.first_name}/>
									</View>
								</>
							}
						>
								<>
								{/* engineer */}
								{role==='engineer' &&
								<>
									<View style={styles.statsMainContainer}>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="cog-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="request-component"
												label="Pending Component Requests" variant="pendingComponents" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="cube-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="request-part"
												label="Pending Part Requests" variant="pendingParts" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
									<View style={styles.statsMainContainer}>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="construct-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="engineer-pending-faults"
												label="Pending Faults" variant="faults" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="hourglass-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="engineer-unconfirmed-faults"
												label="Unconfirmed Resolutions" variant="unconfirmedResolutions" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
								</>}

								{/* custodian */}
								{role==='custodian' &&
								<>
									<View style={styles.statsMainContainer}>
										<CreateFaultButton
											icon="construct-outline"
											screen='/createFault'
											userEmail={dashboardData?.email}
											// userID={dashboardData?.id}
											// mode='fault'
											// urlRoute="pending-faults"
											label="Log Fault"
											// variant="faults" // screen="pendingFaults"
											// onRefresh={handleRefresh}
											// endOnRefresh={setRefreshing}
											/>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="construct-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="pending-faults"
												label="Pending Faults" variant="faults" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="hourglass-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="unconfirmed-faults"
												label="Unconfirmed Resolutions" variant="unconfirmedResolutions" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
								</>}

								{/* workshop */}
								{role==='workshop' &&
								<>
									<View style={styles.statsMainContainer}>
										<View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
											<CreateFaultButton
												icon="cog-outline"
												screen='/requestItem'
												url='request-component'
												userEmail={dashboardData?.email}
												// userID={dashboardData?.id}
												// mode='fault'
												// urlRoute="pending-faults"
												label="Request Component"
												// variant="faults" // screen="pendingFaults"
												// onRefresh={handleRefresh}
												// endOnRefresh={setRefreshing}
												/>
											<CreateFaultButton
											icon="cube-outline"
											screen='/requestItem'
											url='post-part'
											userEmail={dashboardData?.email}
											// userID={dashboardData?.id}
											// mode='fault'
											// urlRoute="pending-faults"
											label="Post Part"
											// variant="faults" // screen="pendingFaults"
											// onRefresh={handleRefresh}
											// endOnRefresh={setRefreshing}
											/>
										</View>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="cog-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="request-component"
												label="Pending Component Requests" variant="pendingComponents" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="cube-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="post-part"
												label="Posted Parts" variant="pendingParts" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
								</>}

								{/* help-desk */}
								{role==='help-desk' &&
								<>
									<View style={styles.statsMainContainer}>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="hourglass-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="user-request"
												label="Engineers with Pending Requests" variant="faults" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="ban-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="regional-unconfirmed-faults"
												label="Engineers with Unresolved Faults" variant="unconfirmedResolutions" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
								</>}

								{/* supervisor */}
								{role==='supervisor' &&
								<>
									<View style={styles.statsMainContainer}>
										<CreateFaultButton
											icon="location-outline"
											screen='/engineersToLocations'
											userEmail={dashboardData?.email}
											// level='supervisor'
											// onRefresh={handleRefresh}
											// endOnRefresh={setRefreshing}
											userID={dashboardData?.id}
											// mode='fault'
											urlRoute="new-location-assignment"
											label="Locations waiting to be Assigned"
											// variant="faults" // screen="pendingFaults"
											onRefresh={handleRefresh}
											endOnRefresh={setRefreshing}
											/>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="hourglass-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="user-request"
												label="Engineers with Pending Requests" variant="faults" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="ban-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="regional-unconfirmed-faults"
												label="Engineers with Unresolved Faults" variant="unconfirmedResolutions" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
								</>}

								{/* human-resource */}
								{role==='human-resource' &&
								<>
									<View style={styles.statsMainContainer}>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="cog-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="workshop-component-request"
												label="Workshop Requests" variant="pendingComponents" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="cube-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="post-part"
												label="Fixed Parts" variant="pendingParts" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
									<View style={styles.statsMainContainer}>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="person-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="approve-user-details-update"
												label="Account Update Requests" variant="account" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="hourglass-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="all-request-faults"
												label="Engineers with Requests" variant="unconfirmedResolutions" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
									<View style={styles.statsMainContainer}>
										<View style={styles.statsContainer}>
											{/* @ts-ignore */}
											<StatCard
												icon="construct-outline"
												userID={dashboardData?.id}
												mode='fault'
												urlRoute="all-pending-faults-wRequests"
												label="All Faults With requests" variant="allFaults" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
											<StatCard
												icon="hourglass-outline"
												userID={dashboardData?.id}
												mode='request'
												urlRoute="all-request-only"
												label="All Combined Requests" variant="allRequests" // screen="pendingFaults"
												onRefresh={handleRefresh}
												endOnRefresh={setRefreshing}
												/>
										</View>
									</View>
								</>}

								{/* white buttons */}
								{/* <View style={styles.actionContainer}>
									<ActionButton icon="person-outline" label="Supervisor" onPress={() => router.push('/userProfile')} />
									<ActionButton icon="help-circle-outline" label="Help Desk" onPress={() => router.push('/userProfile')} />
								</View> */}
								</>
						</ParallaxScrollView>
				{/* </ImageBackground> */}
			</ScrollView>
		</ImageBackground>
	);
};

const CreateFaultButton = ({ userID, userEmail, icon, label, screen, url, urlRoute, onRefresh, endOnRefresh }: customComponent) => {
	getComponentName()
	const pathname = usePathname().split('/')[1]
	// console.log('pathname:', pathname, !!pathname)
	const dashboardData = useGetDataFromStorage('loginData')
	// const email = dashboardData?.email
	// const id = dashboardData?.id
	const uniColorMode = useColorMode()
	const router = useRouter()
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	useEffect(()=>{
			if (!pathname) fetchData()
	}, [onRefresh])
	if (pathname) return
	const fontColor = '#bbb'
	const fetchUrl = `${urlRoute}/${userID}/total/`
	const fetchHasUndefined = fetchUrl?.split?.('/')?.some?.((word:any)=>word==='undefined')
	const fetchData = () => {
		if (!fetchHasUndefined){
			// console.log('\nFetching data ###############', fetchUrl)
			GetSetup(fetchUrl)
			if (endOnRefresh) endOnRefresh(false)
		}
	}
	// console.log('in CreateFaultButton', {screen}, {url}, {userEmail}, {userID})
	// if (!dashboardData||isGetError) return <ActivityIndicator size="small" color={uniColorMode.buttonSpin} />
	const supervisorLabel = ((dashboardData?.role==='supervisor')&&`${getData?.total} ${label}`)||undefined
	// console.log('getData in index', getData)
	// console.log(`${fetchUrl} has undefined: ${fetchHasUndefined}`)
	// console.log('isGetError:', isGetError)
	return(
		<View>
			{/* @ts-ignore */}
			{(!userID||getData?.total||isGetError) &&
			<TouchableOpacity
			style={[styles.faultButton, {backgroundColor: uniColorMode.dkrb}]}
			disabled={!!isGetError}
			onPress={()=>router.push({
				// @ts-ignore
				pathname: screen,
				params: {
					screen: screen,
					email: userEmail,
					id: userID,
					url: url,
				},
			})}>
				<Ionicons name={icon} size={20} color={isGetError?'red':fontColor} />
				<Text style={[styles.actionText, {color: isGetError?'red':fontColor, fontWeight: 'bold'}]}>{isGetError?'Oopsy! Error':supervisorLabel??label}</Text>
			</TouchableOpacity>}
		</View>
)};

const StatCard = ({ icon, mode, label, variant, onPress, userID, urlRoute, id, onRefresh, endOnRefresh }: customComponent) => {
	getComponentName()
	const pathname = usePathname().split('/')[1]
	// console.log('pathname:', pathname, !!pathname)
	const uniColorMode = useColorMode()
	const router = useRouter()
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	let {color, getIcon} = useGetIcon({variant: variant!})
	useEffect(()=>{
		if (!pathname) fetchData()
	}, [onRefresh])
	if (pathname) return
	const screen = "/pendingFaults"
	const url = `${urlRoute}/${userID}/total`
	const pressUrl = `${urlRoute}/list/${userID}/`
	const fetchData = () => {
		// console.log('in Dashboard > StatCard '.repeat(5))
		GetSetup(url)
		if (endOnRefresh) endOnRefresh(false)
	}

	if (getData?.total===0) {color = 'green'}
	else if (!getData?.total) {color = 'transparent'}
	// console.log({color}, {getIcon})
	return (
		<View style={[styles.statCardView, { backgroundColor: uniColorMode.vdrkb }]}>
		{(getData||isGetError) &&
		<TouchableOpacity
		disabled={!!isGetError}
		onPress={() => router.push({
				pathname: screen,
				params:{
					url: pressUrl,
					label: label,
					mode: mode,
					variant: variant
				}})}
			style={[styles.statCard]}
			>
			<Ionicons name={icon} size={24} color={isGetError?'red':color} />
			{/* @ts-ignore */}
			<Text style={[styles.statValue, {color: isGetError?'red':color}]}>{isGetError?'Oopsi! Error':getData?.total||0}</Text>
			<Text style={[styles.statLabel, {color: isGetError?'red':color}]}>{isGetError?'Refresh/Check back later':label}</Text>
		</TouchableOpacity>}
		</View>
	);
};

const ActionButton = ({ icon, label, onPress }: customComponent) => {
	getComponentName()
	// const uniColorMode = useColorMode()
	return(
		<TouchableOpacity onPress={onPress} style={styles.actionButton}>
			<Ionicons name={icon} size={20} color={"#3182CE"} />
			<Text style={styles.actionText}>{label}</Text>
		</TouchableOpacity>
)};

// Styles
const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	statsMainContainer: {
		marginBottom: 10,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statCardView: {
		flex: 1,
		
		borderRadius: 12,
		// alignItems: "center",
		// justifyContent: "center",
		marginHorizontal: 4,
	},
	statCard: {
		// flex: 1,
		padding: 16,
		// borderRadius: 12,
		alignItems: "center",
		// justifyContent: "center",
		// marginHorizontal: 4,
		},
	statValue: {
	  fontSize: 22,
	  fontWeight: "bold",
	  marginTop: 6,
	},
	statLabel: {
		fontSize: 14,
		color: "#718096",
		textAlign: "center",
	},
	infoBox: {
	  borderRadius: 12,
	  padding: 16,
	  shadowOpacity: 0.1,
	  shadowRadius: 4,
	  shadowOffset: { height: 2, width: 0 },
	},
	emailInfoBox: {
		flexDirection: "row",
		// justifyContent: 'flex-end',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 12,
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { height: 2, width: 0 },
	},
	emailInfoLabel: {
		fontSize: 14,
		color: "#A0AEC0",
	},
	versionInfoLabel: {
		fontSize: 12,
		color: "#A0AEC080",
	},
	infoRow: {
	  flexDirection: "row",
	  alignItems: "center",
	  marginBottom: 12,
	  gap: 12,
	},
	infoLabel: {
	  fontSize: 14,
	  color: "#A0AEC0",
	},
	infoValue: {
	  fontSize: 16,
	  fontWeight: "500",
	},
	actionContainer: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	actionButton: {
	  flexDirection: "row",
	  alignItems: "center",
	  paddingVertical: 12,
	  paddingHorizontal: 16,
	  backgroundColor: "#E2E8F0",
	  borderRadius: 10,
	  marginBottom: 10,
	},
	faultButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		// backgroundColor: "blue",
		borderRadius: 10,
		marginBottom: 10,
	},
	actionText: {
	  marginLeft: 5,
	  fontSize: 16,
	  fontWeight: "500",
	//   color: "#3182CE",
	},
});
export default Dashboard;
