import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, TextInput,
    Button, ActivityIndicator, ScrollView, Modal, FlatList,
    TouchableOpacity } from "react-native";

import { useColorMode } from '../../constants/Colors';
// import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenStyle, generalstyles } from '../../myConfig/navigation';
// import { Ionicons } from '@expo/vector-icons';
import { useHeader } from '../../context/headerUpdate';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { fetchCsrfToken } from '@/requests/fetchCsrfToken'
import { usePost } from '../../requests/makeRequests'
import Toast from 'react-native-toast-message';
// import { useAsyncStorageMethods } from '../../context/AsyncMethodsContext';
import { toTitleCase } from '../../hooks/useAllCases';
import { useGet } from "../../requests/makeRequests";
import { getComponentName } from "@/hooks/getComponentName";

// interface postType {
//     email: string,
//     password: string,
// }
interface notiType {
    type: string,
    msg: string
}
// interface postData {
//     profile_picture: string,
// }
interface UsePostReturn {
    postData: Record<string, any> | null;
    isPostError: string | null;
    isPostLoading: boolean;
    PostSetup: (url: string, formData: FormData) => Promise<void>;
}
// interface headerDetailsType {
//     profile_picture: string,
//     first_name: string,
//     last_name: string,
//     role: string,
// }

// interface requests {
//     email:string,
//     id: string,
//     type: string,
//     url: string,
//     setForm: ()=>void
// }

