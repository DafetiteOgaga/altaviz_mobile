import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '../constants/Colors';
import { toTitleCase } from '../hooks/useAllCases';
// import { useHeader } from '@/context/headerUpdate';
import { getComponentName } from '@/hooks/getComponentName';
import { DateDifference } from '@/hooks/DateDifference';

export function CardView ({mode, icon, color, item, role, label, swapCard}: {
	// getComponentName()
	mode?: string,
	icon?: keyof typeof Ionicons.glyphMap,
	color?: string,
	item: Record<string, any>,
	role?: string
	label?: string
	swapCard?: boolean
}) {
	getComponentName()
	const [requestDuration, requestColorStyle, requestMode, returnedRequestMode] = DateDifference(item?.requested_at)?.split?.('-')||[]
	const [faultDuration, faultColorStyle, faultMode, returnedfaultMode] = DateDifference(item?.created_at)?.split?.('-')||[]
	// const { setHeaderTitle } = useHeader();
	// useEffect(()=>setHeaderTitle(String(label)), [label])
	const uniColorMode = useColorMode();
	// console.log('item (cardView):', JSON.stringify(item, null, 4))
	const numberOfRequests = (item?.faults)?
		(item?.faults?.reduce?.((sum:number, request:any)=>(sum +
			(request?.requestStatus?(request?.requestComponent?.length||0):0) +
			(request?.requestStatus?(request?.requestPart?.length||0):0)), 0))
			:
			item?.requestStatus?
				(item?.requestComponent?.length||0) +
				(item?.requestPart?.length||0)
				:'None'
	// console.log(
	// 	'\n (in cardView):',
	// 	'\n', {mode},
	// 	'\n', {icon},
	// 	'\n', {color},
	// 	// '\n', {item},
	// 	'\n', {label},
	// 	'\n', {role},
    //     '\n', {swapCard},
	// )
	// console.log('role (in cardView)', {role})
	// console.log('number of requests', {numberOfRequests})
	// console.log('requestStatus (in cardView)', item?.requestStatus)
	// console.log('item (in cardView)', JSON.stringify(item, null, 4))
	const notWorkshopAndHR = role!=='workshop'&&(role==='human-resource'&&swapCard&&item?.fault)
	return (
		<>
			<Card style={[styles.card, {
				backgroundColor: uniColorMode.newdrkb}]}>
				{mode==='request'?
					// Request card
					(<View style={styles.cardContainer}>
						{/* icon, type and id */}
						<View style={[styles.titleContainer, {backgroundColor: uniColorMode.vvvdrkbltr}]}>
							<Ionicons name={icon} size={15} color={color} />
							<Text style={[styles.title, { color: color }]}>
								{toTitleCase(
									(role==='human-resource'&&label?.toLowerCase()==='fixed parts')?String(label):
									(role==='workshop'&&label?.toLowerCase()==='posted parts')?String(label):
									String(mode))} #{item.id}
							</Text>
						</View>
						{/* nested box details */}
						<View style={[styles.cardContent, {
							backgroundColor: uniColorMode.shadowdkr,
							borderColor: uniColorMode.dkrb,
							flexDirection: 'column',
							justifyContent: notWorkshopAndHR?'center':'space-evenly',
							}]}>
							<View style={styles.textBox1}>
								<View>
									<Text style={[styles.subText, {fontWeight: 'bold', fontSize: 16}]}>
										{toTitleCase(item?.name?.name)}
									</Text>
								</View>
							</View>

							{/* exempt workshop */}
							{notWorkshopAndHR&&
							<View style={styles.textBox2}>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Fault: <Text style={{color: uniColorMode.ltrb}}>{toTitleCase(item?.fault?.title?.name)}</Text>
								</Text>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Bank: <Text style={{color: 'cyan'}}>{item?.fault?.logged_by?.branch?.bank?.name?.toUpperCase()}</Text>
								</Text>
							</View>}
							{/* status */}
							<View style={styles.textBox}>
								<View>
									<Text style={[styles.subText, styles.outerTextColor]}>
										Status:  <View style={[
													styles.pending,
													{backgroundColor: (!item?.approved&&!item?.rejected)?'orange':
														item?.approved?'green':
														'darkcyan'},
												]}><Text style={[
														styles.pendingText,
														]}>{(!item?.approved&&!item?.rejected)?'Pending':item?.approved?'Approved':'Rejected'}</Text></View>
									</Text>
								</View>
								<View>
									<Text style={[styles.timeText, {color: requestColorStyle}]}>
										{requestDuration} {returnedRequestMode} ago
									</Text>
								</View>
							</View>
						</View>
					</View>)
					:
					// faults card
					(<View style={styles.cardContainer}>
						{/* icon, type and id */}
						<View style={[styles.titleContainer, {backgroundColor: uniColorMode.vvvdrkbltr}]}>
							<Ionicons name={icon} size={15} color={color} />
							<Text style={[styles.title, { color: color }]}>
								{toTitleCase(String(mode))} #{item.id}
							</Text>
						</View>
						<View style={[styles.cardContent, {backgroundColor: uniColorMode.shadowdkr, borderColor: uniColorMode.dkrb}]}>
							<View style={styles.textBox1}>
								<View>
									{/* fault name */}
									<Text style={[styles.subText1, {fontWeight: 'bold', fontSize: 16}]}>
										{toTitleCase(item?.title?.name)}
									</Text>
									{/* request container */}
									<View style={styles.status}>
										<Text style={[styles.subText2]}>
											Requests: <Text style={{
												color: typeof(numberOfRequests)==='string'?'black':'green',
												// fontWeight: typeof(numberOfRequests)==='string'?undefined:'bold'
												}}>{numberOfRequests}</Text>
										</Text>
									</View>
								</View>
							</View>
							{/* nested box details */}
							<View style={styles.textBox2}>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Assigned to: <Text style={{color: uniColorMode.ltrb}}>{toTitleCase(item?.assigned_to?.first_name)}</Text>
								</Text>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Bank: <Text style={{color: 'cyan'}}>{item?.logged_by?.branch?.bank?.name?.toUpperCase()}</Text>
								</Text>
							</View>
							{/* status */}
							<View style={styles.textBox}>
								<View>
									<Text style={[styles.subText, styles.outerTextColor]}>
										Status:  <View style={[
													styles.pending,
													{backgroundColor: (!item?.confirm_resolve&&!item?.verify_resolve)?'orange':
														item?.confirm_resolve?'green':
														'darkcyan'},
														]}>
													<Text style={[
														styles.pendingText,
														{color: 'black'}]}>
														{(!item?.confirm_resolve&&!item?.verify_resolve)?'Pending':
														item?.confirm_resolve?'Resolved':
														'Unconfirmed'}
													</Text>
												</View>
									</Text>
								</View>
								<View>
									<Text style={[styles.timeText, {color: faultColorStyle}]}>
										{faultDuration} {returnedfaultMode} ago
									</Text>
								</View>
							</View>
						</View>
					</View>)
				}
			</Card>
		</>
	)
}

