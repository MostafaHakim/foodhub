// Development এর জন্য sample restaurants data
export const sampleRestaurants = [
  {
    _id: "1",
    name: "Biryani House",
    cuisineType: "Bangladeshi",
    address: "123 Food Street, Dhaka",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96f?w=400",
    rating: 4.5,
    reviewCount: 128,
    estimatedDeliveryTime: 30,
    deliveryFee: 30,
    isOpen: true,
    minOrder: 200,
  },
  {
    _id: "2",
    name: "Pizza Palace",
    cuisineType: "Italian",
    address: "456 Pizza Road, Dhaka",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    rating: 4.2,
    reviewCount: 89,
    estimatedDeliveryTime: 35,
    deliveryFee: 40,
    isOpen: true,
    minOrder: 300,
  },
  {
    _id: "3",
    name: "Burger Hub",
    cuisineType: "Fast Food",
    address: "789 Burger Lane, Dhaka",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    rating: 4.0,
    reviewCount: 67,
    estimatedDeliveryTime: 25,
    deliveryFee: 25,
    isOpen: true,
    minOrder: 150,
  },
  {
    _id: "4",
    name: "Chinese Dragon",
    cuisineType: "Chinese",
    address: "321 Noodle Street, Dhaka",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
    rating: 4.3,
    reviewCount: 142,
    estimatedDeliveryTime: 40,
    deliveryFee: 35,
    isOpen: true,
    minOrder: 250,
  },
  {
    _id: "5",
    name: "Sweet Treats",
    cuisineType: "Desserts",
    address: "654 Sweet Avenue, Dhaka",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    rating: 4.7,
    reviewCount: 203,
    estimatedDeliveryTime: 20,
    deliveryFee: 20,
    isOpen: true,
    minOrder: 100,
  },
];

// Development এর জন্য API mock
export const mockRestaurantAPI = {
  getNearby: async (params) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let filteredRestaurants = [...sampleRestaurants];

    // Apply search filter
    if (params.search) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(params.search.toLowerCase()) ||
          restaurant.cuisineType
            .toLowerCase()
            .includes(params.search.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (params.cuisineType && params.cuisineType !== "all") {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) => restaurant.cuisineType === params.cuisineType
      );
    }

    return { data: filteredRestaurants };
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const restaurant = sampleRestaurants.find((r) => r._id === id);
    return { data: restaurant };
  },
};
