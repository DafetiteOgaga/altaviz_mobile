import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet,
	useColorScheme, Image, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ScreenStyle } from '../../myConfig/navigation';
import { useColorMode } from '../../constants/Colors';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { useNavigation } from 'expo-router';
import TimeOfDayGreeting from '../../hooks/TimeOfDayGreeting';
import { useGetDataFromStorage } from '../../context/useGetDataFromStorage';
import { useGet } from "../../requests/makeRequests";
import { useGetIcon } from "../../components/getIcon";

type customComponent = {
    icon: React.ComponentProps<typeof Ionicons>['name'],
	mode?: string,
	label?: string,
	variant?: string,
	onPress?: any,
	userID?: number,
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
	const [refreshing, setRefreshing] = useState<boolean>(false);
	// const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	// const [userData, setUserData] = useState(null);
	const navigation: any|undefined = useNavigation();
	// const [scrollOffset, setScrollOffset] = useState(0);
	const uniColorMode = useColorMode()
	// const colorScheme = useColorScheme();
	// const isDark = colorScheme === "dark";
	const dashboardData = useGetDataFromStorage('loginData')
	console.log('dashboard', JSON.stringify(dashboardData, null, 4))
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
	console.log('role (dashboard):', role)
	console.log('email:', dashboardData?.email)
	return (
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
				<View style={{paddingTop: 2}}>
					<Ionicons name={"mail-outline"} size={13} color="#A0AEC0" />
				</View>
				<View>
					<Text style={styles.emailInfoLabel}> {dashboardData?.email}</Text>
				</View>
			</View>
			<ParallaxScrollView
				headerBackgroundColor={{ light: uniColorMode.background, dark: uniColorMode.background }}
				headerHeight={DASHBOARD_HEADER_HEIGHT}
				childrenPadding={10}
				// onScrollOffsetChange={handleScrollOffsetChange}
				headerImage={
					<>
						{/* <Image source={companyLogo} style={{width: 100, height: 50}} /> */}
						<View>
							<TimeOfDayGreeting name={dashboardData?.first_name}/>
						</View>
					</>
				}
			>
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
							screen='createFault'
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
								screen='requestItem'
								url='request-component'
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
							screen='requestItem'
							url='post-part'
							// userID={dashboardData?.id}
							// mode='fault'
							// urlRoute="pending-faults"
							label="Request Part"
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
							screen='engineersToLocations'
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
				<View style={styles.actionContainer}>
					<ActionButton icon="person-outline" label="Supervisor" onPress={() => navigation.navigate('userProfile')} />
					<ActionButton icon="help-circle-outline" label="Help Desk" onPress={() => navigation.navigate('userProfile')} />
				</View>
			</ParallaxScrollView>
		</ScrollView>
	);
};

const CreateFaultButton = ({ userID, icon, label, screen, url, urlRoute, onRefresh, endOnRefresh }: customComponent) => {
	const dashboardData = useGetDataFromStorage('loginData')
	const email = dashboardData?.email
	// const id = dashboardData?.id
	const uniColorMode = useColorMode()
	const fontColor = '#bbb'
	const navigation:any = useNavigation();
	const fetchUrl = `${urlRoute}/${userID}/total/`
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	const fetchData = () => {
		// console.log('in Dashboard > StatCard '.repeat(5))
		GetSetup(fetchUrl)
		if (endOnRefresh) endOnRefresh(false)
	}
	useEffect(()=>{
		// console.log('fetcing in Dashboard > StatCard '.repeat(5))
		fetchData()
	}, [onRefresh])
	console.log('in CreateFaultButton', {email}, {userID})
	if (!dashboardData||isGetLoading) return <ActivityIndicator size="small" color={uniColorMode.buttonSpin} />
	// @ts-ignore
	const supervisorLabel = (dashboardData?.role==='supervisor')&&`${getData?.total} ${label}`
	console.log('getData in index', getData)
	return(
		<View>
			{/* @ts-ignore */}
			{(!userID||getData?.total) &&
			<TouchableOpacity
			style={[styles.faultButton, {backgroundColor: uniColorMode.dkrb}]}
			onPress={()=>navigation.navigate(screen, {
				screen: screen,
				email: email,
				id: userID,
				url: url,
			})}>
				<Ionicons name={icon} size={20} color={fontColor} />
				<Text style={[styles.actionText, {color: fontColor, fontWeight: 'bold'}]}>{supervisorLabel??label}</Text>
			</TouchableOpacity>}
		</View>
)};

const StatCard = ({ icon, mode, label, variant, onPress, userID, urlRoute, id, onRefresh, endOnRefresh }: customComponent) => {
	const screen = "pendingFaults"
	const uniColorMode = useColorMode()
	const navigation: any|undefined = useNavigation();
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	const url = `${urlRoute}/${userID}/total`
	const pressUrl = `${urlRoute}/list/${userID}/`
	let {color, getIcon} = useGetIcon({variant: variant!})
	const fetchData = () => {
		// console.log('in Dashboard > StatCard '.repeat(5))
		GetSetup(url)
		if (endOnRefresh) endOnRefresh(false)
	}
	useEffect(()=>{
		// console.log('fetcing in Dashboard > StatCard '.repeat(5))
		fetchData()
	}, [onRefresh])

	// @ts-ignore
	if (getData?.total===0) {color = 'green'}
	// @ts-ignore
	else if (!getData?.total) {color = 'transparent'}
	// console.log({color}, {getIcon})
	return (
		<View style={[styles.statCardView, { backgroundColor: uniColorMode.vdrkb }]}>
		{(isGetLoading&&!getData)?
			<ActivityIndicator style={{
				padding: 16,
			}} size="small" color={uniColorMode.buttonSpin} />:
		<TouchableOpacity
		onPress={() => navigation.navigate(
			screen,
			{
				url: pressUrl,
				label: label,
				mode: mode,
				variant: variant
			})}
			style={[styles.statCard]}
			>
			<Ionicons name={icon} size={24} color={color} />
			{/* @ts-ignore */}
			<Text style={[styles.statValue, {color: color}]}>{getData?.total||0}</Text>
			<Text style={[styles.statLabel, {color: color}]}>{label}</Text>
		</TouchableOpacity>}
		</View>
	);
};

const ActionButton = ({ icon, label, onPress }: customComponent) => {
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
		justifyContent: 'flex-end',
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
