
import { useState } from 'react';

export const useCustomerState = (
  initialCustomers: any[] = [],
  initialOrders: any[] = []
) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [orders, setOrders] = useState(initialOrders);

  const addCustomer = (customer: any) => {
    setCustomers([...customers, customer]);
  };

  const addOrder = (order: any) => {
    setOrders([...orders, order]);
  };

  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
  };

  return {
    customers,
    orders,
    addCustomer,
    addOrder,
    updateOrderStatus
  };
};
