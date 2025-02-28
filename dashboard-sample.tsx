// import React from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// const Dashboard = ({ navigation }) => {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.greeting}>Welcome, User! 👋</Text>
      
//       {/* Quick Actions */}
//       <View style={styles.quickActions}>
//         <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Profile')}>
//           <MaterialIcons name="person" size={24} color="white" />
//           <Text style={styles.actionText}>Profile</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
//           <MaterialIcons name="settings" size={24} color="white" />
//           <Text style={styles.actionText}>Settings</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Stats Section */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>12</Text>
//           <Text style={styles.statLabel}>New Messages</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>5</Text>
//           <Text style={styles.statLabel}>Pending Tasks</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   actionButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '48%',
//   },
//   actionText: {
//     color: 'white',
//     marginTop: 5,
//     fontWeight: 'bold',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '48%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   statNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#6c757d',
//   },
// });

// export default Dashboard;
