import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 
"react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination } from "../slices/navSlice";
import { router } from 'expo-router';
import NavFavourites  from './NavFavourites';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const NavigateCard = () => {
  const dispatch = useDispatch();

  const handleRidePress = () => {
    router.push('/ride-options' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>M ~ CAB </Text>
      <View style={styles.inputContainer}>
        <View>
          <GooglePlacesAutocomplete 
             placeholder="Where to?"
             styles={toInputBoxStyles} 
             fetchDetails={true}
             returnKeyType={"search"}
             minLength={2}
             onPress={(data, details = null) => {
                dispatch(
                  setDestination({
                    location: details.geometry.location,
                    description: data.description,
                })
              );

               handleRidePress();
              
             }}
             enablePoweredByContainer={false}
             query= {{
               key: GOOGLE_MAPS_APIKEY,
               language:"en",
             }}
             nearbyPlacesAPI="GooglePlacesSearch"
             debounce={400}
          />
        </View>

        <NavFavourites />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleRidePress}
          style={styles.ridesButton}
       >
          <Ionicons name="car" color="white" size={16} />
           <Text style={styles.ridesText}>Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.eatsButton}>
          <Ionicons
            name="fast-food-outline"
            color="black"
            size={16}
       />
          <Text style={styles.eatsText}>Eats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 20,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  ridesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    width: 96,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ridesText: {
    color: 'white',
    textAlign: 'center',
  },
  eatsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 96,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
  },
  eatsText: {
    textAlign: 'center',
  },
});

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    borderRadius: 40,
    fontSize: 18,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});