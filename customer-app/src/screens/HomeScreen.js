// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { restaurantAPI, orderAPI } from "../services/api";
// import * as Location from "expo-location";
// import Icon from "react-native-vector-icons/MaterialIcons";

// const HomeScreen = ({ navigation }) => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [ordersLoading, setOrdersLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [location, setLocation] = useState(null);
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     getLocationAndRestaurants();
//     fetchRecentOrders();
//   }, []);

//   const getLocationAndRestaurants = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission denied",
//           "Need location permission to find nearby restaurants"
//         );
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location.coords);

//       await fetchNearbyRestaurants(location.coords);
//     } catch (error) {
//       console.error("Location error:", error);
//       Alert.alert("Error", "Failed to get location");
//     }
//   };

//   const fetchNearbyRestaurants = async (coords) => {
//     try {
//       setLoading(true);
//       const response = await restaurantAPI.getNearby({
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         maxDistance: 10,
//       });
//       setRestaurants(response.data);
//     } catch (error) {
//       console.error("Fetch restaurants error:", error);
//       Alert.alert("Error", "Failed to load restaurants");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecentOrders = async () => {
//     try {
//       setOrdersLoading(true);
//       const response = await orderAPI.getMyOrders({ limit: 3 });
//       setRecentOrders(response.data.orders);
//     } catch (error) {
//       console.error("Fetch orders error:", error);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const renderRestaurantItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.restaurantCard}
//       onPress={() =>
//         navigation.navigate("Restaurant", { restaurantId: item._id })
//       }
//     >
//       <Image
//         source={{ uri: item.image || "https://via.placeholder.com/150" }}
//         style={styles.restaurantImage}
//         defaultSource={require("../../assets/placeholder.png")}
//       />
//       <View style={styles.restaurantInfo}>
//         <Text style={styles.restaurantName}>{item.name}</Text>
//         <Text style={styles.restaurantCuisine}>{item.cuisineType}</Text>
//         <Text style={styles.restaurantAddress}>{item.address}</Text>
//         <Text style={styles.restaurantRating}>⭐ {item.rating || "New"}</Text>
//         <Text style={styles.deliveryInfo}>Delivery: 30-45 min</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderOrderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.orderCard}
//       onPress={() =>
//         navigation.navigate("OrderTracking", { orderId: item._id })
//       }
//     >
//       <View style={styles.orderHeader}>
//         <Text style={styles.orderId}>#{item.orderId}</Text>
//         <View
//           style={[
//             styles.statusBadge,
//             { backgroundColor: getStatusColor(item.status) },
//           ]}
//         >
//           <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
//         </View>
//       </View>
//       <Text style={styles.restaurantName}>{item.restaurantId.name}</Text>
//       <Text style={styles.orderTotal}>৳{item.totalAmount.toFixed(2)}</Text>
//       <Text style={styles.orderDate}>
//         {new Date(item.createdAt).toLocaleDateString()}
//       </Text>
//     </TouchableOpacity>
//   );

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "#FFA500",
//       confirmed: "#2196F3",
//       preparing: "#FF9800",
//       ready: "#4CAF50",
//       assigned: "#9C27B0",
//       picked_up: "#673AB7",
//       on_the_way: "#3F51B5",
//       delivered: "#4CAF50",
//       cancelled: "#F44336",
//     };
//     return colors[status] || "#666";
//   };

//   const getStatusText = (status) => {
//     const texts = {
//       pending: "Pending",
//       confirmed: "Confirmed",
//       preparing: "Preparing",
//       ready: "Ready",
//       assigned: "Rider Assigned",
//       picked_up: "Picked Up",
//       on_the_way: "On the Way",
//       delivered: "Delivered",
//       cancelled: "Cancelled",
//     };
//     return texts[status] || status;
//   };

//   const filteredRestaurants = restaurants.filter(
//     (restaurant) =>
//       restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#FF6B6B" />
//         <Text style={styles.loadingText}>Finding restaurants near you...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Hello, {user?.name}!</Text>
//         <Text style={styles.subtitle}>What would you like to order today?</Text>
//       </View>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search restaurants or cuisines..."
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />

//       {/* Recent Orders Section */}
//       {recentOrders.length > 0 && (
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Orders</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
//               <Text style={styles.seeAllText}>See All</Text>
//             </TouchableOpacity>
//           </View>
//           <FlatList
//             data={recentOrders}
//             renderItem={renderOrderItem}
//             keyExtractor={(item) => item._id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.ordersList}
//           />
//         </View>
//       )}

