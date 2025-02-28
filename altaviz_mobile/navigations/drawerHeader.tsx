import React, {useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '@/constants/Colors';
import { toTitleCase } from '@/hooks/useAllCases';
import { baseUrl } from '@/constants/urlOrigin';

// const DASHBOARD_HEADER_HEIGHT = 220;
const CustomDrawerHeader = (props: any) => {
    const { userData, isDark, baseUrl } = props; // Make sure userData is passed as a prop
	const uniColorMode = useColorMode()
	console.log('userData (drawerheader):', {userData}, {baseUrl})
	// const [scrollOffset, setScrollOffset] = useState(0);
	// const isHalfHeight = scrollOffset > DASHBOARD_HEADER_HEIGHT / 2;
	
    return (
        <DrawerContentScrollView {...props}>
            {/* Custom Header/Profile Section */}
            <View style={headerStyles.mainContainer}>
                <View
				style={headerStyles.contentContainer}
				>
                    {/* <View style={[headerStyles.profileCircle, {backgroundColor: uniColorMode.dkb,}]}> */}
					<Image
						source={{ uri: `${baseUrl}${userData?.profile_picture}` }}
						style={[headerStyles.profileCircle]}
						resizeMode="cover"
					/>
                        {/* <Text style={headerStyles.profileInitial}>{userData.supervisor[0]}</Text> */}
                    {/* </View> */}
                    <Text style={[headerStyles.namesText, { color: isDark ? "#FFFFFF" : "#1A202C" }]}>
                        {toTitleCase(userData?.first_name||'')} {toTitleCase(userData?.last_name||'')}
                    </Text>
                    <View style={[headerStyles.roleTag,
						{backgroundColor: uniColorMode.dkrb,}
						]}>
                        <Text style={[headerStyles.roleText]}>{toTitleCase(userData?.role||'')}</Text>
                    </View>
                    <View style={headerStyles.deliveries}>
                        <Ionicons name={'cube-outline'} size={15} color={uniColorMode.text} />
                        <Text style={headerStyles.deliveriesText}>Deliveries: {userData?.deliveryPoints}</Text>
						{/* <Text style={headerStyles.deliveriesText}>Deliveries: {userData.deliveries}</Text> */}
                    </View>
                </View>
            </View>
			<View style={headerStyles.line} />

            {/* Drawer Items */}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};
export { CustomDrawerHeader };

const headerStyles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		// flexDirection: 'row',
		// paddingBottom: 30,
		
		// justifyContent: "center",
	},
	line: {
		height: 1,
		backgroundColor: "grey",
		marginVertical: 25
	},
	contentContainer: {
		paddingLeft: 15,
		// flexDirection: 'row',
		// gap: 10
	},
	// headerImageIcon: {
	// 	width: 30,
	// 	height: 30,
	// 	// marginLeft: 15,
	// 	borderRadius: 50
	// },
	profileCircle: {
		width: 50,
		height: 50,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: 'white'
	},
	profileInitial: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	namesText: {
		// textAlign: "center",
		marginTop: 5,
		fontSize: 22,
		fontWeight: "bold",
	},
	roleTag: {
		marginTop: 5,
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 8,
		alignSelf: "flex-start",
		// width: 100,
		// backgroundColor: uniColorMode.ltb,
		// height: 24,
	},
	roleText: {
		// display: "flex",
		fontSize: 14,
		// textAlign: "center",
		fontWeight: "600",
		color: '#fff'
	},
	deliveries: {
		flexDirection: "row",
		paddingTop: 5,
		alignItems: "center",
		// justifyContent: "center",
		// paddingTop: 5,
		// backgroundColor: "#2e6e39"
	},
	deliveriesText: {
		fontSize: 15,
		color: "#fff",
		fontStyle: "italic",
	},
})
