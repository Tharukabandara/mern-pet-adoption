import express from 'express';
import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl, updateShippingAddressCtlr, getAllUsersCtrl } from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile', isLoggedIn, getUserProfileCtrl);
userRoutes.get("/", isLoggedIn, isAdmin, getAllUsersCtrl);
userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddressCtlr);


export default userRoutes;