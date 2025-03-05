import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { useColorMode } from '@/constants/Colors';
import { ScreenStyle, generalstyles } from '../myConfig/navigation';
import { Ionicons } from '@expo/vector-icons';
import { usePost } from '../requests/makeRequests'
import Toast from 'react-native-toast-message';
import { useAsyncStorageMethods } from '@/context/AsyncMethodsContext';
import { useRouter } from 'expo-router';

interface postType {
    email: string,
    password: string,
}
interface notiType {
    type: string,
    msg: string
}
interface UsePostReturn {
    postData: Record<string, any> | null;
    isPostError: string | null;
    isPostLoading: boolean;
    PostSetup: (url: string, formData: FormData) => Promise<void>;
}

export default function Login() {
    const router = useRouter();
    const { setItem } = useAsyncStorageMethods();
    const {postData, isPostError, isPostLoading, PostSetup}: UsePostReturn = usePost();
    const [secureText, setSecureText] = useState(true);
	const uniColorMode = useColorMode(); // get styles based on the current color mode
	const placeholderTextColor = uniColorMode.icon

    const initials = {email: '', password: ''};
    const [loginPost, setLoginPost] = useState<postType>(initials)
    const [formData, setFormData] = useState(new FormData())
	// Dynamic styles based on color scheme
    const myDynamicStyles = StyleSheet.create({
        bgColor: {backgroundColor: uniColorMode.background},
        textColor: {color: uniColorMode.text},
        inputBgColor: {backgroundColor: uniColorMode.sdkb}
    });
    const handleSubmit = () => {
        if (loginPost.email.trim()!=='' && loginPost.password.trim()!=='') {
            setFormData(new FormData());
            formData.append('email', loginPost.email);
            formData.append('password', loginPost.password);
            PostSetup(
                'login/',
                formData
            );
        }
    }
    useEffect(()=>{
        if (postData) {
            setItem('loginData', postData)
            const headerDetails = {
                // @ts-ignore
                profile_picture: postData?.profile_picture,
                // @ts-ignore
                first_name: postData?.first_name,
                // @ts-ignore
                last_name: postData?.last_name,
                // @ts-ignore
                email: postData?.email,
                // @ts-ignore
                role: postData?.role,
                // @ts-ignore
                deliveryPoints: postData?.deliveryPoints?.deliveries,
                // @ts-ignore
                id: postData?.id,
            }
            setItem('headerDetails', headerDetails)
            console.log('Response (in login) set')
            const data = {type: 'success', msg: 'Login successful'}
            showToast(data)
            setLoginPost(initials)
            const delayRouter = setTimeout(() => {
                router.replace('/')
            }, 500)
            return () => clearTimeout(delayRouter)
        } else if (isPostError) {
            console.log('Error (login):', isPostError)
            const data = {type: 'error', msg: isPostError}
            showToast(data)
        }
    }, [postData, isPostError])

    const showToast = (data: notiType) => {
        console.log('Toast:', data)
        Toast.show({
            type: data.type,  // 'success' | 'error' | 'info'
            text1: data.msg,
        });
    };
	return (
		<View style={[ScreenStyle.allScreenContainer, loginStyles.loginContainer]}>
			<View style={[generalstyles.formContainer,
				myDynamicStyles.bgColor
				]}>
				<Text // form/post container
				style={[generalstyles.headerFooter, myDynamicStyles.textColor]}>Login</Text>
                <View>
                    <TextInput // input2 (body)
                        style={[
                            generalstyles.input,
                            myDynamicStyles.textColor,
                            myDynamicStyles.inputBgColor,
                            loginStyles.input,
                        ]}
                        placeholder="Email Address"
                        keyboardType="email-address"
                        placeholderTextColor={placeholderTextColor}
                        value={loginPost.email}
                        onChangeText={email=>setLoginPost({...loginPost, email})}
                    />
                </View>
                <View>
                    <TextInput // input2 (body)
                        style={[
                            generalstyles.input,
                            myDynamicStyles.textColor,
                            myDynamicStyles.inputBgColor,
                            loginStyles.input,
                        ]}
                        placeholder="Password"
                        secureTextEntry={secureText}
                        placeholderTextColor={placeholderTextColor}
                        value={loginPost.password}
                        onChangeText={password=>setLoginPost({...loginPost, password})}
                    />
                    <TouchableOpacity
                    style={loginStyles.icon}
                    onPress={() => setSecureText(!secureText)}>
                        <Ionicons name={secureText ? "eye" : "eye-off"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                {isPostLoading?
                    (<ActivityIndicator size="small" color={uniColorMode.buttonSpin} />):
                    (<View style={loginStyles.button}>
                        <Button color={uniColorMode.dkrb} title={isPostLoading?'Login in ...':'Login'} onPress={handleSubmit}
                        disabled={isPostLoading}
                        />
                    </View>)}
			</View>
		</View>
	)
}

const loginStyles = StyleSheet.create({
    loginContainer: {
        justifyContent: 'center',
        // alignSelf: 'center',
    },
    input: {
        // height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 40, // Ensure space for the icon
        fontSize: 16,
        // paddingBottom: 10,
    },
    icon: {
        position: "absolute",
        right: 10,
        top: "40%",
        transform: [{ translateY: -12 }],
        // marginBottom: 30,
        // alignSelf: 'center',
    },
    passwordField: {
        // position: 'relative',
        // width: '100%',
        // top: 0,
        // right: 0,
        // flexDirection: "row",
        // justifyContent: "center",
        // borderWidth: 1,
        // borderRadius: 8,
        // paddingHorizontal: 10
    },
    button: {
        marginHorizontal: 100,
    }
})

