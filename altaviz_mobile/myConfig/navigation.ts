/**
 * centralize titles and icons for the navigations
 */

import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconNameTYpe = keyof typeof Ionicons.glyphMap;
export const screenConfig: Record<string, { title: string; icon: IconNameTYpe }> = {
	index: {
		title: 'Dashboard',
		icon: 'home-outline',
	},
	login: {
		title: 'Login',
		icon: 'log-in-outline',
	},
    logout: {
		title: 'Logout',
		icon: 'log-out-outline',
	},
    // pendingFaults: {
	// 	title: 'Pending Faults Tab config',
	// 	icon: 'grid-outline',
	// },
    // inspectUserProfile: {
	// 	title: 'User Profile Tab config',
	// 	icon: 'grid-outline',
	// },
    profile: {
		title: 'Profile',
		icon: 'person-circle-outline',
	},
    settings: {
		title: 'Settings',
		icon: 'settings-outline',
	},
    chatroom: {
		title: 'ChatRoom',
		icon: 'chatbubbles-outline',
	},
    about: {
		title: 'About',
		icon: 'help-circle-outline',
	},
	// ... other screens
};

export const generalstyles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    notFound: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingTop: 100,
        textAlign: 'center',
    },
    headerFooter: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    errorContainer: {
        paddingTop: 100,
    },
    errorText: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'red',
        textAlign: 'center',
        // borderWidth: 1,
        paddingTop: 10,
    },
    imageContainer: {
        // width: 10
    },
    image: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
});

export const ScreenStyle = StyleSheet.create({
	allScreenContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
})