//       {/* Nearby Restaurants Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
//         <FlatList
//           data={filteredRestaurants}
//           renderItem={renderRestaurantItem}
//           keyExtractor={(item) => item._id}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContainer}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No restaurants found nearby</Text>
//           }
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#666",
//   },
//   header: {
//     marginBottom: 20,
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     fontSize: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   section: {
//     marginBottom: 25,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   seeAllText: {
//     color: "#FF6B6B",
//     fontWeight: "600",
//   },
//   ordersList: {
//     paddingRight: 20,
//   },
//   orderCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 15,
//     marginRight: 15,
//     width: 280,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   orderHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   orderId: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   restaurantName: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 5,
//     color: "#333",
//   },
//   orderTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#FF6B6B",
//     marginBottom: 5,
//   },
//   orderDate: {
//     fontSize: 12,
//     color: "#666",
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   restaurantCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 15,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   restaurantImage: {
//     width: 100,
//     height: 100,
//   },
//   restaurantInfo: {
//     flex: 1,
//     padding: 15,
//     justifyContent: "space-between",
//   },
//   restaurantName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#333",
//   },
//   restaurantCuisine: {
//     fontSize: 14,
//     color: "#FF6B6B",
//     marginBottom: 5,
//   },
//   restaurantAddress: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 5,
//   },
//   restaurantRating: {
//     fontSize: 12,
//     color: "#666",
//   },
//   deliveryInfo: {
//     fontSize: 12,
//     color: "#4CAF50",
//     marginTop: 5,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#666",
//     fontSize: 16,
//     marginTop: 50,
//   },
// });

// export default HomeScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNearbyRestaurants,
  fetchFeaturedRestaurants,
  setSearchQuery,
  clearFilters,
} from "../store/thunks/restaurantThunks";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const dispatch = useDispatch();

  const {
    nearbyRestaurants,
    featuredRestaurants,
    loading,
    searchQuery,
    filters,
  } = useSelector((state) => state.restaurants);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getLocationAndRestaurants();
  }, []);

  const getLocationAndRestaurants = async () => {
    try {
      setLoadingLocation(true);
      setLocationError(false);

      // Location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(true);
        Alert.alert(
          "Location Permission Required",
          "We need your location to find restaurants near you. Please enable location permissions in settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Location.requestForegroundPermissionsAsync(),
            },
          ]
        );
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      setLocation(location.coords);

      // Fetch restaurants
      await Promise.all([
        dispatch(fetchNearbyRestaurants(location.coords, 15)), // Increased radius to 15km
        dispatch(fetchFeaturedRestaurants()),
      ]);
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(true);
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Showing popular restaurants instead.",
        [{ text: "OK" }]
      );

      // Fallback: Load restaurants without location
      await dispatch(
        fetchNearbyRestaurants({ latitude: 23.8103, longitude: 90.4125 }, 20)
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocationAndRestaurants();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    dispatch(setSearchQuery(text));
  };

  const handleRetryLocation = () => {
    getLocationAndRestaurants();
  };

  const handleExploreAll = () => {
    // Clear filters and show all restaurants
    dispatch(clearFilters());
    // You can navigate to a search screen or expand search radius
    Alert.alert(
      "Explore More Restaurants",
      "We'll show you restaurants from a wider area.",
      [
        {
          text: "OK",
          onPress: () => dispatch(fetchNearbyRestaurants(location, 25)),
        },
      ]
    );
  };

  const handleSuggestRestaurant = () => {
    Alert.alert(
      "Suggest a Restaurant",
      "Want to see your favorite restaurant here? Let us know!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Contact Support",
          onPress: () =>
            Alert.alert(
              "Contact",
              "Email: support@fooddelivery.com\nPhone: 123-456-7890"
            ),
        },
      ]
    );
  };

  // Empty State Components
  const EmptyRestaurantsState = () => (
    <View style={styles.emptyState}>
      <Icon name="restaurant" size={80} color="#ddd" />
      <Text style={styles.emptyStateTitle}>No Restaurants Found</Text>
      <Text style={styles.emptyStateText}>
        {locationError
          ? "We couldn't find any restaurants in your area. This might be because:"
          : "We're expanding! No restaurants in your area yet."}
      </Text>

      {locationError && (
        <View style={styles.troubleshootList}>
          <Text style={styles.troubleshootItem}>
            • Check your location permissions
          </Text>
          <Text style={styles.troubleshootItem}>
            • Ensure location services are enabled
          </Text>
          <Text style={styles.troubleshootItem}>
            • Try moving to a different area
          </Text>
          <Text style={styles.troubleshootItem}>
            • Expand your search radius
          </Text>
        </View>
      )}

      <View style={styles.emptyStateActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRetryLocation}
        >
          <Icon name="refresh" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleExploreAll}
        >
          <Icon name="explore" size={20} color="#FF6B6B" />
          <Text style={styles.secondaryButtonText}>Explore Wider Area</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={handleSuggestRestaurant}
        >
          <Icon name="lightbulb" size={20} color="#666" />
          <Text style={styles.tertiaryButtonText}>Suggest a Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.loadingText}>
        Discovering delicious food near you...
      </Text>
      <Text style={styles.loadingSubtext}>This may take a moment</Text>
    </View>
  );

  const LocationErrorState = () => (
    <View style={styles.errorState}>
      <Icon name="location-off" size={80} color="#FF6B6B" />
      <Text style={styles.errorStateTitle}>Location Access Needed</Text>
      <Text style={styles.errorStateText}>
        We need your location to show restaurants near you. Please enable
        location services.
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleRetryLocation}
      >
        <Icon name="my-location" size={20} color="#fff" />
        <Text style={styles.primaryButtonText}>Enable Location</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() =>
        navigation.navigate("Restaurant", { restaurantId: item._id })
      }
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.restaurantImage}
        defaultSource={require("../../assets/placeholder.png")}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisineType}</Text>
        <Text style={styles.restaurantAddress} numberOfLines={1}>
          {item.address}
        </Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.restaurantRating}>{item.rating || "New"}</Text>
          </View>
          <Text style={styles.deliveryInfo}>
            🚚 {item.estimatedDeliveryTime || 30} min
          </Text>
          <Text style={styles.deliveryFee}>
            {item.deliveryFee > 0
              ? `৳${item.deliveryFee} delivery`
              : "Free delivery"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() =>
        navigation.navigate("Restaurant", { restaurantId: item._id })
      }
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.featuredImage}
        defaultSource={require("../../assets/placeholder.png")}
      />
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>Featured</Text>
      </View>
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.featuredCuisine} numberOfLines={1}>
          {item.cuisineType}
        </Text>
        <View style={styles.featuredRating}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.featuredRatingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Show loading state
  if (loadingLocation) {
    return <LoadingState />;
  }

  // Show location error state
  if (locationError && nearbyRestaurants.length === 0) {
    return <LocationErrorState />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name}!
            {location && !locationError && (
              <Text style={styles.locationText}> 📍 Nearby</Text>
            )}
          </Text>
          <Text style={styles.subtitle}>
            {nearbyRestaurants.length > 0
              ? "What would you like to order today?"
              : "Let's find some great food for you!"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="person" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines, or dishes..."
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={() => {
            if (searchQuery.trim()) {
              // Implement search functionality
              Alert.alert("Search", `Searching for: ${searchQuery}`);
            }
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => dispatch(setSearchQuery(""))}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRetryLocation}
            >
              <View style={styles.actionIcon}>
                <Icon name="refresh" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.actionText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExploreAll}
            >
              <View style={styles.actionIcon}>
                <Icon name="explore" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.actionText}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Profile")}
            >
              <View style={styles.actionIcon}>
                <Icon name="favorite" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSuggestRestaurant}
            >
              <View style={styles.actionIcon}>
                <Icon name="lightbulb" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.actionText}>Suggest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRestaurants}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
      )}

      {/* Nearby Restaurants */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {nearbyRestaurants.length > 0
              ? `Nearby Restaurants (${nearbyRestaurants.length})`
              : "Restaurants"}
          </Text>
          {nearbyRestaurants.length > 0 && (
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <LoadingState />
        ) : nearbyRestaurants.length > 0 ? (
          <FlatList
            data={nearbyRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsList}
          />
        ) : (
          <EmptyRestaurantsState />
        )}
      </View>

      {/* Help Section */}
      {nearbyRestaurants.length === 0 && (
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>
            Can't find what you're looking for?
          </Text>
          <Text style={styles.helpText}>
            We're constantly adding new restaurants. In the meantime, you can:
          </Text>
          <View style={styles.helpOptions}>
            <TouchableOpacity style={styles.helpOption}>
              <Icon name="business" size={24} color="#FF6B6B" />
              <Text style={styles.helpOptionText}>Suggest a restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpOption}>
              <Icon name="notifications" size={24} color="#FF6B6B" />
              <Text style={styles.helpOptionText}>
                Get notified when we expand
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpOption}>
              <Icon name="support" size={24} color="#FF6B6B" />
              <Text style={styles.helpOptionText}>Contact support</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: "#666",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  profileButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: "row",
  },
  actionButton: {
    alignItems: "center",
    marginRight: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  featuredList: {
    paddingHorizontal: 15,
  },
  featuredCard: {
    width: 160,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: 100,
  },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featuredCuisine: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  featuredRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredRatingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  restaurantsList: {
    paddingHorizontal: 15,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "hidden",
  },
  restaurantImage: {
    width: 100,
    height: 100,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#FF6B6B",
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantRating: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  deliveryInfo: {
    fontSize: 12,
    color: "#666",
  },
  deliveryFee: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  // Empty States
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#999",
  },
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  troubleshootList: {
    alignSelf: "stretch",
    marginBottom: 20,
  },
  troubleshootItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "left",
  },
  emptyStateActions: {
    width: "100%",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  tertiaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
  },
  tertiaryButtonText: {
    color: "#666",
    fontSize: 14,
    marginLeft: 8,
  },
  helpSection: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  helpOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  helpOption: {
    alignItems: "center",
    flex: 1,
    padding: 10,
  },
  helpOptionText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});

export default HomeScreen;
