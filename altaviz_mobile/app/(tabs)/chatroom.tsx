import { Link, Stack } from 'expo-router';
import { StyleSheet, View, FlatList, ScrollView, Text, Image, RefreshControl,
	TouchableOpacity, ImageBackground
} from 'react-native';
import React, { useEffect, useState } from 'react';
// import { ThemedText } from '../../components/ThemedText';
// import { ThemedView } from '../../components/ThemedView';
// import { ScreenStyle } from '../../myConfig/navigation';
import { getComponentName } from '../../hooks/getComponentName';
import { useGet } from '@/requests/makeRequests';
import { useGetDataFromStorage } from '@/context/useGetDataFromStorage';
import { baseUrl } from '@/constants/urlOrigin';
import { toTitleCase } from '@/hooks/useAllCases';
import { useColorMode } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import {generalstyles} from '@/myConfig/navigation';
// import { ScrollView } from 'react-native-gesture-handler';

export default function ChatRoom() {
	getComponentName()
	const router = useRouter();
	const uniColorMode = useColorMode();
	const userData = useGetDataFromStorage('headerDetails')
	const [refreshing, setRefreshing] = useState<boolean>(false);
	// console.log('userData:', JSON.stringify(userData, null, 4))
	// const [everyone, setEveryone] = useState<any>(null);
	const {getData:everyone, isGetError, isGetLoading, GetSetup} = useGet();
	const getUrl = `all-users/${userData?.id}`
	useEffect(() => {if (userData) GetSetup(getUrl)}, [getUrl])
	// useEffect(() => {setEveryone(getData)}, [getData])
	// console.log('everyone:', JSON.stringify(everyone, null, 4))
	const handleRefresh = async () => { // Refresh/pull new data from server upon refresh
        setRefreshing(true);
        await GetSetup(getUrl)
        setRefreshing(false);
    }
	const chatObj:any = {
		userID: userData?.id,
		userPicture: userData?.profile_picture,
		userUname: userData?.username,
		userEmail: userData?.email,
	}
	// const userID = userData?.id
	// const userPicture = userData?.profile_picture
	// const userUname = userData?.username
	// const userEmail = userData?.email
	const backgroundImage = require('../../assets/images/altavizDoodleDark.png')
	return (
		<ImageBackground
		source={backgroundImage}
		resizeMode="cover"
		style={{flex: 1}}>
			<FlatList
			refreshControl={
				<RefreshControl
				refreshing={refreshing}
				onRefresh={handleRefresh}
				colors={[uniColorMode.mb]}
				tintColor={uniColorMode.mb} // iOS spinner color
				/>}
			data={everyone}
			keyExtractor={(item: Record<string, any>, index:number) => item?.id?.toString()}
			renderItem={({ item }) => {
				// console.log('item type:', typeof item?.id)
				// console.log('userID type:', typeof userID)
				if (item?.id===chatObj.userID) {return null}
				const contactID = item?.id
				const contactPic = item?.profile_picture
				return (
				<View style={styles.container}>
					<TouchableOpacity
					onPress={()=>{router.push({
						pathname: '/(tabs)/chatScreen',
						params: {
							cid: contactID,
							cppicture: contactPic,
							chatObj: JSON.stringify(chatObj)
						}
					})}}
					// to={`chat/${item?.id}`}
					// href={'/(tabs)/blueBlank'}
					>
						<View style={[styles.itemcontainer, {position: 'fixed'}]}>
							<View>
								<View style={Number(item?.id)%5===1?styles.notification:undefined} />
								<Image
								source={{ uri: `${baseUrl}${item?.profile_picture}` }}
								style={[styles.headerImageIcon, {borderColor: '#fff',}]}
								resizeMode="contain"
								/>
							</View>
							<View>
								<Text style={styles.name}>{toTitleCase(item?.first_name||'')} {item?.id}</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)}}
			// ListEmptyComponent={()=><Text style={[generalstyles.notFound, {color: 'white'}]}>No Post found</Text>}
			/>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 15,
	},
	// link: {
	// 	// marginTop: 15,
	// 	paddingVertical: 15,
	// },
	itemcontainer: {
		flexDirection: 'row',
		gap: 15,
		// justifyContent: 'space-around',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		// padding: 10,
		// borderBottomWidth: 1,
		// borderBottomColor: 'white',
	},
	headerImageIcon: {
		width: 50,
		height: 50,
		marginLeft: 15,
		borderWidth: 0.3,
		// borderColor: '#fff',
		borderRadius: 50
	},
	name: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	notification: {
		width: 15,
		height: 15,
		left: 50,
		top: 12,
		// backgroundColor: uniColorMode.vltb,
		backgroundColor: 'darkgreen',
		borderRadius: 50,
		overflow: 'hidden',
		zIndex: 1,
		// borderRadius: 25,
		// backgroundColor: '#ddd',
		// overflow: 'hidden',
		position: 'relative',
	}
});
