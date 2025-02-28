import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";

const itemList = [
    { name: "eeprom", quantity: 988 },
    { name: "MTS", quantity: 44 },
    { name: "clip", quantity: 374 },
    { name: "motor", quantity: 480 },
    { name: "prism", quantity: 931 },
    { name: "MS", quantity: 396 },
    { name: "sensors (black & white)", quantity: 340 },
    { name: "eeprom", quantity: 988 },
    { name: "MTS", quantity: 44 },
    { name: "clip", quantity: 374 },
    { name: "motor", quantity: 480 },
    { name: "prism", quantity: 931 },
    { name: "MS", quantity: 396 },
    { name: "sensors (black & white)", quantity: 340 },
    { name: "eeprom", quantity: 988 },
    { name: "MTS", quantity: 44 },
    { name: "clip", quantity: 374 },
    { name: "motor", quantity: 480 },
    { name: "prism", quantity: 931 },
    { name: "MS", quantity: 396 },
    { name: "sensors (black & white)", quantity: 340 },
    { name: "eeprom", quantity: 988 },
    { name: "MTS", quantity: 44 },
    { name: "clip", quantity: 374 },
    { name: "motor", quantity: 480 },
    { name: "prism", quantity: 931 },
    { name: "MS", quantity: 396 },
    { name: "sensors (black & white)", quantity: 340 },
    { name: "eeprom", quantity: 988 },
    { name: "MTS", quantity: 44 },
    { name: "clip", quantity: 374 },
    { name: "motor", quantity: 480 },
    { name: "prism", quantity: 931 },
    { name: "MS", quantity: 396 },
    { name: "sensors (black & white)", quantity: 340 },
    { name: "eeprom", quantity: 988 },
    { name: "MTS", quantity: 44 },
    { name: "clip", quantity: 374 },
    { name: "motor", quantity: 480 },
    { name: "prism", quantity: 931 },
    { name: "MS", quantity: 396 },
    { name: "sensors (black & white)", quantity: 340 },
];

const CustomDropdown = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (item) => {
        setSelectedItem(item);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Button to open dropdown */}
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>
                    {selectedItem ? selectedItem.name : "Select an Item"}
                </Text>
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={itemList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                                    <Text style={styles.itemText}>{item.name} ({item.quantity})</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: "center" },
    dropdownButton: {
        backgroundColor: "#3498db",
        padding: 10,
        borderRadius: 5,
        width: 200,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontSize: 16 },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: 300,
        padding: 20,
        borderRadius: 10,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    itemText: { fontSize: 16 },
    closeButton: {
        marginTop: 10,
        backgroundColor: "#e74c3c",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    closeButtonText: { color: "#fff", fontSize: 16 },
});

export default CustomDropdown;
