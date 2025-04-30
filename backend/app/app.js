import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import userRoutes from "../routes/usersRoute.js";
import productsRouter from "../routes/productsRoute.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import petCategoriesRouter from "../routes/petCategoriesRouter.js";
import orderRouter from "../routes/ordersRouter.js";
import Order from "../model/Order.js";
//db connect
dbConnect();

const app = express();

//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_6384cca2060df7a56723bfe373b2a941cb0c443b3e2a0de3f38220fe82f2d643";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event); // Log the actual event
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }

    // // Handle the event
    // switch (event.type) {
    //     case "payment_intent.succeeded":
    //         const payment_Intent = event.data.object;
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //       // ... handle other event types
    //       default:
    //         console.log(`Unhandled event type ${event.type}`);

    // }

    // Return a 200 response to acknowledge receipt of the event
    // response.send();

    // if (event.type === "checkout.session.completed") {
    //   // Handle successful checkout session here
    //   console.log('Checkout session was completed successfully!');
    //   const session = event.data.object;

    //   // Example: fulfill the purchase
    //   // fulfillOrder(session);
    // }

    // response.status(200).json({ received: true });
    // response.send();
  }
);

//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/petCategories/", petCategoriesRouter);
app.use("/api/v1/orders/", orderRouter);

//err middleware
app.use(notFound);
app.use(globalErrHandler); 
export default app;