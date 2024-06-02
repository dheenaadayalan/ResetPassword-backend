import express from "express";
import { changePassword, getUserData, login, signup } from "../Controllers/allControllers.js";
import { handelString, nodeMailer } from "../Controllers/mailController.js";


const router = express.Router();

router.post("/create/user",signup);
router.post("/login/user",login);
router.post("/password/reset",nodeMailer);
router.post("/string/verfication",handelString);
router.post("/change/password",changePassword);
router.post("/get/user/data",getUserData);

export default router;