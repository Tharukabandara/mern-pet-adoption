import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import { createPetAdCtrl, deletePetAdCtrl, getPetAdCtrl, getPetAdsCtrl } from '../controllers/petAdsCtrl.js';

const petAdsRouter = express.Router();

petAdsRouter.post('/', isLoggedIn, upload.array("files"), createPetAdCtrl);
petAdsRouter.get('/', getPetAdsCtrl);
petAdsRouter.get('/:id', getPetAdCtrl);
petAdsRouter.delete('/:id/delete', isLoggedIn, deletePetAdCtrl);

export default petAdsRouter;