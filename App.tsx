import React from 'react';
import { KeyboardAvoidingView, Platform} from 'react-native';
import { Provider } from 'react-redux';
import { store } from "./store";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-get-random-values';
import { enableScreens } from 'react-native-screens';

enableScreens();




export default function App() {
  const stack = createStackNavigator();
 
  
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <NavigationContainer>
       <SafeAreaProvider>
        <KeyboardAvoidingView 
         behavior={Platform.OS ==="ios" ? "padding" : "height"}
         style={{ flex: 1 }}
         keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        >
          <stack.Navigator>
           <stack.Screen 
             name="HomeScreen"
             component={HomeScreen} 
             options={{
              headerShown: false,
            }}
         />
           <stack.Screen 
             name="MapScreen"
             component={MapScreen} 
             options={{
              headerShown: false,
            }}
         />
         </stack.Navigator>
        </KeyboardAvoidingView>
       </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  </GestureHandlerRootView>
  );

};

