import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Map from '../../components/Map';
import NavigateCard from '../../components/NavigateCard';
import RideOptionsCard from '../../components/RideOptionsCard';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MapScreen = () => {
  const Stack = createStackNavigator();

  return (
    <View style={styles.container}>
      <TouchableOpacity
         onPress={() => router.back()}
         style={styles.backButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.mapContainer}>
        <Map />
      </View>

     <View style={styles.cardContainer}>
       <Stack.Navigator>
        <Stack.Screen
           name="NavigateCard"
           component={NavigateCard}
           options={{
            headerShown: false,
           }} 
        />
        <Stack.Screen
           name="RideOptionsCard"
           component={RideOptionsCard}
           options={{
            headerShown: false,
           }}
        />
       </Stack.Navigator>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    top: 60,
    left: 32,
    zIndex: 50,
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapContainer: {
    height: '50%',
  },
  cardContainer: {
    height: '50%',
  },
});