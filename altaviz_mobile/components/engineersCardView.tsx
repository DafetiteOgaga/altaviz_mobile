import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '../constants/Colors';
import { toTitleCase } from '../hooks/useAllCases';

export function EngineerCardView ({mode, icon, color, item, role}: {
	mode?: string,
	icon?: keyof typeof Ionicons.glyphMap,
	color?: string,
	item: Record<string, any>,
	role?: string
}) {
	const uniColorMode = useColorMode();
	const numberOfRequests = (item?.faults)?
		(item?.faults?.reduce?.((sum:number, requests:any)=>(sum + (requests?.requestStatus?(requests?.requestComponent?.length||0):0) +
		(requests?.requestStatus?(requests?.requestPart?.length||0):0)), 0)):'None'
	const numberOfFaults = (item?.faults)?
		(item?.faults?.reduce?.((sum:number, fault:any)=>(sum + 1), 0)):'None'
	console.log('role (in EngineerCardView)', {role})
	console.log('number of faults', {numberOfFaults})
	console.log('number of requests', {numberOfRequests})
	return (
		<>
			<Card style={[styles.card, {
				backgroundColor: uniColorMode.newdrkb}]}>
				<View style={styles.cardContainer}>
					<View style={[styles.titleContainer, {backgroundColor: uniColorMode.vvvdrkbltr}]}>
						<Ionicons name={'person-outline'} size={15} color={'gold'} />
						<Text style={[styles.title, { color: 'gold' }]}>
							{toTitleCase(item?.first_name||'')}
						</Text>
					</View>
					<View style={[styles.cardContent, {backgroundColor: uniColorMode.shadowdkr, borderColor: uniColorMode.dkrb}]}>
						{/* <View style={styles.textBox1}> */}
							<View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
								<View style={styles.status}>
									<Text style={[styles.subText2]}>
										{numberOfFaults>1?'Faults':'Fault'}: <Text style={{
											color: typeof(numberOfRequests)==='string'?'black':'green',
											// fontWeight: typeof(numberOfRequests)==='string'?undefined:'bold'
											}}>{numberOfFaults}</Text>
									</Text>
								</View>
								<View style={styles.status}>
									<Text style={[styles.subText2]}>
										{numberOfRequests>1?'Requests':'Request'}: <Text style={{
											color: typeof(numberOfRequests)==='string'?'black':'green',
											// fontWeight: typeof(numberOfRequests)==='string'?undefined:'bold'
											}}>{numberOfRequests}</Text>
									</Text>
								</View>
							</View>
						{/* </View> */}
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
		// flexDirection: 'row',
		// justifyContent: 'space-between',
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