import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, Image, ActivityIndicator,
	TextInput, TouchableOpacity, RefreshControl, Keyboard } from "react-native";
import { useGet, usePost } from "../../requests/makeRequests";
import { getComponentName } from "../../hooks/getComponentName";
import { useLocalSearchParams, usePathname } from "expo-router";
import { baseUrl } from "../../constants/urlOrigin";
import { useColorMode } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { timeAgo } from "../../hooks/timeAgo";
import { useHeader } from '../../context/headerUpdate';
import { toTitleCase } from "@/hooks/useAllCases";

export default function ChatScreen () {
	getComponentName()
	const { setHeaderTitle } = useHeader();
	const path = usePathname().split('/')[1];
	const initMount = useRef(false);
	const uniColorMode = useColorMode();
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const updateRef = useRef<boolean>(false);
	const currentIDRef = useRef<any|null>(null);
	const newIDRef = useRef<any|null>(null);
	// const previousChats = useRef<any>(null);
	// const [page, setPage] = useState<number>(2);
	const isUserScrollingRef = useRef(false)
	// const isAtBottomRef = useRef(true); // Track if user is at bottom
	const {cid, cppicture, chatObj} = useLocalSearchParams();
	const {userID, userPicture, userUname, userEmail} = JSON.parse(String(chatObj))
	let [chatData, setChatData] = useState<any>(null);
	// const [updateChatData, setUpdateChatData] = useState<any>(null);
	const [chatMessage, setChatMessage] = useState('');
	// const flatListRef = useRef<FlatList>(null);
	const {getData:refreshData, isGetError:refreshError, isGetLoading:refreshLoading, GetSetup:refreshGet} = useGet();
	const {getData:updateData, isGetError:updateError, isGetLoading:updateLoading, GetSetup:updateGet} = useGet();
	const {postData, isPostError, isPostLoading, PostSetup} = usePost();
	console.log('baseUrl:', baseUrl)
	const productionServer = baseUrl.split(':')[0]!=='http'
	console.log(
		'\nid (chatScreen):',
		'\ncid:', cid,
		'\ncppicture:', cppicture,
		'\nuid:', userID,
		'\nuserPicture:', userPicture,
		'\nuserUname:', userUname,
		'\nuserEmail:', userEmail,
	)
	currentIDRef.current = cid
	// const [page, setPage] = useState<number>(2);
	const handleRefresh = async () => { // Refresh/pull new data from server upon refresh
		// console.log('refreshing:', refreshing)
        setRefreshing(true);
        await refreshGet(`chat-user/${cid}/${userID}/mobile/?page=2`)
        setRefreshing(false);
    }
	useEffect(() => {
		console.log('currentIDRef.current:', currentIDRef.current)
		console.log('newIDRef.current:', newIDRef.current)
		console.log('updateRef.current:', updateRef.current)
		console.log('currentIDRef === newIDRef:', currentIDRef.current===newIDRef.current)
		if (!updateRef.current||currentIDRef.current!==newIDRef.current) {
			updateGet(`chat-user/${cid}/${userID}/mobile/`)
			newIDRef.current = currentIDRef.current
			setChatData(null)
		}
		setHeaderTitle(`Chats`)
		return () => setChatData(null)
	}, [cid])
	useEffect(()=>{
		if (
			productionServer&&
			path==='chatScreen') {
			const timeInterval = setInterval(() => {
				updateGet(`chat-user/${cid}/${userID}/mobile/`)
			}, 2000);
			return () => clearInterval(timeInterval);
		}
	})
	useEffect(() => {
		// @ts-ignore
		if (updateData?.results) {
			console.log('updateData (useefect) #####:', JSON.stringify(updateData, null, 4).slice(0, 100))
			// @ts-ignore
			setChatData([...updateData?.results]?.reverse())
			console.log('initMount:', initMount.current)
			if (initMount.current) {initMount.current = false}
			console.log('initMount:', initMount.current)
			updateRef.current = true
		}
		// @ts-ignore
		if (updateData&&!updateData.count) {setChatData({new: 'no chat history'})}
	}, [updateData, updateError, updateLoading])
	useEffect(() => {initMount.current = true}, [])
	console.log({chatMessage})
	const handleSend = (chatMessageString:string) => {
		if (chatMessageString) {
			const formData = new FormData()
			formData.append('currentUser', userEmail)
			formData.append('message', `${userUname}=${chatMessageString}`)
			formData.append('mobile', 'true')
			// const chat2send = chatMessageString
			PostSetup(`chat-user/${cid}/${userID}/`, formData)
			setChatMessage('')
			// Ensure scrolls to bottom after sending a message
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}
	console.log({baseUrl})
	// console.log('initMount:', initMount.current)
	// Create a ref for ScrollView
	const scrollViewRef = useRef<ScrollView>(null);

	
	const handleScroll = (event:any) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
		const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Adjust threshold
		isUserScrollingRef.current = !isAtBottom; // If user is at bottom, set to false; otherwise, true
	}
	useEffect(() => {
		if (chatData?.length && !isUserScrollingRef.current) {
			scrollViewRef.current?.scrollToEnd({ animated: false });
		}
	}, [chatData]);
	console.log('\nchatData:', JSON.stringify(chatData, null, 4).slice(0, 100))
	console.log('updateData:', JSON.stringify(updateData, null, 4).slice(0, 500))
	// @ts-ignore
	console.log('message:', updateData?.message)
	// @ts-ignore
	// console.log('refreshData length:', refreshData?.results?.length)
	// if (updateData&&!updateData.count&&!chatData) chatData = [{
	// 	new: ['empty', 'no chat history'],
	// 	message: 'no message',
	// 	id: 0,
	// }]
	// @ts-ignore
	if (refreshData?.results?.length) {
		// @ts-ignore
		chatData = [...refreshData?.results, ...chatData]
	}
	console.log(
		'\nchatData:', JSON.stringify(chatData, null, 4).slice(0, 50),
		'\nupdateData:', JSON.stringify(updateData, null, 4).slice(0, 50),
		// @ts-ignore
		'\ncount:', updateData?.count,
		// @ts-ignore
		'\nupdateData&&!updateData?.count:', updateData&&!updateData?.count
	)
	console.log({path})
	const heightAboveKeyboard = useRef(0)
	useEffect(() => {
		// Listen for keyboard open event
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
		  console.log('keyboardDidShowListener:')
		  heightAboveKeyboard.current = 100
		});
	
		// Listen for keyboard close event
		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
		 console.log('keyboardDidHideListener:')
		 heightAboveKeyboard.current = 0
		});
	
		return () => {
		  keyboardDidShowListener.remove();
		  keyboardDidHideListener.remove();
		};
	  });
	
	return (
		<View style={{flex: 1}}>
			<ScrollView
			ref={scrollViewRef} // Attach the ref to ScrollView
			onScroll={handleScroll} // Track user's scrolling behavior
			onContentSizeChange={() => {
				if (!isUserScrollingRef.current) {
					scrollViewRef.current?.scrollToEnd({ animated: false });
				}
			}}
			// onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })} // Auto-scroll when content size changes
			contentContainerStyle={{ paddingBottom: 60 }} // Add padding to avoid overlap with fixed input field
			refreshControl={
				<RefreshControl
				refreshing={refreshing}
				onRefresh={handleRefresh}
				colors={[uniColorMode.mb]}
				tintColor={uniColorMode.mb} // iOS spinner color
				/>}
			>
			{
			// (updateData&&!updateData?.count) ?
			// 			<Text style={styles.noChatHistory}>No chat history</Text>
			// 			:
			(!chatData) ?
				null
				// <ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />
				:
				(chatData?.new) ?
					<Text style={[styles.noChatHistory, {color: uniColorMode.text}]}>{toTitleCase(chatData?.new)}</Text>
					:
						(
							<>
								{chatData?.map?.((item:any)=>{
								let [me, msg] = item?.message?.split?.('=')||[]
								me = me===userUname
								// const timestamp = timeAgo(item?.timestamp)
								// console.log({timestamp})
								// console.log({me}, {msg})
								if (!item?.message) return null
								return (
									<View key={item?.id}>
										{msg!==undefined &&
										<>
											<View style={[
											styles.messageContainer,
											me?styles.otherMessage:styles.myMessage,
											]}>
												{/* <View> */}
													<Image
													source={{ uri: `${baseUrl}${me?userPicture:cppicture}` }}
													style={[styles.headerImageIcon, {borderColor: '#fff',}]}
													resizeMode="contain"
													/>
												{/* </View> */}
												<View style={[
													styles.messageBubble,
													me? styles.otherMessageBubble : styles.myMessageBubble,
												]}>
													<Text style={
														// styles.name,
														styles.messageText
														}>{msg}</Text>
												</View>
											</View>
											<View style={[me?styles.otherMessage:styles.myMessage]}>
												<Text style={[styles.dateTime]}>{timeAgo(item?.timestamp)}</Text>
											</View>
										</>}
									</View>
								)})}
							</>
						)
			}
			</ScrollView>
			{/* Input Field & Send Button */}
			<View style={[styles.inputAndSend, {
				// bottom: heightAboveKeyboard.current,
				backgroundColor: uniColorMode.vvvdrkbltr}]}>
				<View
				style={[styles.inputContainer, {
					backgroundColor: chatMessage?undefined:uniColorMode.dkb,
					paddingTop: productionServer?8:0,
				}]}
				>
					<TextInput
					style={styles.input}
					placeholder="Type here ..."
					placeholderTextColor="gray"
					value={chatMessage}
					onChangeText={setChatMessage}
					/>
				</View>
				<View style={styles.sendContainer}>
					<TouchableOpacity onPress={() => handleSend(chatMessage)}>
						<Ionicons name="send" size={24} color="white" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	messageContainer: {
		// flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
		paddingHorizontal: 10,
		// paddingVertical: 5,
	},

	otherMessage: {
		flexDirection: 'row-reverse', // Align my messages to the right
	},
	myMessage: {
		flexDirection: 'row', // Align other messages to the left
	},
	messageBubble: {
		maxWidth: '70%',
		padding: 10,
	},
	myMessageBubble: {
		borderBottomRightRadius: 15,
		borderTopRightRadius: 15,
		borderBottomLeftRadius: 15,
		backgroundColor: '#031E3D',
	},
	otherMessageBubble: {
		borderTopEndRadius: 15,
		borderBottomLeftRadius: 15,
		borderTopLeftRadius: 15,
		backgroundColor: '#1f3a73',
	},
	messageText: {
		color: '#fff',
		fontSize: 16,
	},
	headerImageIcon: {
		width: 30,
		height: 30,
		marginHorizontal: 8,
		borderWidth: 0.3,
		// borderColor: '#fff',
		borderRadius: 50
	},
	loading: {
		marginTop: 250,
	},
	inputAndSend: {
		position: 'fixed', // Makes it fixed at the bottom
		bottom: 0, // Aligns it to the bottom of the screen
		left: 0, // Ensures it spans the full width
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'space-evenly',
		borderWidth: 1,
		borderColor: 'gray',
		padding: 3,
		// height: 50,
		borderRadius: 40,
		gap: 15,
		zIndex: 1,
		// marginBottom: 50,
	},
	input: {
		fontSize: 16,
		color: 'white',
		paddingHorizontal: 10,
	},
	inputContainer: {
		flex: 1,
		height: 35,
		borderTopLeftRadius: 40,
		borderBottomLeftRadius: 40,
		// paddingTop: 8,
	},
	sendContainer: {
		marginRight: 12,
	},
	dateTime: {
		fontSize: 12,
        color: 'grey',
		marginHorizontal: 60,
		marginTop: -6,
		fontStyle: 'italic',
	},
	noChatHistory: {
		fontSize: 16,
		// paddingHorizontal: 10,
		paddingVertical: 15,
		// backgroundColor: uniColorMode.wwvdrkbltr,
		// borderRadius: 10,
		textAlign: 'center',
	},
})
