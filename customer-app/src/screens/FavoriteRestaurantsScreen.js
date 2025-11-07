import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

const FavoriteRestaurantsScreen = ({ navigation }) => {
  const { restaurants } = useSelector((state) => state.restaurants);

  // Filter favorite restaurants
  const favoriteRestaurants = restaurants.filter(
    (restaurant) => restaurant.isFavorite
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
        <Text style={styles.restaurantRating}>⭐ {item.rating}</Text>
      </View>
      <Icon name="favorite" size={24} color="#FF6B6B" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favoriteRestaurants.length > 0 ? (
        <FlatList
          data={favoriteRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.restaurantsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="favorite-border" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No favorite restaurants</Text>
          <Text style={styles.emptySubtext}>
            Your favorite restaurants will appear here
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  restaurantsList: {
    padding: 15,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  restaurantRating: {
    fontSize: 14,
    color: "#FF6B6B",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default FavoriteRestaurantsScreen;
