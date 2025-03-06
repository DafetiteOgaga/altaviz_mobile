import { View, Text, StyleSheet, Button } from 'react-native';
import React, {useEffect} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenStyle } from '../myConfig/navigation';
import { getComponentName } from '@/hooks/getComponentName';

export default function BlueBlank() {
	getComponentName()
	return (
		<>
			<View style={[ScreenStyle.allScreenContainer]}>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	text: {
        justifyContent: 'center',
        alignItems: 'center'
    },
})
