package com.app.app.service;

import com.app.app.model.Order;
import com.app.app.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order placeOrder(String itemName) {
        Order order = new Order(itemName);
        return orderRepository.save(order);
    }
}
