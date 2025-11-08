import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { orderAPI } from '../services/api';
import { updateOrderStatus } from '../store/slices/ordersSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Load order details error:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await orderAPI.updateStatus(orderId, { status: newStatus });
      
      // Update local state and Redux store
      setOrder(prev => ({ ...prev, status: newStatus }));
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
      
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const showStatusUpdateDialog = () => {
    const statusOptions = {
      pending: ['confirmed', 'rejected'],
      confirmed: ['preparing', 'rejected'],
      preparing: ['ready', 'rejected'],
      ready: ['rejected'],
    };

    const availableStatuses = statusOptions[order.status] || [];
    
    if (availableStatuses.length === 0) {
      Alert.alert('Info', 'No further actions available for this order');
      return;
    }

    Alert.alert(
      'Update Order Status',
      `Current status: ${order.status}`,
      availableStatuses.map(status => ({
        text: status.charAt(0).toUpperCase() + status.slice(1),
        onPress: () => handleStatusUpdate(status),
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#2196F3',
      preparing: '#FF9800',
      ready: '#4CAF50',
      assigned: '#9C27B0',
      picked_up: '#673AB7',
      on_the_way: '#3F51B5',
      delivered: '#4CAF50',
      rejected: '#F44336',
      cancelled: '#F44336',
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'schedule',
      confirmed: 'check-circle',
      preparing: 'restaurant',
      ready: 'done',
      assigned: 'person',
      picked_up: 'inventory',
      on_the_way: 'motorcycle',
      delivered: 'home',
      rejected: 'cancel',
      cancelled: 'cancel',
    };
    return icons[status] || 'help';
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Order Header */}
      <View style={styles.header}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>#{order.orderId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Icon name={getStatusIcon(order.status)} size={16} color="#fff" />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
        <Text style={styles.orderTime}>
          {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} color="#666" />
          <Text style={styles.infoText}>{order.customerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color="#666" />
          <Text style={styles.infoText}>{order.customerPhone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={20} color="#666" />
          <Text style={styles.infoText}>{order.deliveryAddress}</Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemPrice}>৳{item.price} x {item.quantity}</Text>
            </View>
            <Text style={styles.itemTotal}>৳{item.totalPrice}</Text>
            {item.specialInstructions && (
              <Text style={styles.specialInstructions}>
                Note: {item.specialInstructions}
              </Text>
            )}
          </View>
        ))}
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>৳{order.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery Fee:</Text>
          <Text style={styles.totalValue}>
            {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>৳{order.taxAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>৳{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Method:</Text>
          <Text style={styles.infoValue}>
            {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : order.paymentMethod}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[
            styles.infoValue,
            { color: order.paymentStatus === 'paid' ? '#4CAF50' : '#FF6B6B' }
          ]}>
            {order.paymentStatus}
          </Text>
        </View>
      </View>

      {/* Rider Information */}
      {order.riderId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rider Information</Text>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#666" />
            <Text style={styles.infoText}>{order.riderId.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#666" />
            <Text style={styles.infoText}>{order.riderId.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="two-wheeler" size={20} color="#666" />
            <Text style={styles.infoText}>{order.riderId.vehicleType}</Text>
          </View>
        </View>
      )}

      {/* Status History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status History</Text>
        {order.statusHistory.slice().reverse().map((history, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyDot} />
            <View style={styles.historyContent}>
              <Text style={styles.historyStatus}>{history.status}</Text>
              <Text style={styles.historyTime}>
                {new Date(history.timestamp).toLocaleString()}
              </Text>
              {history.note && (
                <Text style={styles.historyNote}>{history.note}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={showStatusUpdateDialog}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="update" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Update Status</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {/* Handle call customer */}}
        >
          <Icon name="call" size={20} color="#FF6B6B" />
          <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Call Customer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  orderItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'right',
  },
  specialInstructions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    marginRight: 15,
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  historyNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    padding: 20,
    backgroundColor: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OrderDetailScreen;