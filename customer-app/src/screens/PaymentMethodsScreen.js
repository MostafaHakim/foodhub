import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const PaymentMethodsScreen = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "card",
      title: "Credit Card",
      details: "**** **** **** 1234",
      isDefault: true,
    },
    {
      id: "2",
      type: "cash",
      title: "Cash on Delivery",
      details: "Pay when you receive your order",
      isDefault: false,
    },
  ]);

  const [cashOnDeliveryEnabled, setCashOnDeliveryEnabled] = useState(true);

  const handleSetDefault = (methodId) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const handleDeleteMethod = (methodId) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPaymentMethods(
              paymentMethods.filter((method) => method.id !== methodId)
            );
          },
        },
      ]
    );
  };

  const renderPaymentMethod = ({ item }) => (
    <View style={styles.methodCard}>
      <View style={styles.methodHeader}>
        <View style={styles.methodIcon}>
          <Icon
            name={item.type === "card" ? "credit-card" : "money"}
            size={24}
            color="#FF6B6B"
          />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>{item.title}</Text>
          <Text style={styles.methodDetails}>{item.details}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.methodActions}>
        {!item.isDefault && item.type !== "cash" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        {item.type !== "cash" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteMethod(item.id)}
          >
            <Icon name="delete" size={18} color="#F44336" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.methodsList}
      />

      {/* Cash on Delivery Toggle */}
      <View style={styles.codSection}>
        <View style={styles.codInfo}>
          <Text style={styles.codTitle}>Cash on Delivery</Text>
          <Text style={styles.codDescription}>
            Pay with cash when your order is delivered
          </Text>
        </View>
        <Switch
          value={cashOnDeliveryEnabled}
          onValueChange={setCashOnDeliveryEnabled}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={cashOnDeliveryEnabled ? "#FF6B6B" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          Alert.alert("Add Payment", "Add payment method feature coming soon!")
        }
      >
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  methodsList: {
    padding: 15,
  },
  methodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: 14,
    color: "#666",
  },
  defaultBadge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  methodActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 15,
  },
  actionText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    marginLeft: "auto",
  },
  codSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default PaymentMethodsScreen;
