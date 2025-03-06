// import { View, Text, StyleSheet, Button } from 'react-native';
// import React, {useEffect} from 'react';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { ScreenStyle } from '../../myConfig/navigation';
// import { getComponentName } from '@/hooks/getComponentName';

// export default function BlueBlank() {
// 	getComponentName()
// 	const {id, arrayData, faultID } = useLocalSearchParams();
// 	const router = useRouter();
// 	// console.log('BlueBlank id:', id);
// 	// console.log('BlueBlank arrayData:', arrayData);
// 	// console.log('BlueBlank typeof arrayData:', typeof arrayData);
// 	// console.log('BlueBlank arrayData.id.id:', arrayData.id);
// 	// @ts-ignore
// 	const parsedArray = JSON.parse(arrayData)
// 	// console.log('BlueBlank parsedArray:', parsedArray);
// 	// console.log('BlueBlank JSON.stringify(parsedArray,null, 4):', JSON.stringify(parsedArray,null, 4));
// 	// console.log('BlueBlank parsedArray.id:', parsedArray.id);
// 	// console.log('mapping:', parsedArray.map((item: any) => item?.fault?.id));
// 	// console.log('BlueBlank faultID:', faultID, typeof faultID);
// 	// console.log('BlueBlank parsedArray[0].fault.id:', parsedArray[0]?.fault?.id, typeof parsedArray[0]?.fault?.id);
// 	let selectedFault = parsedArray.find((item: any) => item?.fault?.id === Number(faultID))?.fault
// 	// console.log('BlueBlank selectedFault:', JSON.stringify(selectedFault, null, 4));
// 	useEffect(() => {
// 		if (selectedFault) {
// 			selectedFault = JSON.stringify(selectedFault)
// 			router.push({
// 				pathname: '/detailScreen',
// 				params:{
// 					fault: selectedFault,
// 					type: 'faultRequest'
// 			}})
// 		}
// 	}, [selectedFault]);
// 	return (
// 		<>
// 			<View style={[ScreenStyle.allScreenContainer, { justifyContent: 'center', alignItems: 'center'}]}>
// 				{/* <Text style={styles.text}>user id: {id}</Text>
// 				<Text style={styles.text}>fault id: {faultID}</Text> */}
// 				{/* <Text style={styles.text}>array data: {arrayData}</Text>
// 				<Text style={styles.text}>type data: {typeof arrayData}</Text> */}
// 				{/* <Text style={styles.text}>array data: {arrayData}</Text> */}
// 				{/* <Text style={styles.text}>parsed data: {parsedArray}</Text> */}
// 				{/* <Text style={styles.text}>id data: {parsedArray.id}</Text> */}
// 				{/* <Button // Button to update the Data passed from another screen
// 				title='Update Data' onPress={()=>navigation.setParams({message: 'updated data'})}/>
// 				<Text style={styles.text}>Note: You can send Data back or to any other screen as well</Text> */}
// 			</View>
// 		</>
// 	)
// }

// const styles = StyleSheet.create({
// 	text: {
// 		color: 'white',
// 		textAlign: 'center',
// 	},
// })