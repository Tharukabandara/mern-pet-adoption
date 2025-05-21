import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import { createStoryCtrl, deleteStoryCtrl, getMyStoriesCtrl, getStoriesCtrl, getStoryCtrl } from '../controllers/storiesCtrl.js';

const storiesRouter = express.Router();

storiesRouter.post('/', isLoggedIn, upload.array("files"), createStoryCtrl);
storiesRouter.get('/', getStoriesCtrl);
storiesRouter.get("/my-stories", isLoggedIn, getMyStoriesCtrl);
storiesRouter.get('/:id', getStoryCtrl);
storiesRouter.delete('/:id', isLoggedIn, deleteStoryCtrl);

export default storiesRouter;