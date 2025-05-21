import exppress from "express";
import { createReviewCtrl, deleteReviewCtrl } from "../controllers/reviewsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const reviewRouter = exppress.Router();

reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl);
reviewRouter.delete("/:id", isLoggedIn, deleteReviewCtrl);

export default reviewRouter;