// console.log('imported requestItem.tsx')
export default function RequestItem({requests}: {requests: any} ) {
    getComponentName()
    const navProps = useLocalSearchParams()
    let {id, email, type, url, setForm, screen} = requests||{}
    let urlKey:string
    if (!screen) {
        email = navProps.email
        url = navProps.url
        urlKey = url.split('-')[1]
        // console.log('urlKey (requestItem):', urlKey)
    }
    const router = useRouter();
    const [itemList, setItemList] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<any>(null);
    const [modalItemVisible, setModalItemVisible] = useState<any>(false);
    const [modalQuantityVisible, setModalQuantityVisible] = useState<any>(false);
    const {postData, isPostError, isPostLoading, PostSetup}: UsePostReturn = usePost();
    const {getData, isGetError, isGetLoading, GetSetup} = useGet();
    const { setHeaderTitle } = useHeader();
    // console.log(
    //     '\nin requestItem:',
    //     '\nid:', id,
    //     '\nemail:', email,
    //     '\ntype:', type,
    //     '\nurl:', url,
    //     '\nscreen:', screen
    // )
    // const { setItem } = useAsyncStorageMethods();
    // const [secureText, setSecureText] = useState(true);
	const uniColorMode = useColorMode(); // get styles based on the current color mode
	// const placeholderTextColor = uniColorMode.icon
	// const [isError, setIsError] = useState<string|null>(null);

    useEffect(()=>{
        GetSetup(type?`${type}s`:`${urlKey}s`)
        setSelectedItem(null)
        setSelectedQuantity(null)
    }, [url])
    useEffect(()=>{
        if (getData) {
            // console.log('Response (requestItem):', getData)
            setItemList(getData)
        } else if (isGetError) {
            // console.log('Error:', isGetError)
            const data:any = {type: 'error', msg: isPostError}
            showToast(data)
        }
    }, [getData, isGetError])
    useEffect(()=>setHeaderTitle(url==='post-part'?'Post Part':`${toTitleCase(type?String(type):urlKey)} Request`), [type])
    // const initials = {email: '', password: ''};
    // const [loginPost, setLoginPost] = useState<postType>(initials)
    // const [formData, setFormData] = useState(new FormData())
    // const [posting, setIsPosting] = useState<boolean>(false)
	// Dynamic styles based on color scheme
    const myDynamicStyles = StyleSheet.create({
        // bgColor: {backgroundColor: 'yellow'},
        bgColor: {backgroundColor: uniColorMode.background},
        textColor: {color: uniColorMode.text},
        inputBgColor: {backgroundColor: uniColorMode.sdkb}
    });
    const handleSubmit = () => {
        if (selectedItem && selectedQuantity) {
            // console.log(
            //     '\nin requestItem: XOXOXOXOXOXOXOXOXOXOXOXO',
            //     '\nselectedItem:', selectedItem,
            //     '\nselectedQuantity:', selectedQuantity
            // )
            const formData = new FormData();
            formData.append('name', selectedItem.name);
            formData.append('quantityRequested', selectedQuantity);
            formData.append('reason', '');
            formData.append('fault', id?.toString());
            formData.append('user', email);
            formData.append('mobile', 'true');
            PostSetup(url==='post-part'?`${url}/${1}/`:`${url}/`,
                formData
            );
        }
    }
    useEffect(()=>{
        if (postData) {
            const data:any = {type: 'success', msg: postData?.msg||postData?.received}
            showToast(data)
            if (type) {setForm(false)}
            router.push('/')
        } else if (isPostError) {
            // console.log('Error (login):', isPostError)
            const data = {type: 'error', msg: isPostError}
            showToast(data)
        }
    }, [postData, isPostError])
    // console.log(
    //     '\npostData:', postData,
    //     '\nerror:', isPostError,
    //     '\nloading:', isPostLoading
    // )
    const showToast = (data: notiType) => {
        // console.log('Toast:', data)
        Toast.show({
            type: data.type,  // 'success' | 'error' | 'info'
            text1: toTitleCase(data.msg||''),
        });
    };
    // console.log('in (requestItem):', {itemList})
    const handleSelect = ({item}:{item:any}) => {
        // console.log('\nitem:', item)
        if (item.type==='item') {
            setSelectedItem(item.item)
            setModalItemVisible(false)
        } else if (item.type==='quantity') {
            setSelectedQuantity(item.item)
            setModalQuantityVisible(false)
        }
    };
    const selectItemObj = {name: `Select ${toTitleCase(type?type:urlKey!)}`, quantity: 1}
    const selectQuantityObj = 'Select Quantity'
	return (
        // <Text style={{color: 'white'}}>Request Item</Text>
		<View style={[
            requestStyles.requestContainer,
            {marginTop: type?15:250,}
            ]}>
            <View>
                {itemList &&
                    <View style={[
                        requestStyles.formContainer,
                        myDynamicStyles.bgColor,
                        {paddingVertical: type?10:30,}
                    ]}>
                        <Text // form/post container
                        style={[ generalstyles.headerFooter, myDynamicStyles.textColor]}>{toTitleCase(url==='post-part'?'Post Part':('Request '+(type?type:urlKey!))||'')}</Text>
                        <View style={requestStyles.selectionContainer}>
                            {/* item requested */}
                            <View>
                                {/* Button to open dropdown */}
                                <TouchableOpacity style={[requestStyles.dropdownButton, {backgroundColor: uniColorMode.newdrkb1}]} onPress={() => setModalItemVisible(true)}>
                                    <Text style={requestStyles.buttonText} numberOfLines={1} ellipsizeMode="tail">
                                        {selectedItem ? toTitleCase(selectedItem.name) : selectItemObj.name}
                                    </Text>
                                </TouchableOpacity>

                                {/* Dropdown Modal */}
                                <Modal visible={modalItemVisible} animationType="fade" transparent>
                                    <View style={requestStyles.modalOverlay}>
                                        <View style={[requestStyles.modalContent, {backgroundColor: uniColorMode.newdrkb1}]}>
                                            <FlatList
                                                data={[...[selectItemObj], ...itemList]}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item }) => {
                                                    if (item.quantity===0) return null
                                                    if (item.name==='Select an Item') {item.quantity=undefined}
                                                    return (
                                                    <TouchableOpacity style={requestStyles.item} onPress={() => handleSelect({item: {item: item, type: 'item'}})}>
                                                        <Text style={requestStyles.itemText}>{toTitleCase(item.name)} {item.quantity?`(${item.quantity})`:undefined}</Text>
                                                    </TouchableOpacity>
                                                )}}
                                            />
                                            <TouchableOpacity onPress={() => setModalItemVisible(false)} style={[requestStyles.closeButton, {borderColor: uniColorMode.vvvdrkbltr}]}>
                                                <Text style={requestStyles.closeButtonText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            {/* Quantity requested */}
                            <View>
                                {/* Button to open dropdown */}
                                <TouchableOpacity style={[requestStyles.dropdownButton, {backgroundColor: uniColorMode.newdrkb1}]} onPress={() => setModalQuantityVisible(true)}>
                                    <Text style={requestStyles.buttonText}>
                                        {selectedQuantity?selectedQuantity:selectQuantityObj}
                                    </Text>
                                </TouchableOpacity>

                                {/* Dropdown Modal */}
                                <Modal visible={modalQuantityVisible} animationType="fade" transparent>
                                    <View style={requestStyles.modalOverlay}>
                                        <View style={[requestStyles.modalContent, {backgroundColor: uniColorMode.newdrkb1}]}>
                                            <FlatList
                                                data={[selectQuantityObj, ...Array.from({ length: 30 }, (_, i) => i + 1)]}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item }) => {
                                                    // if (item.quantity===0) return null
                                                    // if (item.name==='Select an Item') {item.quantity=undefined}
                                                    return (
                                                    <TouchableOpacity style={requestStyles.item} onPress={() => handleSelect({item: {item: item, type: 'quantity'}})}>
                                                        <Text style={requestStyles.itemText}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}}
                                            />
                                            <TouchableOpacity onPress={() => setModalQuantityVisible(false)} style={[requestStyles.closeButton, {borderColor: uniColorMode.vvvdrkbltr}]}>
                                                <Text style={requestStyles.closeButtonText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                    {isPostLoading?
                        (<ActivityIndicator size="small" color={uniColorMode.buttonSpin} />):
                        (<TouchableOpacity onPress={handleSubmit} disabled={isPostLoading} style={[requestStyles.button, {backgroundColor: uniColorMode.dkrb}]}>
                            <Text style={requestStyles.buttonText1}>{isPostLoading?'Requesting ...':'Make Request'}</Text>
                        </TouchableOpacity>)}
                </View>}
            </View>
		</View>
	)
}

// export default function TestItem () {
//     return <Text style={{color: 'white'}}>Test Item</Text>
// }

const requestStyles = StyleSheet.create({
    requestContainer: {
        // marginTop: 15,
        paddingHorizontal: 20,
    },
    formContainer: {
        borderRadius: 10,
        // paddingVertical: 10,
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
    button: {
        marginTop: 10,
        marginHorizontal: 100,
        paddingVertical: 8,
        borderRadius: 8,
        // alignItems: "center",
        // justifyContent: "center",
        // backgroundColor: "#eee",
    },
    dropdownButton: {
        padding: 10,
        borderRadius: 5,
        maxWidth: 200,
        overflow: 'hidden',
        flexWrap: 'nowrap',
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16
    },
    buttonText1: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        // justifyContent: "center",
        marginVertical: 50,
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        borderRadius: 10,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#777",
    },
    itemText: {
        fontSize: 16,
        color: "#eee",
    },
    closeButton: {
        marginTop: 5,
        // backgroundColor: "#e74c3c",
        padding: 10,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: "#777",
        alignItems: "center",
    },
    closeButtonText: {
        color: "#eee",
        fontSize: 16
    },
    selectionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        gap: 15,
        paddingVertical: 5,
    }
})
