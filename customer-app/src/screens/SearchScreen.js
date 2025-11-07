import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { searchRestaurants } from "../store/thunks/restaurantThunks";
import Icon from "react-native-vector-icons/MaterialIcons";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurants);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      setIsSearching(true);
      await dispatch(searchRestaurants(query));
      setIsSearching(false);
    }
  };

  const popularSearches = [
    "Biryani",
    "Pizza",
    "Burger",
    "Chinese",
    "Thai Food",
    "Sushi",
    "Pasta",
    "Sandwich",
    "Coffee",
    "Desserts",
  ];

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() =>
        navigation.navigate("Restaurant", { restaurantId: item._id })
      }
    >
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantCuisine}>{item.cuisineType}</Text>
      <Text style={styles.restaurantRating}>⭐ {item.rating}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {searchQuery.length === 0 ? (
        /* Popular Searches */
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.popularGrid}>
            {popularSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularItem}
                onPress={() => handleSearch(search)}
              >
                <Text style={styles.popularText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : isSearching || loading ? (
        /* Loading State */
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : restaurants.length > 0 ? (
        /* Search Results */
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item._id}
          style={styles.resultsList}
        />
      ) : (
        /* No Results */
        <View style={styles.centerContent}>
          <Icon name="search-off" size={64} color="#ddd" />
          <Text style={styles.noResultsText}>No restaurants found</Text>
          <Text style={styles.noResultsSubtext}>
            Try different keywords or check popular searches
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  popularSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  popularItem: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  popularText: {
    color: "#666",
    fontWeight: "500",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  resultsList: {
    flex: 1,
  },
  restaurantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default SearchScreen;
