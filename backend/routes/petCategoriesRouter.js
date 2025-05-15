import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createPetCategoryCtrl, deletePetCategoryCtrl, getAllPetCategoriesCtrl, getSinglePetCategoryCtrl, updatePetCategoryCtrl } from '../controllers/petCategoryCtrl.js';
import categoryFileUpload from '../config/categoryFileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';
const petCategoriesRouter = express.Router();

petCategoriesRouter.post("/", isLoggedIn, isAdmin, categoryFileUpload.single("image"), createPetCategoryCtrl);
petCategoriesRouter.get("/", getAllPetCategoriesCtrl);
petCategoriesRouter.get("/:id", getSinglePetCategoryCtrl);
petCategoriesRouter.put("/:id", isLoggedIn, isAdmin, updatePetCategoryCtrl);
petCategoriesRouter.delete("/:id", isLoggedIn, isAdmin, deletePetCategoryCtrl);

export default petCategoriesRouter;