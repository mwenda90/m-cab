import { FlatList, TouchableOpacity,  Image, Text, View } from 'react-native';
import React, { useState } from 'react';
import tw from "tailwind-react-native-classnames";
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';




const data = [
    {
       id: "123" ,
       title: "Get a ride",
       image: "https://links.papareact.com/3pn",
       screen: "MapScreen",
    },
    {
        id: "456",
        title: "Order food",
        image: "https://links.papareact.com/28w",
        screen: "EatsScreen",
    },
];

const NavOptions = () => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);

  
 
 


  return (
    <FlatList
     data={data}
     horizontal
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => (
     <TouchableOpacity
        onPress={() => navigation.navigate(item.screen)}
        style={[ tw`p-2 pl-6 pb-3 pt-2 bg-gray-200 m-2 w-40`, {height:150}]}
        disabled={!origin}
       
       >
       

            <View style={tw`${!origin && "opacity-20"}`}>
             <Image
               style={{ width: 50, height: 50, 
               resizeMode: "contain" }}
               source={{ uri: item.image}}
              /> 
                <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
                <Icon 
                 style={tw`p-2 bg-black rounded-full w-10 mt-1`}
                 name="arrowright"
                 color="white" 
                 type="antdesign" 
               />
            </View>
        </TouchableOpacity>

     )}

    />
  );
};

export default NavOptions;

