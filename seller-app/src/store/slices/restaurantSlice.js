import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchRestaurant = createAsyncThunk('restaurant/fetchRestaurant', async () => {
  const response = await api.fetchRestaurant();
  return response.data;
});

export const updateRestaurant = createAsyncThunk('restaurant/updateRestaurant', async (restaurant) => {
  const response = await api.updateRestaurant(restaurant);
  return response.data;
});

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRestaurant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default restaurantSlice.reducer;
