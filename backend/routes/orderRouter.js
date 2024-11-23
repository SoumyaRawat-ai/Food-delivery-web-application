import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, verifyOrder, userOrders, listOrder, updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Route to place an order, protected by authMiddleware
orderRouter.post('/place', authMiddleware, placeOrder);

// Route to verify an order
orderRouter.post('/verify', verifyOrder);

// Route to get user orders, protected by authMiddleware
orderRouter.get('/userorders', authMiddleware, userOrders); // Changed to GET for fetching data

// Route to list all orders
orderRouter.get('/list', listOrder);

// Route to update order status
orderRouter.post('/status', updateStatus);

export default orderRouter;
