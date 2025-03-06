import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView,
	Image, TouchableOpacity
 } from 'react-native';
import React, {useEffect} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenStyle } from '../../myConfig/navigation';
// import { ThemedText } from '../../components/ThemedText';
import { useGet, usePatch } from '../../requests/makeRequests';
import { useColorMode } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { toTitleCase } from '../../hooks/useAllCases';
import { baseUrl } from '../../constants/urlOrigin';
import { useHeader } from '../../context/headerUpdate';
import { getComponentName } from '@/hooks/getComponentName';
// import { useGetDataFromStorage } from '@/context/useGetDataFromStorage';

interface getTypes {
	getData: {[key: string]: any}|null;
	isGetError: string|null;
	isGetLoading: boolean;
	GetSetup: (url: string) => Promise<void>;
}
export default function UserChangeRequest() {
	getComponentName()
	const { setHeaderTitle } = useHeader();
	useEffect(()=>setHeaderTitle('Details Update Request'))
	// const baseUrl = useGetDataFromStorage('baseUrl')
	// console.log('baseUrl (inspectUserProfile):', baseUrl)
	const uniColorMode = useColorMode();
	const {patchData, isPatchError, isPatchLoading, PatchSetup} = usePatch();
	const {getData, isGetError, isGetLoading, GetSetup}: getTypes = useGet();
	const {data, arrayData, type, variant, user, label} = useLocalSearchParams();
	const router = useRouter();
	const dataItem = JSON.parse(String(data))
	const arrayDataItem = JSON.parse(String(arrayData))
	// console.log(
	// 	'\nin UserChangeRequest',
	// 	'\ndataItem(item):', JSON.stringify(dataItem, null, 4),
	// 	// '\n', {arrayData},
	// 	'\n', {type},
	// 	'\n', {variant},
	// 	'\n', {user},
	// 	'\n', {label}
	// )
	const url = `user/${dataItem?.requestUser?.id}/`
	// console.log('id (user profile):', id, {url});
	// console.log('getData:', (JSON.stringify(getData, null, 4)));
	useEffect(()=>{
		// console.log('in PendingFaults '.repeat(5))
		GetSetup(url)
	}, [url])
	// let dataItem: any = undefined
	// if (dataItem) dataItem = dataItem
	const submitHandler = (response:string) => {
		const formData = new FormData();
		formData.append(response, 'true');
		formData.append('userID', dataItem?.requestUser?.id);
		formData.append('updateRequestID', dataItem?.id);
		PatchSetup(`approve-user-details-update/${user}/`, formData)
    };
	let userData: any
	if (getData) userData = getData

	return (
		<ScrollView style={[ScreenStyle.allScreenContainer, styles.mainContainer]}>
			{(!dataItem||isGetLoading) ?
			(<ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />)
			:
			(<>
				<View style={styles.headerContainer}>
					<Image
						source={{ uri: `${baseUrl}${userData?.profile_picture}` }}
						style={styles.profileImage}
						resizeMode="cover"
					/>
					<View style={styles.userInfoContainer}>
						<Text style={[styles.userName, {color: uniColorMode.text}]}>{toTitleCase(userData?.first_name||'')} {toTitleCase(userData?.last_name||'')}</Text>
						<Text style={[styles.userHandle, {color: uniColorMode.text}]}>{toTitleCase(userData?.username||'')}</Text>
						<View style={[styles.role, {backgroundColor: uniColorMode.sdkb}]}>
							<Text style={[{color: uniColorMode.text}]}>{toTitleCase(userData?.role||'')}</Text>
						</View>
						<View style={{flexDirection: 'row',}}>
							<View style={[styles.infoItem]}>
								<Ionicons name="person-outline" size={10} color={uniColorMode.text} />
								<Text style={[styles.infoText, {color: uniColorMode.text, marginLeft: 3,}]}>{toTitleCase(userData?.gender||'')}</Text>
							</View>
							{(userData?.role!=='custodian'&&userData?.role!=='human-resource') &&
							<View style={[styles.infoItem, {marginLeft: 10}]}>
								<Ionicons name={'cube-outline'} size={13} color={uniColorMode.text} />
								<Text style={[styles.infoText, {color: uniColorMode.text, marginLeft: 3,}]}>{userData?.deliveryPoints?.deliveries}</Text>
							</View>}
						</View>
					</View>
				</View>

				<View style={styles.sectionContainer}>
					{/* <Text style={styles.sectionTitle}>About</Text> */}
					<View style={styles.infoItem}>
						<Ionicons name="mail-outline" size={20} color={uniColorMode.text} />
						<Text style={styles.infoText}>{userData?.email}</Text>
					</View>
					<View style={styles.infoItemContainer}>
						<View style={styles.infoItem}>
							<Ionicons name="call-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{userData?.phone}</Text>
						</View>
						<View style={styles.infoItem}>
							<Ionicons name="logo-whatsapp" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{userData?.wphone}</Text>
						</View>
					</View>
					<View style={styles.infoItemContainer}>
						<View style={styles.infoItem}>
							<Ionicons name="location-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{toTitleCase(userData?.region?.name||'')}</Text>
						</View>
						<View style={styles.infoItem}>
							<Ionicons name="locate-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{toTitleCase(userData?.state?.name||'')}</Text>
						</View>
					</View>
					{userData?.role==='custodian' ?
					<>
						<View style={styles.infoItem}>
							<Ionicons name="card-outline" size={20} color={uniColorMode.text} />
							{checkForUpdate(userData?.branch?.name, dataItem?.newBranch)}
						</View>
						<View style={styles.infoItem}>
							<Ionicons name="location-outline" size={20} color={uniColorMode.text} />
							{checkForUpdate(userData?.branch?.location?.location, dataItem?.newLocation)}
						</View>
					</>
					:
					<View style={styles.infoItem}>
						<Ionicons name="location-outline" size={20} color={uniColorMode.text} />
						{checkForUpdate(userData?.location?.location, dataItem?.newLocation)}
					</View>}
					{/* <View style={styles.infoItem}>
						<Ionicons name="home-outline" size={20} color={uniColorMode.text} />
						<Text style={styles.infoText}>{toTitleCase(getData?.address||'')}</Text>
					</View> */}
					{/* <View style={styles.infoItemNoRow}>
						<Ionicons name="dice-outline" size={20} color={uniColorMode.text} />
						<Text style={styles.infoText}>{toTitleCase(getData?.aboutme||'') || 'No bio available'}</Text>
					</View> */}
				</View>
				{/* buttons */}
				<View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
					<View style={styles.actionsContainer}>
					<TouchableOpacity style={[styles.editButton, {backgroundColor: uniColorMode.newdrkb1}]}
							onPress={()=>submitHandler('approve')}>
						<Text style={[styles.editButtonText, {color: 'green'}]}>Approve</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.actionsContainer}>
					<TouchableOpacity style={[styles.editButton, {backgroundColor: uniColorMode.newdrkb1}]}
							onPress={()=>submitHandler('reject')}>
						<Text style={[styles.editButtonText, {color: 'red'}]}>Reject</Text>
						</TouchableOpacity>
					</View>
				</View>
			</>
		)}
		</ScrollView>
	);
}

