import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createPetCategoryCtrl, deletePetCategoryCtrl, getAllPetCategoriesCtrl, getSinglePetCategoryCtrl, updatePetCategoryCtrl } from '../controllers/petCategoryCtrl.js';
import categoryFileUpload from '../config/categoryFileUpload.js';

const petCategoriesRouter = express.Router();

petCategoriesRouter.post("/", isLoggedIn, categoryFileUpload.single("file"), createPetCategoryCtrl);
petCategoriesRouter.get("/", getAllPetCategoriesCtrl);
petCategoriesRouter.get("/:id", getSinglePetCategoryCtrl);
petCategoriesRouter.put("/:id", updatePetCategoryCtrl);
petCategoriesRouter.delete("/:id", deletePetCategoryCtrl);

export default petCategoriesRouter;