import express from 'express';
import { createOrderCtrl, getAllOrdersCtrl, getSingleOrderCtrl, updateOrderCtrl, getOrderStatsCtrl, } from '../controllers/orderCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllOrdersCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.put("/update/:id", isLoggedIn, isAdmin, updateOrderCtrl);
orderRouter.get("/sales/sum", isLoggedIn, isAdmin, getOrderStatsCtrl);



export default orderRouter;