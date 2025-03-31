import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView,
	Image, TouchableOpacity, RefreshControl, ImageBackground
 } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenStyle } from '../../myConfig/navigation';
// import { ThemedText } from '../../components/ThemedText';
import { useGet } from '../../requests/makeRequests';
import { useColorMode } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { toTitleCase } from '../../hooks/useAllCases';
import { baseUrl } from '../../constants/urlOrigin';
import { getComponentName } from '../../hooks/getComponentName';
import { useGetDataFromStorage } from '../../context/useGetDataFromStorage';
import { PhoneNumberSeparator } from '../../components/phoneNumberSeparator';
// import { useGetDataFromStorage } from '@/context/useGetDataFromStorage';

export default function UserProfile() {
	getComponentName()
	const [refreshing, setRefreshing] = useState<boolean>(false);
	// const baseUrl = useGetDataFromStorage('baseUrl')
	// console.log('baseUrl (userProfile):', baseUrl)
	const uniColorMode = useColorMode();
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	
	const savedUserData = useGetDataFromStorage('headerDetails')
	const id = savedUserData?.id
	const router = useRouter();
	const url = `user/${id}/`
	const handleRefresh = () => { // Refresh/pull new data from server upon refresh
        setRefreshing(true);
		GetSetup(url)
		setRefreshing(false);
    }
	// console.log('id (user profile):', id, {url});
	// console.log('getData:', (JSON.stringify(getData, null, 4)));
	useEffect(()=>{
		// console.log('in PendingFaults '.repeat(5))
		GetSetup(url)
	}, [url])
	let userData: any
	if (getData) userData = getData
	const backgroundImage = require('../../assets/images/altavizDoodleDark.png')
	return (
		<ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
			<ScrollView
			refreshControl={
				<RefreshControl
				refreshing={refreshing}
				onRefresh={handleRefresh}
				colors={[uniColorMode.mb]}
				tintColor={uniColorMode.mb} // iOS spinner color
				/>}
			style={[ScreenStyle.allScreenContainer, styles.mainContainer]}>
				{(isGetLoading||!getData) ?
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
							<Text style={[styles.userName, {color: uniColorMode.text}]}>{toTitleCase(userData?.first_name||'')} {toTitleCase(userData.last_name||'')}</Text>
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

					<View style={styles.actionsContainer}>
						<TouchableOpacity style={[styles.editButton, {backgroundColor: uniColorMode.newdrkb1}]}
							onPress={()=>null}>
						<Text style={[styles.editButtonText, {color: uniColorMode.text}]}>Edit Profile</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.sectionContainer}>
						<Text style={styles.sectionTitle}>About</Text>
						{userData?.role==='custodian' &&
						<View style={styles.infoItemContainer}>
							<View style={styles.infoItem}>
								<Ionicons name="business-outline" size={20} color={uniColorMode.text} />
								<Text style={styles.infoText}>{toTitleCase(userData?.branch?.bank?.name||'')}</Text>
							</View>
							<View style={styles.infoItem}>
								<Ionicons name="card-outline" size={20} color={uniColorMode.text} />
								<Text style={styles.infoText}>{toTitleCase(userData?.branch?.name||'')}</Text>
							</View>
						</View>}
						<View style={styles.infoItem}>
							<Ionicons name="mail-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{userData?.email}</Text>
						</View>
						<View style={styles.infoItemContainer}>
							<View style={styles.infoItem}>
								<Ionicons name="call-outline" size={20} color={uniColorMode.text} />
								<Text style={styles.infoText}>{PhoneNumberSeparator(userData?.phone||'')}</Text>
							</View>
							<View style={styles.infoItem}>
								<Ionicons name="logo-whatsapp" size={20} color={uniColorMode.text} />
								<Text style={styles.infoText}>{PhoneNumberSeparator(userData?.wphone||'')}</Text>
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
						<View style={styles.infoItem}>
							<Ionicons name="location-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{toTitleCase((userData?.role==='custodian')?userData?.branch?.location?.location:userData?.location?.location||'')}</Text>
						</View>
						<View style={styles.infoItem}>
							<Ionicons name="home-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{toTitleCase(userData?.address||'')}</Text>
						</View>
						<View style={styles.infoItemNoRow}>
							<Ionicons name="dice-outline" size={20} color={uniColorMode.text} />
							<Text style={styles.infoText}>{toTitleCase(userData?.aboutme||'') || 'No bio available'}</Text>
						</View>
					</View>
				</>)}
			</ScrollView>
		</ImageBackground>
	);
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
		// flexDirection: 'row',
		padding: 20,
		// gap: 10,
	},
	editButton: {
	//   flex: 1,
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
	role: {
		alignSelf: 'flex-start',
		padding: 3,
		borderRadius: 5,
	}
});