import { FlatList, TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';

const data = [
    {
       id: "123" ,
       title: "Get a ride",
       image: "https://links.papareact.com/3pn",
       screen: "/map",
    },
    {
        id: "456",
        title: "Order food",
        image: "https://links.papareact.com/28w",
        screen: "/food",
    },
];

const NavOptions = () => {
  const origin = useSelector(selectOrigin);

  const handlePress = (screen: string) => {
    if (origin) {
      router.push(screen as any);
    }
  };

  return (
    <FlatList
     data={data}
     horizontal
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => (
     <TouchableOpacity
        onPress={() => handlePress(item.screen)}
        style={[styles.optionCard, !origin && styles.disabled]}
        disabled={!origin}
       >
       <View style={[styles.content, !origin && styles.disabledContent]}>
             <Image
               style={styles.image}
               source={{ uri: item.image}}
              /> 
                <Text style={styles.title}>{item.title}</Text>
                <Ionicons 
                 style={styles.icon}
                 name="arrow-forward"
                 color="white" 
                 size={20}
               />
            </View>
        </TouchableOpacity>
     )}
    />
  );
};

export default NavOptions;

const styles = StyleSheet.create({
  optionCard: {
    padding: 8,
    paddingLeft: 24,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: '#e5e7eb',
    margin: 8,
    width: 160,
    height: 150,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  disabledContent: {
    opacity: 0.2,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 25,
    width: 40,
    marginTop: 4,
    textAlign: 'center',
  },
});