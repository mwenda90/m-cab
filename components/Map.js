import { StyleSheet, Text, View, TouchableOpacity,Image  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector, } from 'react-redux';
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useRef, useEffect, useState } from 'react';
import * as Location from 'expo-location';



const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const [location, setLocation] = useState();
 
  
 
  
  
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

     
    };

    getLocation();
  }, []);
   
 


   useEffect(() => {
     if (!origin || !destination) return;

     // Zoom to fit markers
     mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgepadding: { top: 50, right: 50, bottom: 50, left: 50 },
     }); 
   }, [origin, destination]);

   useEffect(() => {
     if (!origin || !destination) return;

     const getTravelTime = async () => {
        fetch( 
           `https://maps.googleapis.com/maps/api/distancematrix/json? 
            units=imperial&origins=${origin.description}&destinations=
            ${destination.description}&key=${GOOGLE_MAPS_APIKEY}` 
        )
            .then((res) => res.json()) 
            .then((data) => {   
              dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
          });
      };

      getTravelTime();
  },  [origin, destination, GOOGLE_MAPS_APIKEY]);
 
   
  return  (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="mutedStandard"
      showsUserLocation ={true}
      followsUserLocation ={true}
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta:  0.0922,
        longitudeDelta:  0.0421,
     }}
   >
    
     {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
              }}
              
                style={styl.customMarker}
                title='my location'
                description='description'   
                
             >

             <View style={styl.addressBox}>
               <TouchableOpacity onPress={(event) => console.log(event.location.coordinate)}>
                 <Text numberOfLines={2} style={styl.addressText}>
                 {location.title}
                 </Text>
               </TouchableOpacity>
            </View>
            <Image source={require('../assets/pin5.png')} />
           
           </Marker>
            )}
 

      {origin && destination && (
        <MapViewDirections
           origin={origin.description}
           destination={destination.description}
           apikey={GOOGLE_MAPS_APIKEY}
           strokeWidth={3}
           strokeColor="black" 
       />
    )}
      {origin?.location && (
          <Marker
            coordinate={{ 
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            title="Origin"
            description={origin.description}
            identifier="origin"
         />
      )}

      {destination?.location && (
        <Marker
           coordinate={{ 
              latitude: destination.location.lat,
              longitude: destination.location.lng,
           }}
           title="Destination"
           description={destination.description}
           identifier="destination"
         />
      )}
      
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});

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
