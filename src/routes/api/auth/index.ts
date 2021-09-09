import {Router} from "express";
import { register } from "./register";


export const authRouter = Router();

authRouter.post('/register', register);