import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setDestination, setOrigin, selectOrigin } from "../../slices/navSlice";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import NavOptions from "../../components/NavOptions";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const logoImg = require("../../assets/mcab_logo.jpg");
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
      if (Platform.OS === 'web') {
        // Web fallback location (Nairobi, Kenya)
        const webLocation = {
          latitude: -1.2921,
          longitude: 36.8219,
        };
        setCurrentLocation(webLocation);
        setMapRegion({
          longitude: webLocation.longitude,
          latitude: webLocation.latitude,
          longitudeDelta: 0.0922,
          latitudeDelta: 0.0421,
        });
        setDisplayCurrentAddress("Nairobi, Kenya");
        return;
      }

      // permissions check for mobile
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setMapRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.0922,
        latitudeDelta: 0.0421,
      });

      //get current position lat and long
      const { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        const { latitude, longitude } = coords;

        //provide lat and long to get the the actual address
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        //loop on the response to get the actual result
        for (let item of response) {
          let address = `${item.name} ${item.city}`;
          setDisplayCurrentAddress(address);
        }
      }
    })();
  }, []);

  const handleGetRide = () => {
    router.push('/map');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={logoImg}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ride With Us ?</Text>
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
                listViewDisplayed="auto"
                renderRow={(row) =>
                  row.isCurrentLocation ? (
                    <View style={styles.currentLocationRow}>
                      <Text>📍</Text>
                      <Text style={styles.currentLocationText}>
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
                  <View style={styles.rightButton}>
                    <Ionicons
                      name="location"
                      size={30}
                      color="green"
                      onPress={setLocation}
                    />
                  </View>
                )}
                renderLeftButton={() => (
                  <View style={styles.leftButton}>
                    <Ionicons name="search" size={25} color="black" />
                  </View>
                )}
                returnKeyType={"search"}
                enablePoweredByContainer={false}
                minLength={2}
                query={{
                  key: GOOGLE_MAPS_APIKEY,
                  language: "en",
                  types: "geocode",
                  components: "country:ke",
                }}
                GooglePlacesSearchQuery={{
                  rankby: "distance",
                }}
                renderDescription={(row) =>
                  row.description || row.formatted_address || row.name
                }
                nearbyPlacesAPI="GoogleReverseGeocoding"
                filterReverseGeocodingByTypes={[
                  "locality",
                  "administrative_area_level_3",
                ]}
                textInputProps={{ onBlur: () => {} }}
                GooglePlacesDetailsQuery={{
                  fields: "formatted_address,geometry,district",
                }}
                GoogleReverseGeocodingQuery={{}}
                debounce={400}
              />
            </View>
          </ScrollView>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location" color="black" size={26} />
          {location ? (
            <Text>
              latitude: {location.coods?.latitude}
              {"\n"}
              longitude: {location.coods?.longitude}
            </Text>
          ) : (
            <TouchableOpacity>
              <Text
                onPress={(data, details = null) => {
                  dispatch(
                    setOrigin({
                      location: details?.geometry?.location,
                      description: data?.description,
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

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            followsUserLocation={true}
            showsTraffic={true}
            loadingEnabled={true}
            initialRegion={mapRegion}
          >
            {mapRegion?.location && origin && (
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
                  <Image source={require("../../assets/pin5.png")} />
                </View>
              </Marker>
            )}
          </MapView>

          {address && (
            <TouchableOpacity
              style={styles.addressOverlay}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  content: {
    padding: 12,
  },
  logo: {
    width: 200,
    height: 120,
    resizeMode: "contain",
  },
  titleContainer: {
    borderRadius: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    textDecorationLine: "underline",
  },
  currentLocationRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  currentLocationText: {
    color: 'black',
    marginLeft: 10,
  },
  rightButton: {
    marginLeft: 1,
    backgroundColor: "#DDDDDF",
    flexDirection: "row",
    height: 44,
    padding: 5,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
  },
  leftButton: {
    height: 44,
    flexDirection: "row",
    marginLeft: 2,
    backgroundColor: "#DDDDDF",
    padding: 5,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    alignItems: "center",
  },
  locationContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingTop: 10,
  },
  mapContainer: {
    height: '33%',
  },
  map: {
    flex: 1,
  },
  addressOverlay: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

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
});