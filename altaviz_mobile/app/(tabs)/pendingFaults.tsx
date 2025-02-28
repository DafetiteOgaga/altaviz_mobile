import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenStyle, generalstyles } from '../../myConfig/navigation';
import { useHeader } from '@/context/headerUpdate';
import { useGet } from '@/requests/makeRequests';
import { useColorMode } from '@/constants/Colors';
import { useGetIcon } from '@/components/getIcon';
import { CardView } from '@/components/cardView';

export default function PendingFaults() {
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const uniColorMode = useColorMode();
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	const { setHeaderTitle } = useHeader();
	const {url, label, mode, variant} = useLocalSearchParams(); // get the data from the navigation (passed from another screen)
	const navigation: any|undefined = useNavigation(); // navigation to set/update data to another screen/the screen itself
	useEffect(()=>{GetSetup(url)}, [url])
	let name
	const nameList = String(label).split(' ')
	if (String(label).split(' ').length===3) {name = nameList[1]}
	else {name = 'Fault'}
	const handleRefresh = () => { // Refresh/pull new data from server upon refresh
        setRefreshing(true);
        GetSetup(url)
        setRefreshing(false);
    }
	const {getIcon, color} = useGetIcon({variant: String(variant)})
	useEffect(()=>setHeaderTitle(String(label)), [isGetLoading])
	return (
		<>
			{(!isGetLoading&&getData)?
				(<>
				<View style={[ScreenStyle.allScreenContainer, styles.listContainer]}>
					<FlatList
					data={getData}
					keyExtractor={(item: Record<string, any>) => item.id.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => navigation.navigate('detailScreen', {
							data: JSON.stringify(item),
							arrayData: JSON.stringify(getData),
							type: name,
							variant: variant
						})}
						>
							<CardView mode={String(mode)} icon={getIcon!} color={color!} item={item} />

						</TouchableOpacity>
					)}
					ItemSeparatorComponent={()=><View style={{height: 6}} />}
					ListEmptyComponent={()=><Text style={[generalstyles.notFound, {color: uniColorMode.text,}]}>{'All Good! 💪\nNothing to Display'}</Text>}
					refreshControl={
						<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						colors={[uniColorMode.mb]}
						tintColor={uniColorMode.mb} // iOS spinner color
						/>
					}
					/>
				</View></>) :
				<ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />
			}
		</>
	)
}

const styles = StyleSheet.create({
	listContainer:{
		paddingHorizontal: 20,
		marginVertical: 10
	},
	loading: {
		marginTop: 250,
	},
})
