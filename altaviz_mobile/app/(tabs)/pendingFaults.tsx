import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity,
	RefreshControl, Modal } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenStyle, generalstyles } from '../../myConfig/navigation';
// import { useHeader } from '@/context/headerUpdate';
import { useGet } from '@/requests/makeRequests';
import { useColorMode } from '@/constants/Colors';
import { useGetIcon } from '@/components/getIcon';
import { CardView } from '../../components/cardView';
import { EngineerCardView } from '@/components/engineersCardView';
import { DetailsRequestCardView } from '../../components/detailsRequestCardView';
import { useGetDataFromStorage } from '@/context/useGetDataFromStorage';
import { getComponentName } from '@/hooks/getComponentName';

export default function PendingFaults() {
	getComponentName()
	const userDetails = useGetDataFromStorage('headerDetails')
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const uniColorMode = useColorMode();
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	const [showWaiting, setShowWaiting] = useState(false);
	const {url, label, mode, variant} = useLocalSearchParams();
	// console.log(
	// 	'\nin pendingFaults #######:',
	// 	// '\ndata:', JSON.stringify(userData, null, 4),
    //     '\n', {url},
    //     '\n', {label},
    //     '\n', {mode},
    //     '\n', {variant},
	// )
	const router = useRouter()
	// @ts-ignore
	useEffect(()=>{GetSetup(url)}, [url])
	let name
	// console.log('in pendingFaults', {label})
	const nameList = String(label).split(' ')
	if (nameList.length===3||label==='Posted Parts'||label==='Fixed Parts') {name = nameList[1]}
	else {name = 'Fault'}
	// console.log('name:', {name})
	const handleRefresh = async () => { // Refresh/pull new data from server upon refresh
        setRefreshing(true);
		// @ts-ignore
        await GetSetup(url)
        setRefreshing(false);
    }
	const {getIcon, color} = useGetIcon({variant: String(variant)})
	// const { setHeaderTitle } = useHeader();
	// useEffect(()=>setHeaderTitle(String(label)), [isGetLoading, url, label, variant])
	const role = userDetails?.role
	// console.log('in pendingFaults', {role})
	const accountUpdate = (role==='human-resource'&&label==='Account Update Requests')||null
	// console.log('in pendingFaults', {role})
	const HRExceptuion = String(url)?.split?.('-')?.[3]?.split?.('/')?.[0]
	const supervisor_HelpDesk_HR = role==='help-desk'||role==='supervisor'||(role==='human-resource'&&mode==='fault'&&!HRExceptuion)
	// console.log('pendingFaults (first item):', JSON.stringify(getData?.[0], null, 4))
	const allHRRequests = String(url)?.split?.('/')[0] === 'all-request-only'
	const navigationHandler = (item:any, user:any) => {
		setShowWaiting(true);
		const clicked = setTimeout(() => {
				router.push({
					pathname: accountUpdate?'/userChangeRequest':supervisor_HelpDesk_HR?'/engineersFaults':'/detailScreen',
					params: {
						data: JSON.stringify(item),
						arrayData: JSON.stringify(getData),
						type: name,
						variant: variant,
						user: user,
						label: String(label),
					}
				})
				setShowWaiting(false);
		}, 100);
		return () => {clearTimeout(clicked)}
	}
	return (
		<>
			{(!isGetLoading&&getData)?
				(<>
					{showWaiting && <Waiting />}

					<View style={[ScreenStyle.allScreenContainer, styles.listContainer]}>
						<FlatList
						data={getData}
						keyExtractor={(item: Record<string, any>) => item.id.toString()}
						renderItem={({ item }) => {
							const user = accountUpdate?userDetails?.id:item?.first_name
							// console.log('pendingFaults:', {user})
							return (
								<TouchableOpacity
								activeOpacity={0.8}
								onPress={()=>{navigationHandler(item, user)}}
								>{accountUpdate?
									<DetailsRequestCardView mode={String(mode)} icon={getIcon!} color={color!} item={item} role={role} label={String(label)}/>
									:
									supervisor_HelpDesk_HR?
										<EngineerCardView mode={String(mode)} icon={getIcon!} color={color!} item={item} role={role} label={String(label)}/>
										:
										<CardView mode={String(mode)} icon={getIcon!} color={color!} item={item} role={role} label={String(label)} swapCard={allHRRequests}/>}
								</TouchableOpacity>
							)}}
						ItemSeparatorComponent={()=><View style={{height: 6}} />}
						ListEmptyComponent={()=><Text style={[generalstyles.notFound, {color: uniColorMode.text,}]}>{'All Good! 💪\nNothing to Display'}</Text>}
						refreshControl={
							<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							colors={[uniColorMode.mb]}
							tintColor={uniColorMode.mb} // iOS spinner color
							/>
						}
						/>
					</View>
				</>)
				:
				<ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />
			}
		</>
	)
}

function Waiting () {
	const uniColorMode = useColorMode();
	return (
		<Modal visible={true} animationType="fade" transparent>
			<View style={styles.overlay}>
				<ActivityIndicator size="large" color={uniColorMode.buttonSpin} />
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	listContainer:{
		paddingHorizontal: 20,
		marginVertical: 10
	},
	loading: {
		marginTop: 250,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
		zIndex: 1000,
	},
})


// {isNavigating && (
// 	<View style={styles.overlay}>
// 		<ActivityIndicator size="large" color={uniColorMode.buttonSpin} />
// 	</View>
// )}

// overlay: {
// 	position: "absolute",
// 	top: 0,
// 	left: 0,
// 	right: 0,
// 	bottom: 0,
// 	justifyContent: "center",
// 	alignItems: "center",
// 	backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
// 	zIndex: 1000,
// },