const checkForUpdate = (data1: any, data2: any) => {
	getComponentName()
	// console.log('data1:', data1, 'data2:', data2)
	if (data1!==data2) return (
		<View style={{flexDirection: 'row'}}>
			<Text style={[styles.infoTextForChanges, {color: 'red'}]}>{toTitleCase(data1||'')}</Text>
			<Text style={[styles.infoTextForChanges, {color: 'red'}]}>{'-->'}</Text>
			<Text style={[styles.infoTextForChanges]}>{toTitleCase(data2||'')}</Text>
		</View>
	)
	return <View style={{flexDirection: 'row'}}><Text style={[styles.infoTextForChanges]}>{toTitleCase(data1||'')}</Text></View>
}

const styles = StyleSheet.create({
	mainContainer: {
		paddingHorizontal: 20
	},
	loading: {
		marginTop: 250,
	},
	headerContainer: {
		padding: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#fff',
	},
	userInfoContainer: {
		marginLeft: 20,
	},
	userName: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	userHandle: {
		fontSize: 16,
		//   color: '#666',
		marginBottom: 5,
	},
	userBio: {
		fontSize: 14,
		// color: '#666',
		lineHeight: 20,
	},
	actionsContainer: {
		flex: 1,
		// flexDirection: 'row',
		padding: 10,
		// gap: 10,
	},
	editButton: {
	  	// flex: 1,
		// backgroundColor: '#0066FF',
		padding: 12,
		borderRadius: 25,
		alignItems: 'center',
	},
	editButtonText: {
		// color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	sectionContainer: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#fff',
		marginBottom: 15,
	},
	infoItemContainer: {
		flexDirection: 'row',
		gap: 20,
		// alignItems: 'center',
		// marginBottom: 15,
	},
	infoItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	infoItemNoRow: {
		marginBottom: 15,
	},
	infoText: {
		marginLeft: 5,
		fontSize: 16,
		color: '#fff',
	},
	infoTextForChanges: {
		marginLeft: 5,
		fontSize: 18,
		color: '#fff',
	},
	role: {
		alignSelf: 'flex-start',
		padding: 3,
		borderRadius: 5,
	}
});