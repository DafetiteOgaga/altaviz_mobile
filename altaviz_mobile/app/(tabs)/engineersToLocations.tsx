import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    ActivityIndicator, Modal, TextInput
} from "react-native";
import { useColorMode } from "../../constants/Colors";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { generalstyles } from "../../myConfig/navigation";
import { useHeader } from "../../context/headerUpdate";
import { usePatch, useGet } from "../../requests/makeRequests";
import Toast from "react-native-toast-message";
import { toTitleCase } from "../../hooks/useAllCases";
// import { useAsyncStorageMethods } from "../../context/AsyncMethodsContext";
import { useGetDataFromStorage } from "../../context/useGetDataFromStorage";

interface notiType {
    type: string;
    msg: string;
}

interface UsePostReturn {
    patchData: Record<string, any> | null;
    isPatchError: string | null;
    isPatchLoading: boolean;
    PatchSetup: (url: string, formData: FormData) => Promise<void>;
}

export default function EngineerToLocation() {
    const { screen, email, id, url } = useLocalSearchParams();
    const router = useRouter();
    // const { removeItem } = useAsyncStorageMethods();
    const [itemList, setItemList] = useState<any[]>([]);
    const [engineerList, setEngineerList] = useState<any[]>([]);
    const [activeLocationId, setActiveLocationId] = useState<any>(null);
    const { getData: itemData, isGetError: itemError, isGetLoading: itemLoading, GetSetup: fetchItems } = useGet();
    const { getData: engineerData, isGetError: engineerError, isGetLoading: engineerLoading, GetSetup: fetchEngineers } = useGet();
    const [selectedEngineers, setSelectedEngineers] = useState<Record<number, any>>({});
    // const [others, setOthers] = useState<string>("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const { getData, isGetError, isGetLoading, GetSetup } = useGet();
    const { setHeaderTitle } = useHeader();
    useEffect(()=>setHeaderTitle('Assign Engineers to Locations'))
    const userData = useGetDataFromStorage("loginData");
    const {patchData, isPatchError, isPatchLoading, PatchSetup}: UsePostReturn = usePatch();
    const uniColorMode = useColorMode();

    const newline = "\n";
    console.log(
        newline, 'in engineerToLocation c:',
        newline, {screen},
        newline, {email},
        newline, {id},
        newline, {url},
    )

    // Fetch item list
    useEffect(() => {
        if (userData?.role==='supervisor') {
            fetchItems(`new-location-assignment/list/${userData?.id}/`)
            fetchEngineers(`region-engineers/${userData?.id}/`)
        }
        // return () => {
        //     removeItem("loginData");
        //     removeItem("baseUrl");
        //     removeItem("headerDetails");
        //     console.log("Removed login details");
        // }
    }, [userData?.id])

    // useEffect(() => {
    //     if (userData) {fetchEngineers(`region-engineers/${userData?.id}/`)}
    // }, [userData])

    // Handle item data response
    useEffect(() => {
        if (itemData) {
            setItemList(itemData);
        } else if (itemError) {
            console.log("Error:", itemError);
            showToast({ type: "error", msg: itemError });
        }
    }, [itemData, itemError]);

    // Handle engineer data response
    useEffect(() => {
        if (engineerData) {
            setEngineerList(engineerData);
        } else if (engineerError) {
            console.log("Error:", engineerError);
            showToast({ type: "error", msg: engineerError });
        }
    }, [engineerData, engineerError]);

    // Handle form submission
    const handleSubmit = () => {
        // const filteredItems = Object.keys(selectedEngineers)?.filter?.((selected:any)=>selectedEngineers?.[selected]?.first_name?.toLowerCase()!=='select engineer')
        // console.log('in engineerToLocation (filteredItems):', {filteredItems})
        // console.log('in engineerToLocation (selectedEngineers):', selectedEngineers)
        Object.keys(selectedEngineers).forEach((key:any) => {
            if (selectedEngineers[key]?.first_name?.toLowerCase() === 'select engineer') {
                delete selectedEngineers[key];
            }
        });
        
        if (Object.keys(selectedEngineers).length) {
            let locations = {}
            let locationKey: string = '';
            let selectedEngineerConstruct: string = '';
            Object.keys(selectedEngineers).forEach((item:any) => {
                console.log('in engineerToLocation (item):', item)
                let selectedLocation = itemList.find((location) => location.id === parseInt(item));
                console.log('in engineerToLocation (selectedLocation):', JSON.stringify(selectedLocation, null, 4))
                locationKey = `${selectedLocation?.location?.location}-${selectedLocation?.location?.id}`;
                selectedEngineerConstruct = `${selectedEngineers[item]?.first_name})-(${selectedEngineers[item]?.email})-(${selectedEngineers[item]?.id}`
                locations = {
                    ...locations,
                    [locationKey]: selectedEngineerConstruct,
                };
            })
            const formData = new FormData();
            formData.append("mobile", "true");
            // formData.append("title", 'selectedEngineers.name');
            // formData.append("other", others);

            console.log(
                "\nSubmitting Data:",
                // '\n', JSON.stringify(selectedEngineers, null, 4),
                // '\nlength of object:', Object.keys(selectedEngineers).length,
                '\nlocation:', JSON.stringify(locations, null, 4),
                // '\nlocationKey:', locationKey,
                // '\nselectedEngineerConstruct:', selectedEngineerConstruct,
                // '\nlength of array', filteredItems.length
            )
            Object.entries(locations)?.forEach?.(([key, value])=>{
                console.log('in engineerToLocation (key):', key, value)
                formData.append(key, String(value))
            })
            if (userData?.id) PatchSetup(`new-location-assignment/${userData?.id}/`, formData);
        }
    }

    // Handle post response
    useEffect(() => {
        if (patchData) {
            // @ts-ignore
            showToast({ type: "success", msg: patchData?.msg });
            setSelectedEngineers({});
            router.push("/");
        } else if (isPatchError) {
            showToast({ type: "error", msg: isPatchError });
        }
    }, [patchData, isPatchError]);

    // Show toast notifications
    const showToast = (data: notiType) => {
        Toast.show({
            type: data.type,
            text1: toTitleCase(data.msg || ""),
        });
    };

    // Define dynamic styles
    const myDynamicStyles = StyleSheet.create({
        bgColor: { backgroundColor: uniColorMode.background },
        textColor: { color: uniColorMode.text },
    });
    // www
    // console.log("Response itemlist (engineerToLocation):", JSON.stringify(itemList, null, 4));
    // console.log("Response engineerlist (engineerToLocation):", JSON.stringify(engineerList, null, 4));
    // console.log('in engineerToLocation:', {selectedEngineers})
    // const handleSelect = () => (locationId?: number, engineer?: any) => {
    //     if (locationId && engineer) {
    //         setSelectedEngineers((prev) => ({
    //             ...prev,
    //             [locationId]: engineer,
    //         }))
    //     }
    //     setModalVisible(false);
    // }
    if (itemLoading&&engineerLoading) {
        return <ActivityIndicator style={{marginTop: 250}} size="large" color={uniColorMode.buttonSpin} />
    }
    return (
        <View style={[faultStyles.requestContainer]}>
            <View>
                {itemList && (
                    <View style={[faultStyles.formContainer, myDynamicStyles.bgColor]}>
                        <Text style={[generalstyles.headerFooter, myDynamicStyles.textColor]}>
                            Assign Engineers to Locations
                        </Text>

                        {/* List of Items */}
                        <FlatList
                            data={itemList}
                            keyExtractor={(item) => item.id.toString()}
                            extraData={selectedEngineers}
                            renderItem={({ item }) => {
                                // console.log("Item:", item?.location?.location);
                                return (
                                    <ItemRow
                                        item={item}
                                        selectedEngineers={selectedEngineers[item?.id] || 'Select Engineer'}
                                        setSelectedEngineers={setSelectedEngineers}
                                        setModalVisible={setModalVisible}
                                        setActiveLocationId={setActiveLocationId}
                                    />
                                )}}
                            ListEmptyComponent={() => (
                                <Text style={{ color: "white", textAlign: "center" }}>
                                    No locations available.
                                </Text>
                            )}
                        />

                        {/* Other Field */}
                        {/* <TextInput
                            style={[faultStyles.input, myDynamicStyles.textColor]}
                            placeholder="Enter additional details"
                            placeholderTextColor={uniColorMode.icon}
                            value={others}
                            onChangeText={setOthers}
                        /> */}

                        {/* Submit Button */}
                        <View style={{ paddingBottom: 10 }}>
                            {isPatchLoading ? (
                                <ActivityIndicator size="small" color={uniColorMode.buttonSpin} />
                            ) : (
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isPatchLoading}
                                    style={[faultStyles.button, { backgroundColor: uniColorMode.dkrb }]}
                                >
                                    <Text style={faultStyles.buttonText1}>
                                        {isPatchLoading ? "Assigning ..." : "Assign Engineer(s)"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* Modal for Selection */}
            {modalVisible && (
                <SelectModal
                    engineerList={engineerList}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    itemList={itemList}
                    handleSelect={(engineer:any) => {
                        // console.log("engineer in (handleSelect):", JSON.stringify(engineer, null, 4));
                        // console.log('in (handleSelect):', engineer?.first_name)
                        if (activeLocationId!==null) {
                            setSelectedEngineers((prev) => ({
                                ...prev,
                                [activeLocationId]: engineer,
                            }));
                        }
                        setModalVisible(false);
                    }}
                />
            )}
        </View>
    );
}

/* -------------------------------------
 * Item Component
 * ------------------------------------- */
function ItemRow({ item, selectedEngineers, setSelectedEngineers, setModalVisible, setActiveLocationId }: any) {
    // console.log('in engineerToLocation > ItemRow (selectedEngineers):', JSON.stringify(selectedEngineers, null, 4))
    // console.log('in > ItemRow (item?.id):', item?.id)
    const firstName = selectedEngineers?.first_name||selectedEngineers
    // console.log('in > ItemRow (firstName):', {firstName})
    return (
        <View style={{flexDirection: 'row', borderBottomWidth: 1,
            borderBottomColor: "#ccc", padding: 10, justifyContent: 'space-around'}}>
            <View>
                <Text style={{ color: "white" }}>{toTitleCase(item?.location?.location)||'Not Set'}</Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setActiveLocationId(item.id)
                        setModalVisible(true)
                    }}
                    style={{
                        // padding: 10,
                        backgroundColor: selectedEngineers?.id === item.id ? "lightgray" : "transparent",
                        // borderBottomWidth: 1,
                        // borderBottomColor: "#ccc",
                    }}
                >
                    <Text style={{...firstName?.toLowerCase()!=='select engineer'?faultStyles.selectedEngineer:{color: "white"}}}>{toTitleCase(firstName||'')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* -------------------------------------
 * Modal Component
 * ------------------------------------- */
function SelectModal({ engineerList, modalVisible, setModalVisible, itemList, handleSelect }: any) {
    const uniColorMode = useColorMode();
    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
            <View style={faultStyles.modalOverlay}>
                <View style={[faultStyles.modalContent, { backgroundColor: uniColorMode.newdrkb1}]}>
                    <Text style={faultStyles.modalHeader}>Select an Item</Text>
                    <FlatList
                        data={[...[{first_name: 'Select Engineer', id: 0}], ...engineerList]}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            // console.log("Item in (SelectModal):", item);
                            return (
                                <TouchableOpacity onPress={() => handleSelect(item)} style={faultStyles.item}>
                                    <Text style={faultStyles.itemText}>{toTitleCase(item.first_name||'')}</Text>
                                </TouchableOpacity>
                            )}}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={[faultStyles.closeButton, {borderColor: uniColorMode.vvvdrkbltr}]}>
                        <Text style={faultStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const faultStyles = StyleSheet.create({
    requestContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
        marginVertical: 290,
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
        justifyContent: "center",
        marginVertical: 100,
        marginHorizontal: 50,
        borderRadius: 10,
        // alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        borderRadius: 10,
    },
    modalHeader: {
        color: '#eee',
        fontSize: 18,
        fontWeight: "bold"
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
    },
    selectedEngineer: {
        borderWidth: 1,
        borderColor: 'lightgray',
        // color: "green"
        backgroundColor: 'green',
        color: "white",
        paddingHorizontal: 5,
        borderRadius: 5,
        // fontSize: 16,
    }
})
