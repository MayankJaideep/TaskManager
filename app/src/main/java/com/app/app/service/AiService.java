package com.app.app.service;

import com.app.app.model.Order;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final ChatClient chatClient;
    private final OrderService orderService;

    public AiService(ChatClient.Builder builder, OrderService orderService) {
        this.chatClient = builder.build();
        this.orderService = orderService;
    }

    public String process(String input) {
        String lowerInput = input.toLowerCase();

        // 1. Show orders intent
        if (lowerInput.contains("show orders") || lowerInput.contains("list orders") || lowerInput.contains("my orders")) {
            List<Order> orders = orderService.getAllOrders();
            if (orders.isEmpty()) {
                return "You have no orders yet.";
            }
            String orderList = orders.stream()
                    .map(o -> "- " + o.getItemName() + " (Status: " + o.getStatus() + ")")
                    .collect(Collectors.joining("\n"));
            return "Here are your orders:\n" + orderList;
        }

        // 2. Place order intent: "Order a [item]", "Buy [item]", etc.
        Pattern orderPattern = Pattern.compile("(order|buy|purchase)\\s+(a|an)?\\s*(.+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = orderPattern.matcher(input);
        if (matcher.find()) {
            String item = matcher.group(3).trim();
            // Clean up item name (remove punctuation if any)
            item = item.replaceAll("[.!?]$", "");
            Order order = orderService.placeOrder(item);
            return "Sure! I've placed an order for a " + order.getItemName() + ". Your order ID is " + order.getId() + ".";
        }

        // 3. Fallback: Chat with Gemini
        return chatClient.prompt()
                .user(input)
                .call()
                .content();
    }
}
