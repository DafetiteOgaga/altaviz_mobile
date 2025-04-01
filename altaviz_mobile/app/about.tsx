import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, View, Image, TouchableOpacity, Linking, Text } from 'react-native';
import React, {useState, useEffect} from 'react';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenStyle } from '../myConfig/navigation';
import { getComponentName } from '@/hooks/getComponentName';
import { useColorMode } from '@/constants/Colors';
import { currentTimeAndDate } from '@/hooks/TimeOfDayGreeting';
import { Ionicons } from '@expo/vector-icons';
import { useGet } from '@/requests/makeRequests';

export default function About() {
	getComponentName()
	const uniColorMode = useColorMode()
	const packageJson = require("../package.json");
	const timeAndDate = currentTimeAndDate()
	console.log({timeAndDate})
	const serverVersion = ServerVersion()
	return (
	<>
		<Stack.Screen />
		<ThemedView style={[ScreenStyle.allScreenContainer, styles.container]}>
			<View style={styles.directionAndAlign}>
				<ThemedText type="title">App developed by</ThemedText>
				<View
				>
					<Image source={require('../assets/images/dafelogo1.png')} style={{ width: 150, height: 75 }} />
				</View>
			</View>

			<View style={[styles.directionAndAlign, {marginTop: -10, gap: 3, flexDirection: 'row',}]}>
				<View>
					<Ionicons name='arrow-forward' size={17} color={'white'} />
				</View>
				<View>
					<TouchableOpacity
					onPress={()=>Linking.openURL('https://dafetiteogaga.github.io/dafetite/')}
					>
						<Text  style={[styles.link]}>Portfolio</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.version}>
				<Text style={[styles.defaultSemiBold]}>Version:</Text>
				<Text style={[styles.default]}>{packageJson.version}</Text>
			</View>
			<View>
				<Text style={[styles.dateTime, {color: uniColorMode.text}]}>Updated on {timeAndDate}</Text>
			</View>
			
			{/* version checks */}
			<View style={{marginTop: 200}}>
				<Text style={[styles.default]}>App version: {packageJson.version}</Text>
				<Text style={[styles.default]}>Ser version: {serverVersion}</Text>
			</View>
		</ThemedView>
	</>);
}

function ServerVersion () {
	const [serverV, setServerV] = useState(null)
	const pathname = usePathname().split('/')[1]
	const {getData, isGetError, isGetLoading, GetSetup} = useGet();
	useEffect(() => {
		if (getData?.version) {
			setServerV(getData.version)
		}
	}, [getData]);
	useEffect(() => {
		GetSetup("version/");
	}, [pathname]);
	return serverV
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		paddingTop: 200
		// justifyContent: 'center',
	},
	brandLogo: {
		borderWidth: 1,
		borderColor: '#aaa',
        borderRadius: 10,
        height: 40,
	},
	fonts: {
		fontSize: 18,
	},
	version: {
		marginTop: 40,
		flexDirection: 'row',
		gap: 5,
	},
	default: {
		fontSize: 16,
		fontStyle: 'italic',
		lineHeight: 24,
		color: 'grey'
	},
	defaultSemiBold: {
		fontSize: 16,
		fontStyle: 'italic',
		lineHeight: 24,
		fontWeight: '600',
		color: 'grey'
	},
	dateTime: {
		fontSize: 21,
		lineHeight: 24,
		fontWeight: '600',
	},
	link: {
		lineHeight: 30,
		fontSize: 22,
		color: '#0a7ea4',
	},
	directionAndAlign: {
		// flexDirection: 'row',
		alignItems: 'center'
	}
});