const styles = StyleSheet.create({
	cardContainer: {
		padding: 10,
	},
	card: {
        borderRadius: 5,
        // borderWidth: 10,
        // Inset shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, // Negative offset for inset effect
        shadowOpacity: 0.3,
        shadowRadius: 4,
        // Elevation for Android (simulate inset effect)
        elevation: -4, // Negative elevation for inset effect
    },
	cardContent: {
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		// backgroundBlendMode: 'multiply',
	},
    title: {
        fontSize: 18,
        fontWeight: 'bold',
		alignSelf: 'center',
    },
    subText: {
        fontSize: 14,
		paddingLeft: 10,
		paddingVertical: 3,
		color: 'lightblue',
    },
	subText1: {
        fontSize: 14,
		paddingLeft: 10,
		// paddingVertical: 3,
		color: 'lightblue',
    },
	subText2: {
        fontSize: 14,
		// paddingLeft: 10,
		// paddingVertical: 3,
		color: 'darkblue',
		fontWeight: 'bold',
    },
	titleContainer: {
		padding: 2,
		borderRadius: 5,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		marginBottom: 3,
		paddingHorizontal: 5,
		gap: 3,
	},
	textBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	timeText: {
		fontStyle: 'italic',
		paddingRight: 10
	},
	textBox1: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// flexWrap: 'wrap',
		// overflow: 'hidden',
	},
	textBox2: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingVertical: 5,
		// flexWrap: 'wrap',
		// overflow: 'hidden',
	},
	pending: {
		paddingVertical: 1,
		paddingHorizontal: 3,
		borderRadius: 3,
	},
	pendingText: {
		// color: 'white',
		fontWeight: 'bold',
		fontStyle: 'italic',
	},
	status: {
		padding: 1,
		backgroundColor: 'lightblue',
		alignSelf: 'flex-start',
		marginLeft: 10,
		borderRadius: 3,
        paddingHorizontal: 2,
	},
	outerTextColor: {
		color: 'lightsteelblue',
	}
});