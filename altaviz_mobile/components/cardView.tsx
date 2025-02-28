import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '../constants/Colors';
import { toTitleCase } from '../hooks/useAllCases';

export function CardView ({mode, icon, color, item}: {
	mode: string,
	icon: keyof typeof Ionicons.glyphMap,
	color: string,
	item: Record<string, any>
}) {
	const uniColorMode = useColorMode();
	const numberOfRequests = (item?.requestStatus)?(item?.requestComponent?.length||0)+(item?.requestPart?.length||0):'None'
	return (
		<>
			<Card style={[styles.card, {
				backgroundColor: uniColorMode.newdrkb}]}>
				{mode==='request'?
					(<View style={styles.cardContainer}>
						<View style={[styles.titleContainer, {backgroundColor: uniColorMode.vvvdrkbltr}]}>
							<Ionicons name={icon} size={15} color={color} />
							<Text style={[styles.title, { color: color }]}>
								{toTitleCase(String(mode))} #{item.id}
							</Text>
						</View>
						<View style={[styles.cardContent, {backgroundColor: uniColorMode.shadowdkr, borderColor: uniColorMode.dkrb}]}>
							<View style={styles.textBox1}>
								<View>
									<Text style={[styles.subText, {fontWeight: 'bold', fontSize: 16}]}>
										{toTitleCase(item?.name?.name)}
									</Text>
								</View>
							</View>
							<View style={styles.textBox2}>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Details: <Text style={{color: uniColorMode.ltrb}}>{toTitleCase(item?.fault?.title?.name)}</Text>
								</Text>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Bank: <Text style={{color: 'cyan'}}>{item?.fault?.logged_by?.branch?.bank?.name?.toUpperCase()}</Text>
								</Text>
							</View>
							<View style={styles.textBox}>
								<View>
									<Text style={[styles.subText, styles.outerTextColor]}>
										Status: <View style={[
													styles.pending,
													{backgroundColor: (!item?.approved&&!item?.rejected)?'orange':
														item?.approved?'green':
														'darkcyan'},
												]}><Text style={[
														styles.pendingText,
														]}>{(!item?.approved&&!item?.rejected)?'Pending':item?.approved?'Approved':'Rejected'}</Text></View>
									</Text>
								</View>
							</View>
						</View>
					</View>)
					:
					(<View style={styles.cardContainer}>
						<View style={[styles.titleContainer, {backgroundColor: uniColorMode.vvvdrkbltr}]}>
							<Ionicons name={icon} size={15} color={color} />
							<Text style={[styles.title, { color: color }]}>
								{toTitleCase(String(mode))} #{item.id}
							</Text>
						</View>
						<View style={[styles.cardContent, {backgroundColor: uniColorMode.shadowdkr, borderColor: uniColorMode.dkrb}]}>
							<View style={styles.textBox1}>
								<View>
									<Text style={[styles.subText1, {fontWeight: 'bold', fontSize: 16}]}>
										{toTitleCase(item?.title?.name)}
									</Text>
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
							<View style={styles.textBox2}>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Assigned to: <Text style={{color: uniColorMode.ltrb}}>{toTitleCase(item?.assigned_to?.first_name)}</Text>
								</Text>
								<Text style={[styles.subText, styles.outerTextColor]}>
									Bank: <Text style={{color: 'cyan'}}>{item?.logged_by?.branch?.bank?.name?.toUpperCase()}</Text>
								</Text>
							</View>
							<View style={styles.textBox}>
								<View>
									<Text style={[styles.subText, styles.outerTextColor]}>
										Status: <View style={[
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
		backgroundBlendMode: 'multiply',
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