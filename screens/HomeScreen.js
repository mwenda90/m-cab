import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect  } from 'react';
import tw from "tailwind-react-native-classnames";
import NavOptions from '../components/NavOptions';
import { GooglePlacesAutocomplete } from 
'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch,useSelector  } from 'react-redux';
import { setDestination, setOrigin, selectOrigin } from '../slices/navSlice';
import MapView,{ Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'








navigator.geolocation = require("expo-location");
navigator.geolocation = require('react-native-geolocation-service');




const HomeScreen = () => {
  const dispatch = useDispatch();
  const logoImg = require('../assets/mcab_logo.jpg')
  const mapRef = React.createRef();
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Location Loading.....');
  
  const [currentLocation, setCurrentLocation] = useState();
  const origin = useSelector(selectOrigin);
  
  
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [mapRegion, setMapRegion] = useState();




 
 

  useEffect(() => {
    (async () => {
      // permissions check
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      console.log('status', status)
        

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setMapRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.0922,
        latitudeDelta: 0.0421
        
      })
      
      console.log('location', location)
  
    
       //get current position lat and long
      const {coords} = await Location.getCurrentPositionAsync();  
      console.log(coords)

    

      if(coords){
        const {latitude,longitude} =coords;
        console.log(latitude,longitude);
        
       //provide lat and long to get the the actual address
      let responce = await Location.reverseGeocodeAsync({           
        latitude,
        longitude
      });
      console.log(responce)
     
      //loop on the responce to get the actual result
      for(let item of responce ){ 
      let address = `${item.name} ${item.city}`
      setDisplayCurrentAddress(address)
      
    }
   }
  })()
 
  },[])

 
  
 
  
  
  return (

    <SafeAreaView style={tw`bg-white h-full`}>
      < View style={tw`p-3 `}>
        
          <Image
            style={{
              width: 200,
              height: 120,
              resizeMode: "contain",
            }}
            source={logoImg}
           />

           <View style={{ 
            textDecorationLine: 'underline',
            borderRadius: 40,
           
           
            }}>
            <Text style={tw`text-center  text-xl`}>Ride With Us ?</Text>
           </View>

      <View>
         
      <GooglePlacesAutocomplete 
            currentLocation={true} 
            currentLocationLabel='Current Location'
            placeholder='Where from?'
            value={currentLocation}
            fetchDetails={true}
            autoFocus={false}
            styles={toInputBoxStyles}
            listViewDisplayed='auto'    // true/false/undefined
            onPress={(data,details=null) => {
              dispatch(
                setOrigin({            
                  location:details.geometry.location, 
                  description:data.description,
                })     
             );         
              dispatch(setDestination(null));
              
             }}
            
              renderRightButton={() => (
                <View style={{
                  marginLeft:1,
                  backgroundColor:"#DDDDDF",
                  flexDirection:"row",
                  height:44,
                  
                  padding:5,
                  borderBottomRightRadius:30,
                  borderTopRightRadius:30,
                }}
               
                >
                   <Ionicons name="location" size={30} color="green"
                     onPress= {setOrigin}      
    
                 />
                 
                </View>
               
            )}
             
             renderLeftButton={() => (
              <View style={{
                height:44,
                flexDirection:"row",
                marginLeft:2,
                backgroundColor:"#DDDDDF",
                padding:5,
                borderTopLeftRadius:30,
                borderBottomLeftRadius:30,
                alignItems:"center"
              }}>
                <Ionicons name="search" size={25} color="black" 
               
                />
                
              </View>
            )} 

             returnKeyType={"search"}    
             enablePoweredByContainer={false}
             minLength={2}
             query= {{
               key: GOOGLE_MAPS_APIKEY,
               language:"en",
               types: 'geocode', // default: 'geocode'
               components: 'country:ke',   
             }}   
             GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance'
            }}
             nearbyPlacesAPI="GoogleReverseGeocoding"
             GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: 'formatted_address',
            }}
             GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
           
             debounce={400} 
            
            />

           </View>
      
          <View style={{
              backgroundColor: "white",
              flexDirection:"row",
              paddingTop: 10,
              }}>
            <Ionicons
                 name = "location"
                 color = 'black'
                 size = {26}
             />
           
              {location ? (
                <Text>
                  latitude: {location.coods.latitude}
                  {'\n'}
                  longitude: {location.coods.longitude}
             </Text>
              ):(
                <TouchableOpacity
                onPress={(data,responce) =>{
                  dispatch( 
                  setOrigin({
                    address:responce.location,
                    description:data.description,
                 })
                );
                dispatch(setDestination(null));
               }
               }
                >
                <Text>{displayCurrentAddress}</
              Text> 
              </TouchableOpacity>
              )  
              }
              </View>
           
      
              <NavOptions />
              
              
              
           <View style ={tw`h-1/3`}>
         
     
     <MapView
         ref={mapRef}
         style ={tw`flex-1`}
         region={mapRegion}
         showsUserLocation ={true}
         followsUserLocation={true}
         currentLocation={true}         
         showsTraffic={true}
         loadingEnabled={true}
         initialRegion={mapRegion}
         >
      {mapRegion?. location && (
          <Marker
            coordinate={{ 
              latitude: origin.location.lat,
              longitude: origin.location.lng,
             }}
             
            title='Origin'
            description={origin.description}
            identifier="origin"
              
            
         >
          <View>
           <Image source={require('../assets/pin5.png')} />
          </View>
       
       </Marker>
       )}
      </MapView>
  
  
      {address && (
      <TouchableOpacity style={{ position:'absolute', top:20, right:20 }}
      onPress={() => setAddress(!address)}>
      <Text>{displayCurrentAddress}</Text> 
      </TouchableOpacity>
       )} 
  
    
     </View>

     </View>
    
       
      

    </SafeAreaView>
 
  );
};

export default HomeScreen;

const toInputBoxStyles = StyleSheet.create({

  container: {
    backgroundColor: "white",
    paddingTop: 20,
    
    flex: 0,
    
  },
  textInput: {
    flex: 1,
    backgroundColor: "#DDDDDF",
    
    fontSize: 18,
    borderRadius: 0,
    
  },
  textInputContainer: {
    
    paddingHorizontal: 2,
    paddingBottom: 0,
    
  },
  buttomP: {
    height:60,
    width: 40,
    borderWidth:1,
    backgroundColor: '#fff',
  },
  description: {
    fontWeight: 'bold',
  },

})



const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  map: {
    width: "100%",
    height: "100%",
    minZoomLevel: 10,
    maxZoomLevel: 15,
  },

  container2: {
    height:'75%',
    justifyContent: 'center',
   },
 
});


const styl = StyleSheet.create({
  customMarker: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  addressBox: {
    width: 150,
    height: 45,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },
  addressText: {
    textDecorationLine: 'underline'
  }
}); 

const locationstyles = StyleSheet.create({
 
  container: {
    flex: 0,
    backgroundColor: "black",
    paddingTop: 10,
    
  },
  textInput: {
    flex: 1,
    backgroundColor: "#DDDDDF",
    fontSize: 18,
    borderRadius: 0,
    
  },
});

