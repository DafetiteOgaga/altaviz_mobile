// import React from "react";
// import { View, Text, TouchableOpacity, Linking, ScrollView, StyleSheet, Image } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";

// const userData = {
//   state: "Lagos",
//   location: "Ikeja",
//   role: "Technician",
//   supervisor: "John Doe",
//   supervisorLink: "https://example.com/supervisor",
//   helpDeskLink: "https://example.com/helpdesk",
//   email: "johndoe@example.com",
//   deliveries: 25,
//   phone: "+234 812 345 6789",
//   secondPhone: "+234 909 876 5432",
//   region: "South-West",
//   pendingFaults: 3,
//   unconfirmedResolutions: 5,
// };

// const Dashboard = () => {
//   return (
//     <LinearGradient colors={["#1E1E1E", "#444"]} style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.headerContainer}>
//           <Image source={{ uri: "https://i.pravatar.cc/100" }} style={styles.profileImage} />
//           <Text style={styles.username}>{userData.supervisor}</Text>
//           <Text style={styles.role}>{userData.role}</Text>
//         </View>

//         <View style={styles.cardContainer}>
//           <InfoCard icon="location" label="Location" value={userData.location} />
//           <InfoCard icon="globe" label="Region" value={userData.region} />
//           <InfoCard icon="mail" label="Email" value={userData.email} />
//           <InfoCard icon="call" label="Phone" value={userData.phone} />
//           {userData.secondPhone && <InfoCard icon="call" label="Second Phone" value={userData.secondPhone} />}
//           <StatCard label="Deliveries" value={userData.deliveries} icon="cube" />
//           <StatCard label="Pending Faults" value={userData.pendingFaults} icon="warning" highlight />
//           <StatCard label="Unconfirmed Resolutions" value={userData.unconfirmedResolutions} icon="checkmark-circle" highlight />
//           <LinkCard label="Supervisor" value={userData.supervisor} url={userData.supervisorLink} icon="person" />
//           <LinkCard label="Help Desk" value="Contact Support" url={userData.helpDeskLink} icon="help-circle" />
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const InfoCard = ({ icon, label, value }) => (
//   <View style={styles.infoCard}>
//     <Ionicons name={icon} size={24} color="#888" />
//     <View>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   </View>
// );

// const StatCard = ({ label, value, icon, highlight }) => (
//   <View style={[styles.statCard, highlight && styles.highlightCard]}>
//     <Ionicons name={icon} size={28} color={highlight ? "#FF4C4C" : "#4CAF50"} />
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// const LinkCard = ({ label, value, url, icon }) => (
//   <TouchableOpacity style={styles.linkCard} onPress={() => Linking.openURL(url)}>
//     <Ionicons name={icon} size={24} color="#007AFF" />
//     <Text style={styles.linkLabel}>{label}</Text>
//     <Text style={styles.linkValue}>{value}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContainer: { padding: 20 },
//   headerContainer: { alignItems: "center", marginBottom: 20 },
//   profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
//   username: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
//   role: { fontSize: 16, color: "#BBB" },
//   cardContainer: { gap: 15 },
//   infoCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#333", padding: 15, borderRadius: 10 },
//   infoLabel: { color: "#BBB", fontSize: 14 },
//   infoValue: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
//   statCard: { alignItems: "center", backgroundColor: "#444", padding: 15, borderRadius: 10 },
//   highlightCard: { backgroundColor: "#222" },
//   statValue: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
//   statLabel: { fontSize: 14, color: "#BBB" },
//   linkCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#222", padding: 15, borderRadius: 10 },
//   linkLabel: { color: "#FFF", fontSize: 16, marginLeft: 10 },
//   linkValue: { color: "#007AFF", fontSize: 14, marginLeft: "auto" },
// });

// export default Dashboard;
