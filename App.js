// App.js
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Role from "./Components/Role";
import Search from "./Components/Screens/Search";
import ConfirmRide from "./Components/Screens/ConfirmRide";
import VehicleOptions from "./Components/Screens/VehicleOptions";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Role"
          screenOptions={{ headerShown: false }}
        >
          {/* Main stack */}
          <Stack.Screen name="Role" component={Role} />
          <Stack.Screen name="ConfirmRide" component={ConfirmRide} />
          <Stack.Screen name="VehicleOptions" component={VehicleOptions} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />

          {/* Modal group (Search slides up from bottom) */}
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              animation: "slide_from_bottom",
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="Search" component={Search} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}