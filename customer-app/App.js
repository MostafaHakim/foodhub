// import React, { useEffect } from "react";
// import { Provider } from "react-redux";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { store } from "./src/store/store";
// import { initializeSocket } from "./src/services/socket";
// import AuthScreen from "./src/screens/AuthScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import RestaurantScreen from "./src/screens/RestaurantScreen";
// import CartScreen from "./src/screens/CartScreen";
// import OrderTrackingScreen from "./src/screens/OrderTrackingScreen";
// import ProfileScreen from "./src/screens/ProfileScreen";

// const Stack = createStackNavigator();

// export default function App() {
//   useEffect(() => {
//     // Initialize socket connection when app starts
//     initializeSocket();

//     return () => {
//       // Cleanup socket connection if needed
//     };
//   }, []);

//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Auth">
//           <Stack.Screen
//             name="Auth"
//             component={AuthScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Restaurant"
//             component={RestaurantScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Cart"
//             component={CartScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="OrderTracking"
//             component={OrderTrackingScreen}
//             options={{
//               title: "Track Order",
//               headerStyle: {
//                 backgroundColor: "#FF6B6B",
//               },
//               headerTintColor: "#fff",
//               headerTitleStyle: {
//                 fontWeight: "bold",
//               },
//             }}
//           />
//           <Stack.Screen
//             name="Profile"
//             component={ProfileScreen}
//             options={{
//               title: "Profile",
//               headerStyle: {
//                 backgroundColor: "#FF6B6B",
//               },
//               headerTintColor: "#fff",
//               headerTitleStyle: {
//                 fontWeight: "bold",
//               },
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </Provider>
//   );
// }
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { store } from "./src/store/store";
import { initializeSocket } from "./src/services/socket";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import all screens
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RestaurantScreen from "./src/screens/RestaurantScreen";
import CartScreen from "./src/screens/CartScreen";
import OrderTrackingScreen from "./src/screens/OrderTrackingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import OrderHistoryScreen from "./src/screens/OrderHistoryScreen";
import FavoriteRestaurantsScreen from "./src/screens/FavoriteRestaurantsScreen";
import AddressManagementScreen from "./src/screens/AddressManagementScreen";
import PaymentMethodsScreen from "./src/screens/PaymentMethodsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "HomeTab") {
          iconName = "home";
        } else if (route.name === "SearchTab") {
          iconName = "search";
        } else if (route.name === "OrdersTab") {
          iconName = "receipt";
        } else if (route.name === "ProfileTab") {
          iconName = "person";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#FF6B6B",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "500",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        title: "Home",
      }}
    />
    <Tab.Screen
      name="SearchTab"
      component={SearchScreen}
      options={{
        title: "Search",
      }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={OrderHistoryScreen}
      options={{
        title: "Orders",
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        title: "Profile",
      }}
    />
  </Tab.Navigator>
);

// Main App Component
export default function App() {
  useEffect(() => {
    // Initialize socket connection when app starts
    initializeSocket();

    return () => {
      // Cleanup socket connection if needed
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          {/* Authentication Stack */}
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          {/* Main App Stack */}
          <Stack.Screen
            name="Main"
            component={HomeTabs}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          {/* Restaurant Stack */}
          <Stack.Screen
            name="Restaurant"
            component={RestaurantScreen}
            options={{
              headerShown: false,
              presentation: "card",
              animation: "slide_from_right",
            }}
          />

          {/* Cart Stack */}
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* Order Tracking Stack */}
          <Stack.Screen
            name="OrderTracking"
            component={OrderTrackingScreen}
            options={{
              title: "Track Order",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerBackTitle: "Back",
              presentation: "card",
            }}
          />

          {/* Search Stack */}
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              title: "Search Restaurants",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              presentation: "card",
            }}
          />

          {/* Order History Stack */}
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{
              title: "Order History",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              presentation: "card",
            }}
          />

          {/* Favorites Stack */}
          <Stack.Screen
            name="Favorites"
            component={FavoriteRestaurantsScreen}
            options={{
              title: "Favorite Restaurants",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              presentation: "card",
            }}
          />

          {/* Address Management Stack */}
          <Stack.Screen
            name="AddressManagement"
            component={AddressManagementScreen}
            options={{
              title: "Delivery Addresses",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              presentation: "card",
            }}
          />

          {/* Payment Methods Stack */}
          <Stack.Screen
            name="PaymentMethods"
            component={PaymentMethodsScreen}
            options={{
              title: "Payment Methods",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              presentation: "card",
            }}
          />

          {/* Profile Stack (Standalone) */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "My Profile",
              headerStyle: {
                backgroundColor: "#FF6B6B",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              presentation: "card",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
