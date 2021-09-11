import { profile } from "./profile";
import { Router } from "express";
import { groups } from "./groups";

export const userRouter = Router();

userRouter.get('/profile', profile);
userRouter.get('/groups', groups);