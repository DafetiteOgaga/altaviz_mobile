import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, Image, ActivityIndicator,
	TextInput, TouchableOpacity, RefreshControl, Keyboard, Platform,
	KeyboardAvoidingView, ImageBackground } from "react-native";
import { useGet, usePost } from "../../requests/makeRequests";
import { getComponentName } from "../../hooks/getComponentName";
import { useLocalSearchParams, usePathname } from "expo-router";
import { baseUrl } from "../../constants/urlOrigin";
import { useColorMode } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { timeAgo } from "../../hooks/timeAgo";
import { useHeader } from '../../context/headerUpdate';
import { toTitleCase } from "@/hooks/useAllCases";
import { ChatInput } from "@/components/chatInput";

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
	const isUserScrollingRef = useRef(false)
	const {cid, cppicture, chatObj} = useLocalSearchParams();
	const {userID, userPicture, userUname, userEmail} = JSON.parse(String(chatObj))
	let [chatData, setChatData] = useState<any>(null);
	const {getData:refreshData, isGetError:refreshError, isGetLoading:refreshLoading, GetSetup:refreshGet} = useGet();
	const {getData:updateData, isGetError:updateError, isGetLoading:updateLoading, GetSetup:updateGet} = useGet();
	const {postData, isPostError, isPostLoading, PostSetup} = usePost();
	const productionServer = baseUrl.split(':')[0]!=='http'
	// console.log(
	// 	'\nid (chatScreen):',
	// 	'\ncid:', cid,
	// 	'\ncppicture:', cppicture,
	// 	'\nuid:', userID,
	// 	'\nuserPicture:', userPicture,
	// 	'\nuserUname:', userUname,
	// 	'\nuserEmail:', userEmail,
	// )
	
	// const [page, setPage] = useState<number>(2);
	const handleRefresh = async () => { // Refresh/pull new data from server upon refresh
		// console.log('refreshing:', refreshing)
        setRefreshing(true);
        refreshGet(`chat-user/${cid}/${userID}/mobile/?page=2`)
        setRefreshing(false);
    }
	currentIDRef.current = cid
	useEffect(() => {
		// console.log('currentIDRef.current:', currentIDRef.current)
		// console.log('newIDRef.current:', newIDRef.current)
		// console.log('updateRef.current:', updateRef.current)
		// console.log('currentIDRef === newIDRef:', currentIDRef.current===newIDRef.current)
		if (!updateRef.current||currentIDRef.current!==newIDRef.current) {
			updateGet(`chat-user/${cid}/${userID}/mobile/`)
			newIDRef.current = currentIDRef.current
			setChatData(null)
		}
		// setHeaderTitle(`Chats`)
		return () => setChatData(null)
	}, [cid])
	useEffect(()=>{
		if (
			productionServer&&
			path==='chatScreen') {
			const timeInterval = setInterval(() => {
				updateGet(`chat-user/${cid}/${userID}/mobile/`)
			}, 1500);
			return () => clearInterval(timeInterval);
		}
	})
	useEffect(() => {
		if (updateData?.results) {
			// console.log('updateData (useefect) #####:', JSON.stringify(updateData, null, 4).slice(0, 100))
			setChatData([...updateData?.results]?.reverse())
			// console.log('initMount:', initMount.current)
			if (initMount.current) {initMount.current = false}
			// console.log('initMount:', initMount.current)
			updateRef.current = true
		}
		if (updateData&&!updateData.count) {setChatData({new: 'no chat history'})}
	}, [updateData, updateError, updateLoading])
	useEffect(() => {initMount.current = true}, [])
	const handleSend = (chatMessageString:string) => {
		// console.log('chatMessageString:', chatMessageString)
		if (chatMessageString) {
			const formData = new FormData()
			formData.append('currentUser', userEmail)
			formData.append('message', `${userUname}=${chatMessageString}`)
			formData.append('mobile', 'true')
			// const chat2send = chatMessageString
			PostSetup(`chat-user/${cid}/${userID}/`, formData)
			// setChatMessage('')
			// Ensure scrolls to bottom after sending a message
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}
	// console.log({baseUrl})
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
	// console.log('\nchatData:', JSON.stringify(chatData, null, 4).slice(0, 100))
	// console.log('updateData:', JSON.stringify(updateData, null, 4).slice(0, 500))
	// console.log('updateData?.[0]?.contact:', JSON.stringify(updateData?.[0]?.contact, null, 4))
	const existingChat = (updateData?.results?.[0]?.user?.username!==userUname)?
	updateData?.results?.[0]?.user?.username:updateData?.results?.[0]?.contact?.username;
	console.log({existingChat});
	const contact = updateData?.[0]?.contact?.first_name||
					existingChat||
					'Fetching...'
	// console.log('contact:', contact)
	// console.log('message:', updateData?.message)
	// console.log({refreshData})
	// console.log({chatData})
	
	useEffect(() => {
	// 	console.log('useeffect'.repeat(15),
	// 	'\nupdteData:', !!updateData,
	// 	'\npath:', path,
	// )
		if (updateData&&path==='chatScreen') {
			// console.log('setting header title: '.repeat(5), toTitleCase(contact))
			setHeaderTitle(toTitleCase(contact))
		}
	})
	// console.log('refreshData length:', refreshData?.results?.length)
	// if (updateData&&!updateData.count&&!chatData) chatData = [{
	// 	new: ['empty', 'no chat history'],
	// 	message: 'no message',
	// 	id: 0,
	// }]
	if (chatData&&refreshData?.results?.length) {
		chatData = [...refreshData?.results, ...chatData]
	}
	// console.log(
	// 	'\nchatData:', JSON.stringify(chatData, null, 4).slice(0, 50),
	// 	'\nupdateData:', JSON.stringify(updateData, null, 4).slice(0, 50),
	// 	'\ncount:', updateData?.count,
	// 	'\nupdateData&&!updateData?.count:', updateData&&!updateData?.count
	// )
	// console.log({path})
	// useEffect(()=>{if (updateData) setHeaderTitle(toTitleCase(`${updateData.contact.first_name}`||''))}, [updateData])
	// const heightAboveKeyboard = KeyboardState()
	// const [heightAboveKeyboard, setHeightAboveKeyboard] = useState(false)
	// useEffect(() => {
	// 	// Listen for keyboard open event
	// 	const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
	// 	  console.log('keyboardDidShowListener:')
	// 	  setHeightAboveKeyboard(true)
	// 	});
	
	// 	// Listen for keyboard close event
	// 	const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
	// 	 console.log('keyboardDidHideListener:')
	// 	 setHeightAboveKeyboard(false)
	// 	});
	
	// 	return () => {
	// 	  keyboardDidShowListener.remove();
	// 	  keyboardDidHideListener.remove();
	// 	};
	//   });
	// console.log('heightAboveKeyboard.current (chatscreen):', heightAboveKeyboard)
	const backgroundImage = require('../../assets/images/altavizDoodleDark.png')
	return (
		<ImageBackground
		source={backgroundImage}
		resizeMode="cover"
		style={{flex: 1}}>
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
				// null
				<ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />
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
			<ChatInput onSend={handleSend} />
			{/* <KeyboardAvoidingView
			behavior={"padding"}
			style={{ flex: 1}}
			keyboardVerticalOffset={-130} // lower number moves the input container down
			>
				<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				>
					<View style={[styles.inputAndSend, {
						// marginBottom: heightAboveKeyboard?250:0,
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
				</ScrollView>
			</KeyboardAvoidingView> */}
		</ImageBackground>
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
	// inputAndSend: {
	// 	// position: 'absolute', // Makes it fixed at the bottom
	// 	bottom: -20, // Aligns it to the bottom of the screen
	// 	// top: 20,
	// 	left: 0, // Ensures it spans the full width
	// 	right: 0,
	// 	flexDirection: 'row',
	// 	alignItems: 'center',
	// 	// justifyContent: 'space-evenly',
	// 	borderWidth: 1,
	// 	borderColor: 'gray',
	// 	padding: 3,
	// 	// height: 50,
	// 	borderRadius: 40,
	// 	gap: 15,
	// 	zIndex: 1,
	// 	// marginBottom: 250,
	// },
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
		// marginTop: 8,
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
