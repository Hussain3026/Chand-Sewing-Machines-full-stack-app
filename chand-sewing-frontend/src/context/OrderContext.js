import React, { createContext, useContext } from "react";
import axiosClient from "../api/axiosClient";

const OrderContext = createContext();

/**
 * NOTE: these are now async (real network calls), unlike the old
 * localStorage mock. Pages that read orders need to fetch them in a
 * useEffect + useState instead of calling these synchronously during
 * render. See Orders.jsx / OrderSuccess.jsx / MyAccount.jsx for the
 * pattern.
 */
export const OrderProvider = ({ children }) => {
  const placeOrder = async ({ shippingAddress, paymentMethod }) => {
    const { data } = await axiosClient.post("/orders", { shippingAddress, paymentMethod });
    return data; // the created order
  };

  // No userId param needed anymore — the backend identifies the user
  // from the login token.
  const getOrdersForUser = async () => {
    const { data } = await axiosClient.get("/orders");
    return data;
  };

  const getOrderById = async (id) => {
    const { data } = await axiosClient.get(`/orders/${id}`);
    return data;
  };

  return (
    <OrderContext.Provider value={{ placeOrder, getOrdersForUser, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
