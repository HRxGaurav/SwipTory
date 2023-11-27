import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();
router.use(express.json());

//Unprotected routes
router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/loggedin',userController.loggedIn);

export default router;