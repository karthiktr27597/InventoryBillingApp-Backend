import express from "express";
import { login } from "../Controllers/user.js";

const router = express.Router()

router.post("/login", login);

export const userRouter = router;