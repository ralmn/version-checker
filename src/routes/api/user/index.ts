import { profile } from "./profile";
import { Router } from "express";

export const userRouter = Router();

userRouter.get('/profile', profile);