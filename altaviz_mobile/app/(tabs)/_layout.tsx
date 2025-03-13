import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { screenConfig } from '@/myConfig/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode } from '@/constants/Colors';
import { getComponentName } from '@/hooks/getComponentName';

export default function TabLayout() {
    getComponentName()
    // const colorScheme = useColorScheme(); // 'light' | 'dark'
    const uniColorMode = useColorMode()
    return (
        <>
        <Tabs
            // options and styles for the tabs and the tab bar
            screenOptions={{
            headerShown: false, // hide the header
            tabBarActiveTintColor: uniColorMode.tint, // active tab text color
            tabBarButton: HapticTab,  // custom tab button component
            // tabBarBackground: TabBarBackground,
            // tab style
            tabBarStyle: Platform.select({
                ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
                },
                default: { // Android and others
                backgroundColor: uniColorMode.background,
                },
            }),
            }}>
            <Tabs.Screen //home screen
            name="index" // screen name (navigation)
            options={{
                // title: screenConfig.index.title, // tab title
                // tab icon and color
                tabBarIcon: ({ color }) => <Ionicons size={28} name={screenConfig.index.icon} color={color} />,
            }}
            />
            <Tabs.Screen // chatroom screen
            name="chatroom" // screen name (navigation)
            initialParams={{ // default parameter value
                message: 'Hello, Anon!\nFron default parameter value'
            }}
            options={{
                // title: screenConfig.chatroom.title, // tab title
                // tab icon and color
                tabBarIcon: ({ color }) => <Ionicons size={28} name={screenConfig.chatroom.icon} color={color} />,
                tabBarBadge: 3, // show a badge on the tab
                tabBarBadgeStyle: { // badge style
                backgroundColor: uniColorMode.vltb,
                },
            }}
            />
            <Tabs.Screen // chatroom screen
            name="profile" // screen name (navigation)
            initialParams={{ // default parameter value
                message: 'Hello, Anon!\nFron default parameter value'
            }}
            options={{
                // title: screenConfig.profile.title, // tab title
                // tab icon and color
                tabBarIcon: ({ color }) => <Ionicons size={28} name={screenConfig.profile.icon} color={color} />,
            }}
            />
            <Tabs.Screen // pendingFaults screen
            name="chatScreen" // screen name (navigation)
            options={{
                title: 'chatScreen',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // pendingFaults screen
            name="pendingFaults" // screen name (navigation)
            options={{
                title: 'pending',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // pendingFaults screen
            name="detailScreen" // screen name (navigation)
            options={{
                title: 'Detail Screen',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="inspectUserProfile" // screen name (navigation)
            options={{
                title: 'user',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="requestItem" // screen name (navigation)
            options={{
                title: 'Request Item',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="createFault" // screen name (navigation)
            options={{
                title: 'Create Fault',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="engineersFaults" // screen name (navigation)
            options={{
                title: 'Engineer Fault',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="engineersToLocations" // screen name (navigation)
            options={{
                title: 'Engineer to Location',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="userChangeRequest" // screen name (navigation)
            options={{
                title: 'Account Details Change',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
            <Tabs.Screen // UserProfile screen
            name="blueBlank" // screen name (navigation)
            options={{
                title: 'Blue Blank Screen',
                href: null, // Hides tab but keeps screen accessible via navigation.navigate()
            }}
            />
        </Tabs>
        </>
    );
}
