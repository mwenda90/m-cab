import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import tw from "twrnc";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setDestination, setOrigin, selectOrigin } from "../slices/navSlice";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

navigator.geolocation = require("expo-location");
navigator.geolocation = require("react-native-geolocation-service");

const HomeScreen = () => {
  const dispatch = useDispatch();
  const logoImg = require("../assets/mcab_logo.jpg");
  const mapRef = React.createRef();
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Location Loading....."
  );

  const [currentLocation, setCurrentLocation] = useState();
  const origin = useSelector(selectOrigin);

  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [mapRegion, setMapRegion] = useState();

  useEffect(() => {
    (async () => {
      // permissions check
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      console.log("status", status);

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setMapRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.0922,
        latitudeDelta: 0.0421,
      });

      console.log("location", location);

      //get current position lat and long
      const { coords } = await Location.getCurrentPositionAsync();
      console.log(coords);

      if (coords) {
        const { latitude, longitude } = coords;
        console.log(latitude, longitude);

        //provide lat and long to get the the actual address
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        console.log(response);

        //loop on the response to get the actual result
        for (let item of response) {
          let address = `${item.name} ${item.city}`;
          setDisplayCurrentAddress(address);
        }
      }
    })();
  }, []);

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View View style={tw`p-3 `}>
        <Image
          style={{
            width: 200,
            height: 120,
            resizeMode: "contain",
          }}
          source={logoImg}
        />

        <View
          style={{
            textDecorationLine: "underline",
            borderRadius: 40,
          }}
        >
          <Text style={tw`text-center  text-xl`}>Ride With Us ?</Text>
        </View>

        <View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View keyboardShouldPersistTaps="handled">
              <GooglePlacesAutocomplete
                currentLocation={true}
                currentLocationLabel={"Current location"}
                placeholder="Where from?"
                value={currentLocation}
                fetchDetails={true}
                autoFocus={false}
                styles={toInputBoxStyles}
                listViewDisplayed="auto" // true/false/undefined
                renderRow={(row) =>
                  row.isCurrentLocation ? (
                    <View style={{ flexDirection: "row", marginLeft: 10 }}>
                      <Text>icon</Text>
                      <Text style={{ color: "black", marginLeft: 10 }}>
                        {row.description}
                      </Text>
                    </View>
                  ) : (
                    <Text>{displayCurrentAddress}</Text>
                  )
                }
                onPress={(data, details = null) => {
                  dispatch(
                    setOrigin({
                      location: details.geometry.location,
                      description: data.description,
                    })
                  );
                  dispatch(setDestination(null));
                }}
                renderRightButton={() => (
                  <View
                    style={{
                      marginLeft: 1,
                      backgroundColor: "#DDDDDF",
                      flexDirection: "row",
                      height: 44,

                      padding: 5,
                      borderBottomRightRadius: 30,
                      borderTopRightRadius: 30,
                    }}
                  >
                    <Ionicons
                      name="location"
                      size={30}
                      color="green"
                      onPress={setLocation}
                    />
                  </View>
                )}
                renderLeftButton={() => (
                  <View
                    style={{
                      height: 44,
                      flexDirection: "row",
                      marginLeft: 2,
                      backgroundColor: "#DDDDDF",
                      padding: 5,
                      borderTopLeftRadius: 30,
                      borderBottomLeftRadius: 30,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="search" size={25} color="black" />
                  </View>
                )}
                returnKeyType={"search"}
                enablePoweredByContainer={false}
                minLength={2}
                query={{
                  key: GOOGLE_MAPS_APIKEY,
                  language: "en",
                  types: "geocode", // default: 'geocode'
                  components: "country:ke",
                }}
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: "distance",
                  // type: 'cafe'
                }}
                renderDescription={(row) =>
                  row.description || row.formatted_address || row.name
                }
                nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                filterReverseGeocodingByTypes={[
                  "locality",
                  "administrative_area_level_3",
                ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                textInputProps={{ onBlur: () => {} }}
                //GooglePlacesDetailsQuery={{ fields: 'formatted_address,geometry' }}
                GooglePlacesDetailsQuery={{
                  fields: "formatted_address,geometry,district",
                }}
                GoogleReverseGeocodingQuery={
                  {
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }
                }
                debounce={400}
              />
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            paddingTop: 10,
          }}
        >
          <Ionicons name="location" color="black" size={26} />

          {location ? (
            <Text>
              latitude: {location.coods.latitude}
              {"\n"}
              longitude: {location.coods.longitude}
            </Text>
          ) : (
            <TouchableOpacity>
              <Text
                onPress={(data, details = null) => {
                  dispatch(
                    setOrigin({
                      location: details.geometry.location,
                      description: data.description,
                    })
                  );
                  dispatch(setDestination(null));
                }}
              >
                {displayCurrentAddress}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <NavOptions />

        <View style={tw`h-1/3`}>
          <MapView
            ref={mapRef}
            style={tw`flex-1`}
            region={mapRegion}
            showsUserLocation={true}
            followsUserLocation={true}
            currentLocation={true}
            showsTraffic={true}
            loadingEnabled={true}
            initialRegion={mapRegion}
          >
            {mapRegion?.location && (
              <Marker
                coordinate={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                }}
                title="Origin"
                description={origin.description}
                identifier="origin"
              >
                <View>
                  <Image source={require("../assets/pin5.png")} />
                </View>
              </Marker>
            )}
          </MapView>

          {address && (
            <TouchableOpacity
              style={{ position: "absolute", top: 20, right: 20 }}
              onPress={() => setAddress(!address)}
            >
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
    height: 60,
    width: 40,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  description: {
    fontWeight: "bold",
  },
});

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
    height: "75%",
    justifyContent: "center",
  },
});

const styl = StyleSheet.create({
  customMarker: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressBox: {
    width: 150,
    height: 45,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addressText: {
    textDecorationLine: "underline",
  },
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
