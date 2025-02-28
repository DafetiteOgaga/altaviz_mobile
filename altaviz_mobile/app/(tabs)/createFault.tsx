import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, TextInput, ActivityIndicator, Modal, FlatList, TouchableOpacity } from "react-native";
import { useColorMode } from '../../constants/Colors';
import { useNavigation } from 'expo-router';
import { generalstyles } from '../../myConfig/navigation';
import { useHeader } from '../../context/headerUpdate';
import { usePost, useGet } from '../../requests/fetchCsrfToken'
import Toast from 'react-native-toast-message';
import { toTitleCase } from '../../hooks/useAllCases';
import { useGetDataFromStorage } from '../../hooks/useGetDataFromStorage';

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

console.log('imported createFault.tsx')
export default function CreateFault() {
    const navigation:any|undefined = useNavigation();
    const [itemList, setItemList] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [others, setOthers] = useState<any>(null);
    const [modalItemVisible, setModalItemVisible] = useState<any>(false);
    // const [modalQuantityVisible, setModalQuantityVisible] = useState<any>(false);
    const {getData, isGetError, isGetLoading, GetSetup} = useGet();
    const { setHeaderTitle } = useHeader();
    const userData = useGetDataFromStorage('loginData')
    const {postData, isPostError, isPostLoading, PostSetup}: UsePostReturn = usePost();
    // const [secureText, setSecureText] = useState(true);
	const uniColorMode = useColorMode(); // get styles based on the current color mode
	// const placeholderTextColor = uniColorMode.icon
	// const [isError, setIsError] = useState<string|null>(null);

    useEffect(()=>{GetSetup(`fault-name/`)}, [])
    useEffect(()=>{
        if (getData) {
            console.log('Response:', getData)
            setItemList(getData)
        } else if (isGetError) {
            console.log('Error:', isGetError)
            const data:any = {type: 'error', msg: isPostError}
            showToast(data)
        }
    }, [getData, isGetError])
    
    // const initials = {email: '', password: ''};
    // const [loginPost, setLoginPost] = useState<postType>(initials)
    // const [formData, setFormData] = useState(new FormData())
    // const [posting, setIsPosting] = useState<boolean>(false)
	// Dynamic styles based on color scheme
    const myDynamicStyles = StyleSheet.create({
        // bgColor: {backgroundColor: 'yellow'},
        bgColor: {backgroundColor: uniColorMode.background},
        textColor: {color: uniColorMode.text},
        // inputBgColor: {backgroundColor: uniColorMode.sdkb}
    });
    const handleSubmit = () => {
        if (selectedItem) {
            const formData = new FormData();
            formData.append('location', `${userData?.branch?.location?.location}-${userData?.branch?.location?.id}`);
			formData.append('region', userData?.branch?.region?.name);
			formData.append('bank', userData?.branch?.bank?.name);
			formData.append('state', userData?.branch?.state?.name);
			formData.append('assigned_to', (userData?.branch?.branch_engineer?.engineer?.email?(userData?.branch?.branch_engineer?.engineer?.email):(userData?.region?.supervisor?.email)));
			formData.append('supervised_by', userData?.region?.supervisor?.email);
			formData.append('managed_by', userData?.region?.helpdesk?.email);
			formData.append('logged_by', userData?.email);
            formData.append('other', others);
            formData.append('title', selectedItem.name);
            console.log(
                '\nin createFault: XOXOXOXOXOXOXOXOXOXOXOXO',
                '\nselectedItem:', selectedItem,
                '\nothers:', others
            )
            formData.append('mobile', 'true');
            PostSetup(
                `fault/`,
                formData
            );
        }
    }
    useEffect(()=>{
        if (postData) {
            // @ts-ignore
            const data:any = {type: 'success', msg: postData?.message}
            showToast(data)
            setSelectedItem(null)
            navigation.navigate('index')
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
        console.log('Toast:', data)
        Toast.show({
            type: data.type,  // 'success' | 'error' | 'info'
            text1: toTitleCase(data.msg||''),
        });
    };
    console.log('in (createFault):', {itemList})
    const handleSelect = ({item}:{item:any}) => {
        console.log('\nitem:', item)
        if (item.type==='item') {
            setSelectedItem(item.item)
            setModalItemVisible(false)
        }
    };
    const selectItemObj = {name: `Select Fault`, id: 0}
    // const selectQuantityObj = 'Select Quantity'
    useEffect(()=>setHeaderTitle('Log Fault'), [itemList])
	return (
        <>
            {/* <Text style={{color: 'white'}}>Log fault page</Text> */}
            <View style={[faultStyles.requestContainer]}>
                <View>
                    {itemList &&
                        <View style={[
                            faultStyles.formContainer,
                            myDynamicStyles.bgColor,
                            // faultStyles.requestContainer,
                        ]}>
                            <Text // form/post container
                            style={[ generalstyles.headerFooter, myDynamicStyles.textColor]}>Log a Fault</Text>
                            <View style={faultStyles.selectionContainer}>
                                {/* item requested */}
                                <View>
                                    {/* Button to open dropdown */}
                                    <TouchableOpacity style={[faultStyles.dropdownButton, {backgroundColor: uniColorMode.newdrkb1}]} onPress={() => setModalItemVisible(true)}>
                                        <Text style={faultStyles.buttonText} numberOfLines={1} ellipsizeMode="tail">
                                            {selectedItem ? toTitleCase(selectedItem.name) : selectItemObj.name}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Dropdown Modal */}
                                    <Modal visible={modalItemVisible} animationType="fade" transparent>
                                        <View style={faultStyles.modalOverlay}>
                                            <View style={[faultStyles.modalContent, {backgroundColor: uniColorMode.newdrkb1}]}>
                                                <FlatList
                                                    data={[...[selectItemObj], ...itemList]}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={({ item }) => {
                                                        if (item.quantity===0) return null
                                                        if (item.name==='Select an Item') {item.quantity=undefined}
                                                        return (
                                                        <TouchableOpacity style={faultStyles.item} onPress={() => handleSelect({item: {item: item, type: 'item'}})}>
                                                            <Text style={faultStyles.itemText}>{toTitleCase(item.name)} {item.quantity?`(${item.quantity})`:undefined}</Text>
                                                        </TouchableOpacity>
                                                    )}}
                                                />
                                                <TouchableOpacity onPress={() => setModalItemVisible(false)} style={[faultStyles.closeButton, {borderColor: uniColorMode.vvvdrkbltr}]}>
                                                    <Text style={faultStyles.closeButtonText}>Close</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                                {/* other details */}
                                <View
                                // style={faultStyles.inputContainer}
                                >
                                    <TextInput
                                        style={[faultStyles.input, myDynamicStyles.textColor]}
                                        multiline={true}
                                        placeholder="Enter other details..."
                                        placeholderTextColor={uniColorMode.icon}
                                        value={others}
                                        onChangeText={others=>setOthers(others)}
                                    />
                                </View>
                            </View>
                        <View style={{paddingBottom: 10}}>
                            {isPostLoading?
                                (<ActivityIndicator size="small" color={uniColorMode.buttonSpin} />):
                                (<TouchableOpacity onPress={handleSubmit} disabled={isPostLoading} style={[faultStyles.button, {backgroundColor: uniColorMode.dkrb}]}>
                                    <Text style={faultStyles.buttonText1}>{isPostLoading?'Logging ...':'Log Fault'}</Text>
                                </TouchableOpacity>)}
                            </View>
                    </View>}
                </View>
            </View>
        </>
	)
}

// export default function TestItem () {
//     return <Text style={{color: 'white'}}>Test Item</Text>
// }

const faultStyles = StyleSheet.create({
    requestContainer: {
        marginTop: 200,
        paddingHorizontal: 20,
        // alignSelf: 'center',
    },
    formContainer: {
        borderRadius: 10,
        paddingVertical: 10,
    },
    input: {
        // height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    inputContainer: {
        // flexWrap: 'wrap',
        // alignItems: "center",
    },
    icon: {
        position: "absolute",
        right: 10,
        top: "40%",
        transform: [{ translateY: -12 }],
    },
    button: {
        marginTop: 10,
        marginHorizontal: 100,
        paddingVertical: 8,
        borderRadius: 8,
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
        // flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        gap: 15,
        paddingVertical: 5,
    }
})

