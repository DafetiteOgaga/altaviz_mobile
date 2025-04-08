import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '../constants/Colors';
import { toTitleCase } from '../hooks/useAllCases';
// import { useHeader } from '../context/headerUpdate';
import { getComponentName } from '@/hooks/getComponentName';

export function DetailsRequestCardView ({mode, icon, color, item, role, label}: {
	// getComponentName()
	mode?: string,
	icon?: keyof typeof Ionicons.glyphMap,
	color?: string,
	item: Record<string, any>,
	role?: string
	label?: string
}) {
	getComponentName()
	// const { setHeaderTitle } = useHeader();
	// useEffect(()=>setHeaderTitle(String(label)), [label])
	const uniColorMode = useColorMode();
	// console.log('item (DetailsRequestCardView):', JSON.stringify(item, null, 4))
	const numberOfRequests = (item?.faults)?
		(item?.faults?.reduce?.((sum:number, request:any)=>(sum +
			(request?.requestStatus?(request?.requestComponent?.length||0):0) +
			(request?.requestStatus?(request?.requestPart?.length||0):0)), 0))
			:
			item?.requestStatus?
				(item?.requestComponent?.length||0) +
				(item?.requestPart?.length||0)
				:'None'
	// console.log('role (in DetailsRequestCardView)', {role})
	// console.log('number of requests', {numberOfRequests})
	// console.log('requestStatus (in DetailsRequestCardView)', item?.requestStatus)
	return (
		<>
			<Card style={[styles.card, {
				backgroundColor: uniColorMode.newdrkb}]}>
				<View style={styles.cardContainer}>
					<View style={[styles.titleContainer, {backgroundColor: uniColorMode.vvvdrkbltr}]}>
						<Ionicons name={'person-circle-outline'} size={18} color={color} />
						<Text style={[styles.title, { color: color }]}>
							{toTitleCase(`${item?.requestUser?.first_name} ${item?.requestUser?.last_name}`)} #{item.id}
						</Text>
					</View>
					<View>
						<View style={styles.textBox2}>
							<Text style={[styles.subText, styles.outerTextColor]}>
								New Location: <Text style={{color: uniColorMode.ltrb}}>{toTitleCase(item?.newLocation)}</Text>
							</Text>
							<Text style={[styles.subText, styles.outerTextColor]}>
								State: <Text style={{color: 'cyan'}}>{toTitleCase(item?.newState)}</Text>
							</Text>
						</View>
						<View style={styles.textBox}>
							<View>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Status: <View style={[
												styles.pending,
												{backgroundColor: (!item?.approve&&!item?.reject)?'orange':
													item?.approve?'green':
													'darkcyan'},
													]}>
												<Text style={[
													styles.pendingText,
													{color: 'black'}]}>
													{(!item?.approve&&!item?.reject)?'Pending':
													item?.approve?'Resolved':
													'Unconfirmed'}
												</Text>
											</View>
								</Text>
							</View>
						</View>
					</View>
				</View>
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
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 3,
		paddingHorizontal: 5,
		gap: 3,
	},
	textBox: {
		flexDirection: 'row',
		// justifyContent: 'space-evenly',
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