import express from "express";
import storyController from "../controllers/storyController.js";
import checkAuthUser from "../middlewares/auth-middleware.js";

const router = express.Router();
router.use(express.json());

//Unprotected routes
router.post('/get_story_by_category', storyController.getStoriesByCategory);
router.get('/get_story_by_id/:id', storyController.getStoryById);

//Protected routes
router.post('/create_story', checkAuthUser, storyController.createStory);
router.post('/get_my_story', checkAuthUser, storyController.getMyStories);
router.post('/edit_story', checkAuthUser,  storyController.editStory);
router.post('/update_likes_bookmark', checkAuthUser,  storyController.updateLikeBookmark);
router.post('/get_bookmarked_story', checkAuthUser,  storyController.getBookmarkedStories);

export default router;