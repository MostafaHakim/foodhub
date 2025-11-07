import { restaurantAPI } from "../../services/api";
import {
  sampleRestaurants,
  mockRestaurantAPI,
} from "../../data/sampleRestaurants";
import {
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
  fetchNearbyRestaurantsStart,
  fetchNearbyRestaurantsSuccess,
  fetchNearbyRestaurantsFailure,
  fetchFeaturedRestaurantsSuccess,
} from "../slices/restaurantSlice";

// Fetch nearby restaurants with fallback to sample data
export const fetchNearbyRestaurants =
  (coordinates, maxDistance = 10) =>
  async (dispatch) => {
    try {
      dispatch(fetchNearbyRestaurantsStart());

      let restaurants = [];

      try {
        // Try to fetch from real API first
        const response = await restaurantAPI.getNearby({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          maxDistance: maxDistance,
        });
        restaurants = response.data;
      } catch (apiError) {
        console.log("API failed, using sample data:", apiError);
        // Fallback to sample data if API fails
        const mockResponse = await mockRestaurantAPI.getNearby({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          maxDistance: maxDistance,
        });
        restaurants = mockResponse.data;
      }

      // If still no restaurants, use all sample data
      if (restaurants.length === 0) {
        restaurants = sampleRestaurants;
      }

      dispatch(fetchNearbyRestaurantsSuccess(restaurants));
    } catch (error) {
      console.error("Fetch nearby restaurants error:", error);

      // Final fallback - use sample data
      dispatch(fetchNearbyRestaurantsSuccess(sampleRestaurants));
    }
  };

// Fetch featured restaurants
export const fetchFeaturedRestaurants = () => async (dispatch) => {
  try {
    // Use sample data for featured restaurants
    const featured = sampleRestaurants
      .filter((restaurant) => restaurant.rating >= 4.0)
      .slice(0, 4);

    dispatch(fetchFeaturedRestaurantsSuccess(featured));
  } catch (error) {
    console.error("Fetch featured restaurants error:", error);
    // Use fallback featured restaurants
    const fallbackFeatured = sampleRestaurants.slice(0, 3);
    dispatch(fetchFeaturedRestaurantsSuccess(fallbackFeatured));
  }
};
